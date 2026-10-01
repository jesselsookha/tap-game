import { useState } from 'react'; 
import { View, Text, StyleSheet } from 'react-native';  

function App() {
  return(
    <View style={styles.container}>
      <Text>Tap Game</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe', 
    padding: 20, 
    color: '#333',  
  },
});

export default App; 