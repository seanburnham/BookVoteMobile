import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('')

    const onReset = () => {
        var auth = firebase.auth();

        auth.sendPasswordResetEmail(email).then(function() {
            // Email sent.
                console.log('Reset sent')
                alert('Reset link has been sent.')
            }).catch(function(error) {
                // An error happened.
                console.log(error)
                alert(error)
            });
        
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.headerText}>
                <Text style={{marginBottom: 10, fontSize: 24, color: '#465881', fontWeight: "bold"}}>Forget something?</Text>
                <Text style={{textAlign: 'center', color: '#465881'}}>Enter your email and we will send you a link to reset your password.</Text>
            </View>
            
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
            <TouchableOpacity style={styles.resetBtn} onPress={() => onReset()}>
                <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
                <Text style={styles.footerText}>Head on back to <Text onPress={() => navigation.navigate('Login')} style={styles.footerLink}>Log in</Text></Text>
            </View>
        </KeyboardAvoidingView>
    )
}