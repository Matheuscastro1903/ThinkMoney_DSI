import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonConfirmarProps {
  label: string;
  onClick: () => void;
}

export default function ButtonConfirmar({ label, onClick }: ButtonConfirmarProps) {

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onClick}          // MUDANÇA 1: onClick → onPress (padrão React Native)
      activeOpacity={0.8}        // MUDANÇA 2: substitui o active:scale-95 do Tailwind — escurece levemente ao pressionar
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,                  // equivalente ao h-[48px]
    paddingHorizontal: 32,       // equivalente ao px-8
    backgroundColor: '#1D1252', // equivalente ao bg-[#0D7FF2]
    borderRadius: 8,             // equivalente ao rounded-lg
    width: '100%',               // equivalente ao w-full
    alignItems: 'center',        // equivalente ao items-center
    justifyContent: 'center',    // equivalente ao justify-center

    // MUDANÇA 3: sombra no React Native é separada por plataforma
    shadowColor: '#000',         
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,                // elevation é exclusivo Android
  },

  label: {
    color: '#fff',               // equivalente ao text-white
    fontWeight: 'bold',          // equivalente ao font-bold
    fontSize: 16,
  },
});