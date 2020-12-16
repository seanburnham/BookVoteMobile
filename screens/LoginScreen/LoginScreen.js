import React, { useState, useContext } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import mainContext from '../../src/mainContext'; //The context!!

export default function LoginScreen({navigation}) {

    const { handleLogin } = useContext(mainContext); //Login function which is in App,js, available via context
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
            <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => handleLogin(email, password)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <Text style={{color: "#465881", fontWeight: "bold"}}>Signup</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}