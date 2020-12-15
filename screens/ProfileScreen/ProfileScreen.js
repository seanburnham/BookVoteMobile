import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Input } from 'react-native-elements';
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import mainContext from '../../src/mainContext'; //The context!!

export default function Profile() {

    const { currentUser } = firebase.auth();
    const { signOutUser } = useContext(mainContext); 

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>User Details</Text>
            <View style={styles.profileDetails}>
                <Input
                    placeholder={currentUser.displayName}
                    label='Username'
                    disabled={true}
                />
                <Input
                    placeholder={currentUser.firstName}
                    label='First Name'
                    disabled={true}
                />
                <Input
                    placeholder={currentUser.lastName}
                    label='Last Name'
                    disabled={true}
                />
                <Input
                    placeholder={currentUser.email}
                    label='Email'
                    disabled={true}
                />
                <Input
                    placeholder={currentUser.city}
                    label='City'
                    disabled={true}
                />
                <Input
                    placeholder={currentUser.state}
                    label='State'
                    disabled={true}
                />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => console.log('Edit')}>
                    <Text style={styles.buttonTitle}>Edit Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={() => signOutUser()}>
                    <Text style={styles.signOutbuttonTitle}>Sign Out</Text>
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
    
}