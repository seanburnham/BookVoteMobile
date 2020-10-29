import React, { useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import mainContext from '../../src/mainContext'; //The context!!

export default function Profile({navigation}) {

    const { currentUser } = Firebase.auth();
    const { signOutUser } = useContext(mainContext); 

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome {currentUser.email}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => signOutUser()}>
                <Text style={styles.buttonTitle}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
    
}