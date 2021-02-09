import React, { useEffect, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Button, Divider } from 'react-native-elements';
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function EditGroupScreen({ route, navigation }) {

    const { groupId, usersArray, admin, userId} = route.params;
    const [users, setUsers] = useState([]);


    useEffect(() => {
        if(admin == true){
            let itemRefs = usersArray.map(id => {
                return firebase.firestore().collection('users').doc(id).get();
            });
            Promise.all(itemRefs)
            .then(docs => {
                let items = docs.map(doc => doc.data());
                const users = [];
                items.forEach(function (user) {
                    users.push({
                        username: user.username,
                        //TODO: Add other data like created date
                    })
                });
                setUsers(users)
            })
            .catch(error => console.log(error))
        }
      }, []);

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

    const keyExtractor = (item, index) => index.toString()

    const itemSeparator = () => (
        <View>
            <Divider style={{ backgroundColor: '#b5bfd7', height: 2 }} /> 
        </View>
    )

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.username}>{item.username}</Text>
        </View>
    )
    
    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
            { admin == true ? 
            <FlatList
                ListHeaderComponent={
                    <>
                        <Text style={styles.entityText}>Edit Group Screen</Text>
                    </>
                }
                ItemSeparatorComponent={itemSeparator}
                keyExtractor={keyExtractor}
                data={users}
                renderItem={renderItem}
            />
            :
            <View>
                <Button
                    title="Leave Group"
                    buttonStyle={{backgroundColor: '#fb5b5a', width: '100%'}}
                    onPress={leaveGroup}
                />
            </View>
            }

            
        </KeyboardAvoidingView> 
    )
}
