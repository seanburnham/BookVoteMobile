import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Button } from 'react-native-elements';
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function EditGroupScreen({ route, navigation }) {

    const { groupId, admin, userId} = route.params;

    const leaveGroup = () => {

        //TODO: Check to see if more than one admin exists if user is leaving as an admin

        const groupToUpdate = firebase.firestore().collection('groups').doc(groupId);
        groupToUpdate.update({
            'users': firebase.firestore.FieldValue.arrayRemove(userId),
            'admins': firebase.firestore.FieldValue.arrayRemove(userId),
        })
        .then(() => {
            console.log('Leaving Group')
            navigation.navigate('GroupsHome')
        })
    }

    return (
        <View style={styles.container}>
            { admin == true ? 
            <View>
                <Text style={styles.entityText}>Edit Group Screen</Text>
            </View>
            :
            <View>
                <Button
                    title="Leave Group"
                    buttonStyle={{backgroundColor: '#fb5b5a', width: '100%'}}
                    onPress={leaveGroup}
                />
            </View>
            }

            
        </View>
    )
}
