import React, { useState, useContext } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Switch } from 'react-native'
import { CheckBox } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function CreateGroupScreen({navigation}) {

    const [groupName, setGroupName] = useState('')
    const [description, setDescription] = useState('')
    const [privateGroup, setPrivate] = useState(false)

    const onCheckBoxPress = () => {
        if(privateGroup === true){
            setPrivate(false);
        }
        else{
            setPrivate(true);
        }
    }

    const onCreateBtnPress = () => {
        const user = firebase.auth().currentUser;
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            name: groupName,
            description: description,
            isPrivate: privateGroup,
            createdDate: timestamp,
            users: [user.uid],
            bookList: [],
            currentBook: {},
            createdBy: [user.uid]
        };
        const groupsRef = firebase.firestore().collection('groups')
        groupsRef.add(data)
            .then(() => {
                console.log('New Group Created')
                alert('New Group Created')
                navigation.navigate('GroupsHome')
            })
            .catch((error) => {
                alert(error)
                console.log(error)
            });
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder='Group Name'
                    placeholderTextColor="white"
                    onChangeText={(text) => setGroupName(text)}
                    value={groupName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.textAreaView} >
                <TextInput
                    style={styles.textArea}
                    placeholder='Description'
                    placeholderTextColor="white"
                    onChangeText={(text) => setDescription(text)}
                    multiline={true}
                    numberOfLines={4}
                    value={description}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            </View>
            <CheckBox
                iconRight
                title='Private'
                checked={privateGroup}
                checkedColor='#465881'
                onPress = {() => onCheckBoxPress()}
                containerStyle={styles.checkBoxView}
            />
            <TouchableOpacity style={styles.createBtn} onPress={() => onCreateBtnPress()}>
                <Text style={styles.entityText}>Create</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )

}