import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_DURATION = 5; // Game duration in seconds

// Define the type for each high score entry
type Score = {
  id: string;
  taps: number;
  date: string;
};

// User-defined component to render each score item for the FlatList
function renderScoreItem({ item }: { item: Score }) {
  return (
    <View style={styles.scoreItem}>
      <Text style={styles.scoreItemText}>Taps: {item.taps}</Text>
      <Text style={styles.scoreItemText}>Date: {item.date}</Text>
    </View>
  );
}


function App() {
  const [taps, setTaps] = useState<number>(0); // Number of user taps
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION); // Remaining game time
  const [gameActive, setGameActive] = useState<boolean>(false); // Is the game currently running?
  const [highScores, setHighScores] = useState<Score[]>([]); // List of top 5 scores

  // 1 Effect: Timer logic - runs every second while game is active
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } 

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [gameActive, timeLeft]); 

  // 2 Effect: Detects when the game ends and saves the score
  useEffect(() => {
    if (timeLeft === 0 && gameActive) {
      setGameActive(false);        // End the game
      saveScore(taps);             // Save the score once
    }
  }, [timeLeft]); // Only triggers when timeLeft changes

  // 3 Effect: Load saved high scores from AsyncStorage on first render
  useEffect(() => {
    loadScores();
  }, []);

  // Loads scores from persistent storage
  const loadScores = async () => {
    try {
      const storedScores = await AsyncStorage.getItem('#highScores');
      if (storedScores !== null) {
        setHighScores(JSON.parse(storedScores)); // Load and update state
      }
    } catch (e) {
      console.error("Failed to load scores", e);
    }
  };

  // Saves the current score to AsyncStorage and updates the top 5 list
  const saveScore = async (newTaps: number) => {
    const now = new Date();
    const newScore: Score = {
      id: now.getTime().toString(), // Use timestamp as unique ID
      taps: newTaps,
      date: now.toLocaleString(),   // Save human-readable date
    };

    const updatedScores = [...highScores, newScore];

    // Sort and keep top 5 scores
    const top5Scores = updatedScores.sort((a, b) => b.taps - a.taps).slice(0, 5);
    setHighScores(top5Scores);

    try {
      await AsyncStorage.setItem('#highScores', JSON.stringify(top5Scores));
    } catch (e) {
      console.error("Failed to save score", e);
    }
  };

  // Called when user taps the main game button
  const handleTap = () => {
    if (!gameActive) {
      // Start new game
      setGameActive(true);
      setTaps(1);
      setTimeLeft(GAME_DURATION);
    } else {
      // Increment tap count
      setTaps(prevTaps => prevTaps + 1);
    }
  };

  // Reset game state to allow replay
  const handleReset = () => {
    setGameActive(false);
    setTaps(0);
    setTimeLeft(GAME_DURATION);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap Game</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
        <Text style={styles.scoreText}>Taps: {taps}</Text>
      </View>

      {/* 2 styles applied to same 1 component - 2nd style applied based on condition */}
      <TouchableOpacity 
        style={[styles.button, !gameActive && styles.startButton]} 
        onPress={handleTap}
        disabled={!gameActive && timeLeft === 0} // Disable after game ends
      >
        {/* Text display based on nested conditional statement */} 
        <Text style={styles.buttonText}>
          {gameActive ? "TAP" : (timeLeft === 0 ? "GAME OVER" : "START")}
        </Text>
      </TouchableOpacity>

      {timeLeft === 0 && (
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>RESET</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.highScoresTitle}>High Scores</Text>
      <FlatList
        data={highScores}
        renderItem={renderScoreItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 20,
    color: '#d9534f',
  },
  scoreText: {
    fontSize: 20,
    color: '#337ab7',
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
  startButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
  highScoresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  list: {
    width: '100%',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginBottom: 5,
  },
  scoreItemText: {
    fontSize: 16,
    color: '#555',
  },
});

export default App;