import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import mainContext from '../../src/mainContext'; //The context!!
import { ScrollView } from 'react-native-gesture-handler';

export default function Profile() {

    const {currentUser} = firebase.auth();
    const { signOutUser } = useContext(mainContext); 
    const [disableBtn, setDisableBtn] = useState(true);
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [queriedUser, setQueriedUser] = useState([])
    const [userData, setUserData] = useState({})
    const [errorExists, setErrorExists] = useState(false);

    useEffect(() => {
        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        userRef.get().then(function(doc) {
            if (doc.exists) {
                setQueriedUser(doc.data())
            } else {
                console.log("No such document!");
            }
          }).catch(function(error) {
              console.log("Error getting document:", error);
        });

        setUserData({})
        // setTimeout(() => setLoading(false), 1000);

      }, []);


    const onSubmit = () => {

        if(username.trim().length > 0){

            currentUser.updateProfile({
                displayName: username
              }).then(function() {
                setErrorExists(false)
                console.log('Updated Displayname')
              }).catch(function(error) {
                console.log('Error updating display name: ' + error)
                setErrorExists(true)
                alert('Error updating username.')
                return
              });
        }

        if(email.trim().length > 0){

            currentUser.updateEmail(email).then(function() {
                setErrorExists(false)
                console.log('Updated user email')

                currentUser.sendEmailVerification().then(function() {
                    console.log('Email sent.')
                    alert('Verification email sent.')
                  }).catch(function(error) {
                    console.log(error)
                  });

              }).catch(function(error) {
                // An error happened.
                console.log('Error updating user email: ' + error)
                setErrorExists(true)
                alert(error)
                return
              });
        }

        if(firstName.trim().length > 0){
            userData.firstName = firstName
            setFirstName('')
        }
        if(lastName.trim().length > 0){
            userData.lastName = lastName
            setLastName('')
        }
        if(city.trim().length > 0){
            userData.city = city
            setCity('')
        }
        if(state.trim().length > 0){
            userData.state = state
            setState('')
        }

        if(Object.keys(userData).length > 0 && errorExists == false){
            console.log(errorExists)
            const usersRef = firebase.firestore().collection('users')
            usersRef.doc(currentUser.uid).update(userData)
                .then(() => {
                    setDisableBtn(true)
                    setUserData({})
                    console.log('User updated')
                    alert('User successfully updated!')
                })
                .catch((error) => {
                    alert(error)
                    console.log(error)
                });
        }

    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView>
                <View style={{alignItems:'center'}}>
                    <Avatar 
                        rounded 
                        size={'large'} 
                        icon={{ name: 'account', type:'material-community', color:'white' }} 
                        containerStyle={{backgroundColor: 'gray'}}
                    />
                </View>
                
                <View style={styles.profileDetails}>
                    <Text>{StatusBar.currentHeight}</Text>
                    <Input
                        placeholder='Username'
                        label='Username'
                        onChangeText={(text) => setUsername(text)}
                        defaultValue={currentUser.displayName}
                        onKeyPress={() => setDisableBtn(false)}
                    />
                    <Input
                        defaultValue={queriedUser.firstName}
                        label='First Name'
                        placeholder='First Name'
                        onChangeText={(text) => setFirstName(text)}
                        onKeyPress={() => setDisableBtn(false)}
                    />
                    <Input
                        defaultValue={queriedUser.lastName}
                        label='Last Name'
                        placeholder='Last Name'
                        onChangeText={(text) => setLastName(text)}
                        onKeyPress={() => setDisableBtn(false)}
                    />
                    <Input
                        defaultValue={currentUser.email}
                        label='Email'
                        placeholder='Email'
                        onChangeText={(text) => setEmail(text)}
                        onKeyPress={() => setDisableBtn(false)}
                    />
                    <Input
                        defaultValue={queriedUser.city}
                        label='City'
                        placeholder='City'
                        onChangeText={(text) => setCity(text)}
                        onKeyPress={() => setDisableBtn(false)}
                    />
                    <Input
                        defaultValue={queriedUser.state}
                        label='State'
                        placeholder='State'
                        onChangeText={(text) => setState(text)}
                        onKeyPress={() => setDisableBtn(false)}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                    <Button
                        title="Save Changes"
                        buttonStyle={styles.editButton}
                        containerStyle={{ marginRight: 10, marginTop: 20}}
                        disabled={disableBtn}
                        onPress={() => onSubmit()}
                    />

                    <Button
                        title="Sign Out"
                        type="outline"
                        buttonStyle={styles.signOutButton}
                        containerStyle={{ marginLeft: 10, marginTop: 20}}
                        titleStyle={{color:'#465881'}}
                        onPress={() => signOutUser()}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
    
}