import { View, TextInput, StyleSheet, Text } from 'react-native'

interface InputTitleProps {
  label: string
  placeholder: string
  value?: string
  onChangeText?: (texto: string) => void
  atualizando?: (texto: string) => void
   erro?: string | null
}

export default function InputTitle({ label, placeholder, value, onChangeText, erro }: InputTitleProps) {
  return (
    <View style={styles.containerText}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <TextInput
          style={styles.textinput}
          placeholder={placeholder}
          placeholderTextColor="#ccc"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="sentences"
        />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      </View>
    </View>
  )
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
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },

  textinput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    marginLeft: 10,
  },

  label: {
    color: '#484550',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputErro: {
  borderWidth: 1,
  borderColor: "red",
},

erro: {
  color: "red",
  fontSize: 12,
  fontWeight: "bold",
  marginTop: -4,
},
})
