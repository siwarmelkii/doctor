import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../screens/Dashboard";
import HomePage from "../screens/HomePage";
import Personal from "../screens/Personal";
import Prescription from "../screens/Prescription";
import Profile from "../screens/Profile";
import Appointment from "../screens/Rappel";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Liste"
        component={HomePage}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Personal"
        component={Personal}
        options={{
          headerShown: true,
        }}
      />
      
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Prescription"
        component={Prescription}
        options={{
          headerShown: true,
        }}
        ></Stack.Screen>
        <Stack.Screen
        name="Appointment"
        component={Appointment}
        options={{
          headerShown: true,
        }}
        ></Stack.Screen>
        <Stack.Screen
        name="Prescriptions"
        component={Prescription}
        options={{
          headerShown: true,
        }}
        ></Stack.Screen>
    
    </Stack.Navigator>
  );
}
