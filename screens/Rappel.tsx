import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../firebase/firebase'; // Ensure the paths are correct

export default function Appointment({ route }) {
  const { patientId } = route.params;
  const [appointments, setAppointments] = useState([]);
  const [newAppointmentTitle, setNewAppointmentTitle] = useState('');
  const [newAppointmentDate, setNewAppointmentDate] = useState(new Date());
  const [newAppointmentTime, setNewAppointmentTime] = useState(new Date());
  const [newAppointmentDescription, setNewAppointmentDescription] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'appointments'), where('userId', '==', auth.currentUser.uid), where('patientId', '==', patientId), orderBy('date'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      });
      return () => unsubscribe();
    }
  }, [patientId]);

  const handleDeleteAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddAppointment = async () => {
    if (!newAppointmentTitle || !newAppointmentDate || !newAppointmentTime) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      await addDoc(collection(db, 'appointments'), {
        title: newAppointmentTitle,
        date: newAppointmentDate.toISOString(),
        time: newAppointmentTime.toISOString(),
        description: newAppointmentDescription,
        userId: auth.currentUser.uid,
        patientId: patientId
      });
      setNewAppointmentTitle('');
      setNewAppointmentDate(new Date());
      setNewAppointmentTime(new Date());
      setNewAppointmentDescription('');
    } catch (error) {
      console.error('Error adding appointment:', error);
      Alert.alert('Error', 'Failed to add appointment');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25 }}>Vos rendez-vous</Text>
      <TextInput placeholder="Title" value={newAppointmentTitle} onChangeText={setNewAppointmentTitle} style={styles.input} />
      <TextInput placeholder="Description" value={newAppointmentDescription} onChangeText={setNewAppointmentDescription} style={styles.input} />
      <DatePicker selected={newAppointmentDate} onChange={date => setNewAppointmentDate(date)} style={styles.input} />
      <DatePicker selected={newAppointmentTime} onChange={date => setNewAppointmentTime(date)} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleAddAppointment}>
        <Text style={styles.buttonText}>Add Appointment</Text>
      </TouchableOpacity>
      {/* Display appointments here */}
      {appointments.map((appointment) => (
        <View key={appointment.id} style={styles.appointmentContainer}>
          <Text style={styles.appointmentTitle}>{appointment.title}</Text>
          <Text style={styles.appointmentDate}>{`Date: ${new Date(appointment.date).toLocaleDateString()}`}</Text>
          <Text style={styles.appointmentTime}>{`Time: ${new Date(appointment.time).toLocaleTimeString()}`}</Text>
          <Text style={styles.appointmentDescription}>{appointment.description}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAppointment(appointment.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

// styles object remains unchanged

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 20,
  },
  appointmentContainer: {
    backgroundColor: Colors.grey,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appointmentDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 16,
    marginBottom: 5,
  },
  appointmentDescription: {
    fontSize: 16,
  },
});
