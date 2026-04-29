import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width / 4;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);

  const handleTap = (type, value) => {
    if (type === 'number') {
      setDisplay(display === '0' ? String(value) : display + value);
    }
    if (type === 'clear') {
      setDisplay('0');
      setPrevValue(null);
      setOperator(null);
    }
    if (type === 'posneg') {
      setDisplay(String(parseFloat(display) * -1));
    }
    if (type === 'percentage') {
      setDisplay(String(parseFloat(display) * 0.01));
    }
    if (type === 'operator') {
      setOperator(value);
      setPrevValue(display);
      setDisplay('0');
    }
    if (type === 'equal') {
      const current = parseFloat(display);
      const previous = parseFloat(prevValue);

      if (operator === '+') setDisplay(String(previous + current));
      if (operator === '-') setDisplay(String(previous - current));
      if (operator === 'x') setDisplay(String(previous * current));
      if (operator === '/') setDisplay(String(previous / current));

      setPrevValue(null);
      setOperator(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button text="C" theme="secondary" onPress={() => handleTap('clear')} />
          <Button text="+/-" theme="secondary" onPress={() => handleTap('posneg')} />
          <Button text="%" theme="secondary" onPress={() => handleTap('percentage')} />
          <Button text="/" theme="accent" onPress={() => handleTap('operator', '/')} />
        </View>
        <View style={styles.row}>
          <Button text="7" onPress={() => handleTap('number', 7)} />
          <Button text="8" onPress={() => handleTap('number', 8)} />
          <Button text="9" onPress={() => handleTap('number', 9)} />
          <Button text="x" theme="accent" onPress={() => handleTap('operator', 'x')} />
        </View>
        <View style={styles.row}>
          <Button text="4" onPress={() => handleTap('number', 4)} />
          <Button text="5" onPress={() => handleTap('number', 5)} />
          <Button text="6" onPress={() => handleTap('number', 6)} />
          <Button text="-" theme="accent" onPress={() => handleTap('operator', '-')} />
        </View>
        <View style={styles.row}>
          <Button text="1" onPress={() => handleTap('number', 1)} />
          <Button text="2" onPress={() => handleTap('number', 2)} />
          <Button text="3" onPress={() => handleTap('number', 3)} />
          <Button text="+" theme="accent" onPress={() => handleTap('operator', '+')} />
        </View>
        <View style={styles.row}>
          <Button text="0" size="double" onPress={() => handleTap('number', 0)} />
          <Button text="." onPress={() => handleTap('number', '.')} />
          <Button text="=" theme="accent" onPress={() => handleTap('equal')} />
        </View>
      </View>
    </View>
  );
}

const Button = ({ onPress, text, theme, size }) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.buttonText];

  if (theme === 'secondary') {
    buttonStyles.push(styles.buttonSecondary);
    textStyles.push(styles.buttonTextSecondary);
  } else if (theme === 'accent') {
    buttonStyles.push(styles.buttonAccent);
  }

  if (size === 'double') {
    buttonStyles.push(styles.buttonDouble);
  }

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles}>
      <Text style={textStyles}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' },
  displayContainer: { padding: 20, alignItems: 'flex-end' },
  displayText: { color: '#fff', fontSize: 80, fontWeight: '300' },
  buttonsContainer: { paddingBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    backgroundColor: '#333',
    flex: 1,
    height: BUTTON_WIDTH - 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BUTTON_WIDTH,
    margin: 5,
  },
  buttonDouble: { flex: 0, width: BUTTON_WIDTH * 2 - 10, alignItems: 'flex-start', paddingLeft: 40 },
  buttonSecondary: { backgroundColor: '#a6a6a6' },
  buttonAccent: { backgroundColor: '#f09a36' },
  buttonText: { color: '#fff', fontSize: 30 },
  buttonTextSecondary: { color: '#000' },
});
