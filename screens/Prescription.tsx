import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../firebase/firebase';

export default function Prescription({ route, navigation }: { route: any, navigation: any }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState({ start: false, end: false });
  const { patientId } = route.params;

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'prescriptions'), where('userId', '==', patientId), orderBy('startDate'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPrescriptions(data);
      });
      return () => unsubscribe();
    }
  }, [patientId]);

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };
//ajouter prescription
  const handleAddPrescription = async () => {
    if (!title || !startDate || !endDate || !description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      await addDoc(collection(db, 'prescriptions'), {
        title,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        description,
        userId: patientId
      });
      setTitle('');
      setStartDate(new Date());
      setEndDate(new Date());
      setDescription('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeletePrescription = async (id) => {
    try {
      await deleteDoc(doc(db, 'prescriptions', id));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderDatePicker = (value, type) => {
    if (Platform.OS === 'web') {
      return (
        <DatePicker
          selected={value}
          minDate={new Date()} 
          onChange={date => handleDateChange(date, type)}
          dateFormat="MMMM d, yyyy"
        />
      );
    } else {
      return (
        <DateTimePicker
           value={value}
           mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(selectedDate, type)}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(prev => ({ ...prev, start: true }))}>
        <Text style={styles.buttonText}>Set Start Date</Text>
      </TouchableOpacity>
      {showDatePicker.start && renderDatePicker(startDate, 'start')}

      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(prev => ({ ...prev, end: true }))}>
        <Text style={styles.buttonText}>Set End Date</Text>
      </TouchableOpacity>
      {showDatePicker.end && renderDatePicker(endDate, 'end')}

      <TouchableOpacity style={styles.button} onPress={handleAddPrescription}>
        <Text style={styles.buttonText}>Add Prescription</Text>
      </TouchableOpacity>

      {prescriptions.map((prescription) => (
        <View key={prescription.id} style={styles.prescriptionContainer}>
          <Text style={styles.prescriptionTitle}>{prescription.title}</Text>
          <Text style={styles.prescriptionDate}>{`Start: ${new Date(prescription.startDate).toLocaleDateString()}`}</Text>
          <Text style={styles.prescriptionDate}>{`End: ${new Date(prescription.endDate).toLocaleDateString()}`}</Text>
          <Text style={styles.prescriptionDescription}>{prescription.description}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePrescription(prescription.id)}>
            <Text style={styles.buttonText}>supprimer</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
  },
  prescriptionContainer: {
    backgroundColor: Colors.grey,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  prescriptionTitle: {
    fontWeight: 'bold',
  },
  prescriptionDate: {},
  prescriptionDescription: {},
});
