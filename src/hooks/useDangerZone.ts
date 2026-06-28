import { useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Gasto } from '../models/gasto';

const CLUSTER_RADIUS_M = 50;
const DANGER_PROXIMITY_M = 200;
const MIN_GASTOS_PERIGO = 3;
const VIBRATION_PATTERN = [0, 800, 400];

function calcularDistanciaM(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface Cluster {
    latitude: number;
    longitude: number;
    count: number;
    titulo?: string;
}

function agruparGastosPorLocal(gastos: (Gasto & { id: string })[]): Cluster[] {
    const clusters: Cluster[] = [];

    for (const gasto of gastos) {
        const lat = gasto.endereco?.latitude;
        const lon = gasto.endereco?.longitude;
        if (lat == null || lon == null) continue;

        const existente = clusters.find(
            (c) => calcularDistanciaM(c.latitude, c.longitude, lat, lon) <= CLUSTER_RADIUS_M
        );

        if (existente) {
            existente.count += 1;
        } else {
            clusters.push({ latitude: lat, longitude: lon, count: 1, titulo: gasto.endereco?.logradouro });
        }
    }

    return clusters.filter((c) => c.count >= MIN_GASTOS_PERIGO);
}

export interface ZonaPerigo {
    cluster: Cluster;
    distancia: number;
}

export function useDangerZone(
    gastos: (Gasto & { id: string })[],
    controleAvancado: boolean
) {
    const [zonaPerigo, setZonaPerigo] = useState<ZonaPerigo | null>(null);
    const alertadoRef = useRef<Set<string>>(new Set());
    const watchRef = useRef<Location.LocationSubscription | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);

    async function tocarAlarme() {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });

            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/alerta.wav'),
                { shouldPlay: true, isLooping: true, volume: 1.0 }
            );
            soundRef.current = sound;
        } catch (e) {
            console.warn('Erro ao tocar alarme:', e);
        }
    }

    async function pararSom() {
        try {
            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }
        } catch (e) {
            console.warn('Erro ao parar som:', e);
        }
    }

    useEffect(() => {
        if (!controleAvancado) {
            watchRef.current?.remove();
            watchRef.current = null;
            Vibration.cancel();
            pararSom();
            return;
        }

        let ativo = true;

        async function iniciar() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted' || !ativo) return;

            const clusters = agruparGastosPorLocal(gastos);
            if (clusters.length === 0) return;

            watchRef.current = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 20 },
                (location) => {
                    const { latitude, longitude } = location.coords;

                    for (const cluster of clusters) {
                        const dist = calcularDistanciaM(latitude, longitude, cluster.latitude, cluster.longitude);
                        const chave = `${cluster.latitude.toFixed(5)},${cluster.longitude.toFixed(5)}`;

                        if (dist <= DANGER_PROXIMITY_M && !alertadoRef.current.has(chave)) {
                            alertadoRef.current.add(chave);
                            setZonaPerigo({ cluster, distancia: Math.round(dist) });
                            Vibration.vibrate(VIBRATION_PATTERN, true);
                            tocarAlarme();
                            Notifications.scheduleNotificationAsync({
                                content: {
                                    title: 'Zona de risco financeiro!',
                                    body: 'Você está próximo de um local com muitos gastos registrados.',
                                    sound: true,
                                },
                                trigger: null,
                            });
                            break;
                        }

                        if (dist > DANGER_PROXIMITY_M + 100) {
                            alertadoRef.current.delete(chave);
                        }
                    }
                }
            );
        }

        iniciar();

        return () => {
            ativo = false;
            watchRef.current?.remove();
            watchRef.current = null;
            pararSom();
        };
    }, [gastos, controleAvancado]);

    const pararAlarme = () => {
        Vibration.cancel();
        pararSom();
    };

    const fecharAlerta = () => {
        setZonaPerigo(null);
    };

    return { zonaPerigo, pararAlarme, fecharAlerta };
}
