import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function RegistrationScreen({navigation}) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
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
                        navigation.navigate('Home')
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                alert(error)
        });
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
            <Image style={styles.logo} source={require('../../assets/newLogo.png')} />
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder='Full Name'
                    placeholderTextColor="white"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder='E-mail'
                    placeholderTextColor="white"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholderTextColor="white"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholderTextColor="white"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onRegisterPress()}>
                <Text style={styles.buttonTitle}>Create account</Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
                <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
            </View>
        </KeyboardAvoidingView>
    )
}