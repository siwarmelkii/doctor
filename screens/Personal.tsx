import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { db } from '../firebase/firebase';

export default function Personal() {
  const [workingHours, setWorkingHours] = useState({
    lundi: { start: '', end: '' },
    mardi: { start: '', end: '' },
    mercredo: { start: '', end: '' },
    jeudi: { start: '', end: '' },
    vendredi: { start: '', end: '' },
    samedi: { start: '', end: '' },
    dimanche: { start: '', end: '' },
  });
  const [restDays, setRestDays] = useState([]);

  const handleInputChange = (day, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleRestDaysChange = (day) => {
    setRestDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, 'doctor_schedule'), {
        workingHours,
        restDays,
      });
      Alert.alert('Success', 'Schedule saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save schedule');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal</Text>

      {Object.keys(workingHours).map((day) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
          <TextInput
            placeholder="Début de travail"
            value={workingHours[day].start}
            onChangeText={(text) => handleInputChange(day, 'start', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="fin de travail"
            value={workingHours[day].end}
            onChangeText={(text) => handleInputChange(day, 'end', text)}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => handleRestDaysChange(day)}
            style={restDays.includes(day) ? styles.selectedButton : styles.button}
          >
            <Text style={styles.buttonText}>
              {restDays.includes(day) ? 'Rest Day' : 'Working Day'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
  },
  dayContainer: {
    marginBottom: 15,
  },
  dayLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.white,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
