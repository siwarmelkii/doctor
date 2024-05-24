import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");
let top;
if (Platform.OS === "ios") {
  top = height * 0.02;
} else {
  top = 0;
}

export default function Signup({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<any>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<number | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSignup = async () => {
    setLoading(true);
   // Password validation
   if (password.length < 8) {
    alert("Le mot de passe doit comporter au moins 8 caractères.");
    setLoading(false);
    return;
  }

  // Phone number validation
  if (!/^\d{8}$/.test(String(phone))) {
    alert("Le numéro de téléphone doit contenir exactement 8 chiffres.");
    setLoading(false);
    return;
  }
    
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
 
      await setDoc(doc(db, "users", user.uid), {
        Name: username,
        Email: email,
        PhoneNumber: phone,
        CreatedAt: new Date().toUTCString(),
        grade: "medecin",
        EmailVerified: false,

      });
  
      await sendEmailVerification(user);
  
      alert("Compte créé avec succès 🎉. Veuillez vérifier votre email.");
      setLoading(false);
      navigation.push("Login");
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.loginHeader}>
        <Text style={styles.loginHeaderText}>S'inscrire en tant que docteur 🎉</Text>
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.loginContainer}>
        {/* Username */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Nom d'utilisateur</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        {/* Email */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Email</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Votre email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        {/* Phone Number */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Numéro de téléphone</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Votre numéro ici"
            value={phone?.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setPhone(text)}
          />
        </View>
        {/* Password */}
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordText}>Mot de passe</Text>
          <TextInput
            style={styles.passwordInput}
            placeholder="Votre mot de passe"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* Signup Button */}
        <View style={styles.loginButton}>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.loginButtonText}>
              {loading ? "Création d'un compte..." : "Créer un compte"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupGroup}>
          <Text style={styles.new}>Déjà membre?</Text>
          <TouchableOpacity onPress={() => navigation.push("Login")}>
            <Text style={styles.signup}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: height * 0.05,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  loginHeader: {
    marginTop: 20,
  },
  loginHeaderText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  loginContainer: {
    marginTop: 20,
  },
  emailContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emailInput: {
    marginTop: 10,
    width: "100%",
    height: 50,
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 8,
    paddingLeft: 10,
  },
  passwordContainer: {
    marginTop: 20,
  },
  passwordText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordInput: {
    marginTop: 10,
    width: "100%",
    height: 50,
    backgroundColor: Colors.light,
    borderRadius: 8,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  forgotContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  forgotText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  loginButton: {
    marginTop: 20,
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
  signupGroup: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signup: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  new: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
});
