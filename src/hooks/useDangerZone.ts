import { useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Gasto } from '../models/gasto';

// Raio de agrupamento de gastos (metros)
const CLUSTER_RADIUS_M = 50;
// Distância máxima para alertar o usuário (metros)
const DANGER_PROXIMITY_M = 200;
// Número mínimo de gastos para considerar local perigoso
const MIN_GASTOS_PERIGO = 3;

// Padrão de vibração: liga 800ms, desliga 400ms, repete
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

    useEffect(() => {
        if (!controleAvancado) {
            watchRef.current?.remove();
            watchRef.current = null;
            Vibration.cancel();
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
                            // Inicia vibração contínua
                            Vibration.vibrate(VIBRATION_PATTERN, true);
                            // Dispara notificação sonora (som do sistema)
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

                        // Reseta o alerta quando o usuário se afastar
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
        };
    }, [gastos, controleAvancado]);

    const pararAlarme = () => {
        Vibration.cancel();
    };

    const fecharAlerta = () => {
        setZonaPerigo(null);
    };

    return { zonaPerigo, pararAlarme, fecharAlerta };
}
