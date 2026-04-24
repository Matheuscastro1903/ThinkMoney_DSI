import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonConfirmarProps {
  label: string;
  onClick: () => void;
  
}

export default function ButtonDeletarLembretes({ label, onClick }: ButtonConfirmarProps) {

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
    height: 48,                  
    paddingHorizontal: 32,       
    backgroundColor: '#ff0000', 
    borderRadius: 8,             // equivalente ao rounded-lg
    width: 300,               
    alignItems: 'center',        // equivalente ao items-center
    justifyContent: 'center',    // equivalente ao justify-center

    
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