import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

//Our context
import mainContext from './src/mainContext';

import { firebase } from './src/firebase/config'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, RegistrationScreen, TabNavigation } from './screens'

const Stack = createStackNavigator();

export default function App() {

  const [userLogged, setUserLogged] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //on startup let's check if we are alredy authenticated, adjusting the previous variable accordingly
  useEffect(() => {
    const authListener = firebase.auth().onAuthStateChanged((user) => {
      setUserLogged(user ? true : false);
      setIsLoading(false);
      setUserProfile(user);
    });
    return authListener;
  }, []); //<--- this means that useEffet will only run once, and not on every update

  const doLogin = async (email, password) => {
    setIsLoading(true);

    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
          const uid = response.user.uid
          const usersRef = firebase.firestore().collection('users')
          usersRef.doc(uid).get()
            .then(firestoreDocument => {
                if (!firestoreDocument.exists) {
                    alert("User does not exist anymore.")
                    return;
                }
            })
            .catch(error => {
              console.log(error)
              alert(error)
            });
      })
      .catch(error => {
          if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            alert('Invalid combination of Email and Password');
          } 
          else {
            alert(error);
            console.log(error)
          }
      });

    setIsLoading(false);
  };

  const doSignup = async (username, email, password) => {
    setIsLoading(true);

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
          const timestamp = firebase.firestore.FieldValue.serverTimestamp();
          response.user.updateProfile({
            displayName: username
          });
          const uid = response.user.uid
          const data = {
              id: uid,
              createdAt: timestamp,
          };
          const usersRef = firebase.firestore().collection('users')
          usersRef.doc(uid).set(data)
              .then(() => {
                  console.log('New User Created')
              })
              .catch((error) => {
                  alert(error)
                  console.log(error)
              });
      })
      .catch((error) => {
          alert(error)
          console.log(error)
      });

    setIsLoading(false);
  };


  //this mainC will be passed to the context, so that every child of the provider will access these functions and objects
  const mainC = useMemo(
    () => ({
      userProfile: { userProfile },
      signOutUser: () => firebase.auth().signOut(),
      handleLogin: (email, password) => {
        doLogin(email, password);
      },
      handleSignup: (fullName, email, password) => {
        doSignup(fullName, email, password);
      },
    }),
    []
  );
 //This would render at startup (while checking if we are already logged)  
 //and during login (see above, we use setIsLoading(true) at the beginning of authentication)
 //This way the user will see a spinning wheel while the app is "working" in background
 
  if (isLoading) {
    // Checking if already logged in
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" color='#465881' />
      </View>
    );
  }


//Once the isLoading is gone (logged or not logged) the app will render this stack
  return (
    <mainContext.Provider value={mainC}> 
      <StatusBar
        barStyle="light-content"
      />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {userLogged == false ? (
              <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
              </>
            ) : (
              <>
                <Stack.Screen name='Home' component={TabNavigation} options={{ headerShown: false }}/>
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
    </mainContext.Provider>
  );
}