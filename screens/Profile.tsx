import { addDoc, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../firebase/firebase'; // Ensure the path is correct
import { WebView } from 'react-native-webview';

export default function Profile({ route, navigation }: { route: any, navigation: any }) {
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [rythmeCardiaque, setRythmeCardiaque] = useState('');
  const [tension, setTension] = useState('');
  const [glycemie, setGlycemie] = useState('');
  const [imc, setImc] = useState(0);
  const [historique, setHistorique] = useState([]);

  const { patientId } = route.params;

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "usersData"), where("userId", "==", patientId), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistorique(items);
      });
      return () => unsubscribe();
    }
  }, [patientId]);

  const handleCalculIMC = async () => {
    if (!poids || !taille) {
      console.error("Please enter both weight and height");
      return;
    }
    const imcCalculated = parseFloat(poids) / (parseFloat(taille) / 100) ** 2; // Correct calculation for IMC
    setImc(Math.round(imcCalculated));

    try {
      await addDoc(collection(db, "usersData"), {
        userId: patientId,
        poids,
        taille,
        rythmeCardiaque,
        tension,
        glycemie,
        imc: imcCalculated,
        date: new Date()
      });
      setPoids('');
      setTaille('');
      setRythmeCardiaque('');
      setTension('');
      setGlycemie('');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Votre profil</Text>
      {/* <iframe seamless width="80%"  height="150" src="https://stem.ubidots.com/app/dashboards/public/widget/aDa2T6ZA5ms6ODO-1NJtYXkZ7kK5snke1ElFo36TxIU?embed=true"></iframe> */}
      {/* <iframe width="80%" height="450"  src="https://stem.ubidots.com/app/dashboards/public/widget/H7HpCgZepYjjvxuVDwePr4h6w6xb75E4VjtEsDUOO_0?embed=true"></iframe>       */}
      <WebView
        style={styles.webView}
        source={{ uri: 'https://stem.ubidots.com/app/dashboards/public/widget/H7HpCgZepYjjvxuVDwePr4h6w6xb75E4VjtEsDUOO_0?embed=true' }}
      />
      {/* <TextInput style={styles.input} placeholder="Poids (kg)" onChangeText={setPoids} keyboardType="numeric" value={poids} />
      <TextInput style={styles.input} placeholder="Taille (cm)" onChangeText={setTaille} keyboardType="numeric" value={taille} />
      <TextInput style={styles.input} placeholder="Rythme cardiaque" onChangeText={setRythmeCardiaque} keyboardType="numeric" value={rythmeCardiaque} />
      <TextInput style={styles.input} placeholder="Tension" onChangeText={setTension} keyboardType="numeric" value={tension} />
      <TextInput style={styles.input} placeholder="Glycémie" onChangeText={setGlycemie} keyboardType="numeric" value={glycemie} /> */}

      {/* <TouchableOpacity style={styles.button} onPress={handleCalculIMC}>
        <Text style={styles.buttonText}>Calculer IMC</Text>
      </TouchableOpacity> */}

      {imc ? <Text style={styles.result}>IMC: {imc}</Text> : null}

      <View style={styles.historyContainer}>
        {historique.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text>Poids: {item.poids} kg</Text>
            <Text>Taille: {item.taille} cm</Text>
            <Text>IMC: {item.imc}</Text>
            <Text>Rythme Cardiaque: {item.rythmeCardiaque}</Text>
            <Text>Tension: {item.tension}</Text>
            <Text>Glycémie: {item.glycemie}</Text>
            <Text>Date: {item.date.toDate().toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.gray,
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    padding: 8,
    margin: 10,
    width: 300,
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 20,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  historyContainer: {
    marginTop: 30,
    width: '100%',
  },
  card: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: Colors.lightBlue,
  },
  webView: {
    flex: 1,
  },
});
