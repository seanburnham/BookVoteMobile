import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef.doc(uid).get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data()
                        navigation.navigate('Home', {user})
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    }

    const onForgotPress = (btnName) => {
        if(btnName == 'Forgot'){
          console.log(btnName)
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
            <Image style={styles.logo} source={require('../../assets/newLogo.png')} />
            <View style={styles.inputView} >
                <TextInput  
                style={styles.inputText}
                placeholder="Email" 
                placeholderTextColor="white"
                onChangeText={(text) => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
                autoCapitalize="none"/>
            </View>
            <View style={styles.inputView} >
                <TextInput  
                secureTextEntry
                style={styles.inputText}
                placeholder="Password" 
                placeholderTextColor="white"
                onChangeText={(text) => setPassword(text)}
                value={password}
                underlineColorAndroid="transparent"
                autoCapitalize="none"/>
            </View>
            <TouchableOpacity onPress={() => onForgotPress('Forgot')}>
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => onLoginPress()}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onFooterLinkPress}>
                <Text style={{color: "#465881", fontWeight: "bold"}}>Signup</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}