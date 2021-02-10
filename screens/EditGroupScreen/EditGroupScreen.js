import React, { useEffect, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, Alert, Switch } from 'react-native'
import { Button, Divider, Icon, Input } from 'react-native-elements';
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function EditGroupScreen({ route, navigation }) {

    const { group, usersArray, admin, userId} = route.params;
    const [users, setUsers] = useState([]);
    const currentUser = firebase.auth().currentUser;
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [privateGroup, setPrivateGroup] = useState(false);
    const [showSaveBtn, setShowSaveBtn] = useState(false);


    useEffect(() => {
        if(admin == true){

            setGroupName(group.name);
            setGroupDescription(group.description);
            setPrivateGroup(group.isPrivate);

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
                        id: user.id
                        //TODO: Add other data like created date
                    })
                });
                setUsers(users)
            })
            .catch(error => console.log(error))
        }
      }, []);

    const toggleSwitch = () => {
        setPrivateGroup(previousState => !previousState);
        setShowSaveBtn(true);
    }

    const deletUser = (userID) => {
        const groupToUpdate = firebase.firestore().collection('groups').doc(group.id);
        groupToUpdate.update({
            'users': firebase.firestore.FieldValue.arrayRemove(userID),
            'admins': firebase.firestore.FieldValue.arrayRemove(userID),
        })
        .then(() => {
            console.log('Deleted User')
            usersArray.splice(usersArray.indexOf(userID), 1);
            let newUsersArray = users.filter(function( obj ) {
                return obj.id !== userID;
            });
            setUsers(newUsersArray);
        })
    }

    const leaveGroup = () => {

        //TODO: Check to see if more than one admin exists if user is leaving as an admin

        const groupToUpdate = firebase.firestore().collection('groups').doc(group.id);
        groupToUpdate.update({
            'users': firebase.firestore.FieldValue.arrayRemove(userId),
            'admins': firebase.firestore.FieldValue.arrayRemove(userId),
        })
        .then(() => {
            console.log('Leaving Group')
            navigation.navigate('GroupsHome')
        })
    }

    const onSubmit = () => {
        console.log('submit pressed')
    }

    const keyExtractor = (item, index) => index.toString()

    const itemSeparator = () => (
        <View>
            <Divider style={{ backgroundColor: '#b5bfd7', height: 2 }} /> 
        </View>
    )

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                <View style={{marginLeft: 5, maxWidth: '60%'}}>
                    <Text>{item.username}</Text>
                </View>
                <View>
                    {item.username != currentUser.displayName &&
                        <Icon 
                            name='trash' 
                            type='font-awesome' 
                            color='#fb5b5a' 
                            onPress={() => Alert.alert(
                                "Alert",
                                "Are you sure you want to delete this user?",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Yes", onPress: () => deletUser(item.id) }
                                ],
                                { cancelable: true }
                              )
                            }
                        />
                    }
                </View>
            </View>
        </View>
    )
    
    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
            { admin == true ? 
            <FlatList
                ListHeaderComponent={
                    <>
                        <View style={{marginTop: 20}}>
                            <Input
                                placeholder='Name'
                                onChangeText={(text) => setGroupName(text)}
                                defaultValue={groupName}
                                label='Group Name'
                                onKeyPress={() => setShowSaveBtn(true)}
                            />
                            <Input
                                defaultValue={groupDescription}
                                label='Description'
                                placeholder='Add a description'
                                onChangeText={(text) => setGroupDescription(text)}
                                multiline={true}
                                numberOfLines={8}
                                onKeyPress={() => setShowSaveBtn(true)}
                            />
                            <Text style={styles.privateSwitch}>Private</Text>
                            
                            <View style={{padding: 10}}>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#465881" }}
                                    thumbColor={privateGroup ? "#fb5b5a" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={privateGroup}
                                />
                            </View>
                        </View>

                        {showSaveBtn == true &&
                            <View>
                                <Button
                                    title="Save Changes"
                                    buttonStyle={styles.editButton}
                                    containerStyle={{ marginTop: 20, marginBottom: 15, alignItems: 'center'}}
                                    onPress={() => onSubmit()}
                                />
                            </View>
                        }
                        

                        <View style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
                            <Text style={styles.entityText}>Group Members</Text>
                        </View>
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
