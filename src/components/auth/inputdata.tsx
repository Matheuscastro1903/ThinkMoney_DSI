import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MaskInput from "react-native-mask-input"; 

interface InputDateProps {
    label: string;
    icon: any;
    onChange?: (data: Date) => void;
}

export default function InputDate({ label, icon, onChange }: InputDateProps) {
    const [textoExibido, setTextoExibido] = useState('');

    function aoDigitar(masked: string, unmasked: string) {
        setTextoExibido(masked);

        if (masked.length === 10) {
            const [dia, mes, ano] = masked.split('/').map(Number);
            
            // Month is 0-indexed: January = 0
            const dataConvertida = new Date(ano, mes - 1, dia);

            // Robust validation:
            // 1. Check if it's a valid Date object
            // 2. Check if JS "auto-corrected" the date (e.g., 31/02 becomes 02/03)
            const isValid = !isNaN(dataConvertida.getTime()) && 
                          dataConvertida.getDate() === dia && 
                          dataConvertida.getMonth() === mes - 1;

            if (isValid) {
                onChange?.(dataConvertida);
            }
        }
    }

    return (
        <View style={styles.containerText}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.input}>
                <Image source={icon} style={styles.icon} />
                <MaskInput
                    style={styles.textinput}
                    value={textoExibido}
                    // Using the recommended format for react-native-mask-input
                    onChangeText={aoDigitar}
                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#ccc"
                    keyboardType="numeric"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerText: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 10,
        gap: 8,
    },
    input: {
        backgroundColor: '#EDEEEF',
        borderRadius: 10,
        width: 300,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    textinput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        marginLeft: 10,
        color: '#000', // Good practice to define text color
    },
    icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    label: {
        color: '#484550',
        fontSize: 12,
        fontWeight: 'bold',
    },
});