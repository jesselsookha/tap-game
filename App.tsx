import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function App() {
  const [taps, setTaps] = useState<number>(0);

  const handleTap = () => {
    setTaps(taps + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap Game</Text>
      <TouchableOpacity style={styles.button} onPress={handleTap}>
        <Text style={styles.buttonText}>{taps}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;