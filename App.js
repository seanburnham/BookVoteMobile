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
import { LoginScreen, HomeScreen, RegistrationScreen } from './screens'
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function App() {

  const [userLogged, setUserLogged] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //on startup let's check if we are alredy authenticated, adjusting the previous variable accordingly
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUserLogged(user ? true : false);
      setIsLoading(false);
      setUserProfile(user);
    });
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
          alert(error)
          console.log(error)
      });

    setIsLoading(false);
  };

  const doSignup = async (email, password) => {
    setIsLoading(true);

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((response) => {
          const timestamp = firebase.firestore.FieldValue.serverTimestamp();
          const uid = response.user.uid
          const data = {
              id: uid,
              email,
              fullName,
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
      handleSignup: (email, password) => {
        doSignup(email, password);
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
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }


//Once the isLoading is gone (logged or not logged) the app will render this stack
  return (
    <mainContext.Provider value={mainC}> 
        <NavigationContainer theme={theme}>
          <Stack.Navigator initialRouteName="Login">
            {userLogged == false ? (
              <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
              </>
            ) : (
              <>
                <Stack.Screen name="Home" options={{ headerShown: false }}>
                  {props => <HomeScreen {...props} extraData={userProfile} />}
                </Stack.Screen>
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
    </mainContext.Provider>
  );



  // const [loading, setLoading] = useState(true)
  // const [user, setUser] = useState(null)

  // useEffect(() => {
  //   const usersRef = firebase.firestore().collection('users');
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       usersRef.doc(user.uid).get()
  //         .then((document) => {
  //           const userData = document.data()
  //           setLoading(false)
  //           setUser(userData)
  //         })
  //         .catch((error) => {
  //           setLoading(false)
  //         });
  //     } else {
  //       setLoading(false)
  //     }
  //   });
  // }, []);

  // if (loading) {
  //   return (
  //     <></>
  //   )
  // }

  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       { user ? (
  //         <Stack.Screen name="Home" options={{ headerShown: false }}>
  //           {props => <HomeScreen {...props} extraData={user} />}
  //         </Stack.Screen>
  //       ) : (
  //         <>
  //           <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  //           <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
  //         </>
  //       )}
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}