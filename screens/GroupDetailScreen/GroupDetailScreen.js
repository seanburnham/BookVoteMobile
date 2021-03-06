import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, SafeAreaView, Modal, Alert } from 'react-native'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { Divider, Avatar, Icon, Badge } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';

export default function GroupDetailScreen({ route, navigation }) {

    // const currentUser = firebase.auth().currentUser;
    const { groupId, newCurrentBook, currentUserRecord } = route.params;
    const [group, setGroup] = useState([]);
    const [currentBookId, setCurrentBookId] = useState('');
    const [groupComments, setGroupComments] = useState([]);
    const [votesNeeded, setVotesNeeded] = useState(false);
    const [numOfMembers, setNumOfMembers] = useState('');
    const [arrayOfMembers, setArrayOfMembers] = useState([]);
    const [userComment, setUserComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {

        if(route.params?.newCurrentBook){
            setCurrentBookId(newCurrentBook);
        }

        const groupsRef = firebase.firestore().collection('groups').doc(groupId);
        groupsRef.get().then(function(doc) {
            if (doc.exists) {
                setGroup(doc.data())
                setNumOfMembers(doc.data().users.length)
                setArrayOfMembers(doc.data().users)
                if((doc.data().users.indexOf(currentUserRecord.id) > -1 || doc.data().isPrivate == false) && doc.data().comments != undefined){
                    const sortedComments = doc.data().comments.sort((a, b) => b.postDate.toDate() - a.postDate.toDate())
                    setGroupComments(sortedComments)
                    
                }
                if(doc.data().currentBook.id != undefined){
                    setCurrentBookId(doc.data().currentBook.id);
                }
                if(doc.data().votesNeededFrom != undefined && doc.data().votesNeededFrom.includes(currentUserRecord.id)){
                    setVotesNeeded(true);
                }
                if(doc.data().unreadUsers != undefined && doc.data().unreadUsers.includes(currentUserRecord.id)){
                    groupsRef.update({unreadUsers: firebase.firestore.FieldValue.arrayRemove(currentUserRecord.id)})
                    .then(() => {
                        console.log('unreadUsers Updated')
                    })
                }
            } else {
                console.log("No such document!");
                //TODO: Send user back to group list with alert of error
            }
          }).catch(function(error) {
              console.log("Error getting document:", error);
              //TODO: Send user back to group list with alert of error
        });
        
        setTimeout(() => setLoading(false), 1000);

      }, [route.params?.newCurrentBook]);

    const addNewComment = () => {
        if (!userComment.trim()) {
            alert('Please write a comment to post.');
            return;
        }
        const timestamp = firebase.firestore.Timestamp.fromDate(new Date());
        const unreadUsers = arrayOfMembers.filter(user => user != currentUserRecord.id);
        const groupRef = firebase.firestore().collection('groups').doc(groupId);
            groupRef.update({'unreadUsers': unreadUsers,'comments': firebase.firestore.FieldValue
            .arrayUnion({'userId': currentUserRecord.id, 'userName': currentUserRecord.username, 'body': userComment, 'postDate': timestamp})})
            .then(() => {
                console.log('New Comment Added')
                groupComments.unshift({'userId': currentUserRecord.id, 'userName': currentUserRecord.username, 'body': userComment, 'postDate': timestamp});
                setUserComment('')
            })
    }

    const joinSelectedGroup = () => {
        if(group.isPrivate == true){
            Alert.alert(
                "Alert",
                "Request to join private group sent to group creator",
                [
                  { text: "OK", onPress: () => setModalVisible(false) }
                ],
                { cancelable: false }
              );
        }
        else{
            console.log('Joining Group ' + group.name)
            const groupRef = firebase.firestore().collection('groups').doc(groupId);
            groupRef.update({'users': firebase.firestore.FieldValue.arrayUnion(currentUserRecord.id)})
            .then(() => {
                setModalVisible(false);
                navigation.navigate('GroupsHome')
            })
        }
    }

    const goToVote = () => {
        var updateVotesNeededList = false
        if(votesNeeded == true){
            setVotesNeeded(false);
            updateVotesNeededList = true;
        }
       
        navigation.navigate('BookVote', {groupId: groupId, currentUserRecord: currentUserRecord, updateVotesNeededList: updateVotesNeededList});
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={true} size="large" color='#465881' />
            </View>
        );
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <View style={{flexDirection: 'row', margin: 10, }}>
            {/* <Avatar
                rounded
                size={'small'}
                containerStyle={styles.commentAvatar}
                icon={{name: 'user', color: 'white', type: 'font-awesome'}}
                source={require('../../assets/newLogo.png')}
            /> */}
            <View style={{justifyContent: 'center', marginLeft: 5, width: '90%'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{alignItems: 'center'}}>
                        <Text>{item.userName}</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 8}}>{String(item.postDate.toDate().toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'}))}</Text>
                    </View>
                </View>
                <View style={{marginTop: 5}}>
                    <Text>{item.body}</Text>
                </View>
            </View>
        </View>
    )

    const itemSeparator = () => (
        <View>
            <Divider style={{ backgroundColor: '#b5bfd7', height: 2 }} /> 
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalGroupInfo}>
                            <Text style={styles.modalGroupName}>Are you sure?</Text>
                            <Text style={styles.modalGroupDesc}>
                                {group.isPrivate == true ? 
                                    'This is a private group. Clicking Join will send a request to the group owner to grant you access to the group!'
                                :
                                    'Welcome to this public group! Click Join to make it official!'
                                }
                            </Text>
                        </View>
                        
                        <View style={styles.groupBtns}>
                            <TouchableOpacity style={styles.modalBtn} onPress={() => {joinSelectedGroup();}}>
                                <Text style={styles.entityText}>Join</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtn} onPress={() => {setModalVisible(!modalVisible);}}>
                                <Text style={styles.entityText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <FlatList
                ListHeaderComponent={
                    <>
                        {group.users.indexOf(currentUserRecord.id) != -1 &&
                            <Icon
                                containerStyle={styles.editGear}
                                name='gear'
                                type='font-awesome'
                                color='#333333'
                                onPress={() => navigation.navigate('EditGroup', {groupID: groupId, group: group, usersArray: arrayOfMembers, userId: currentUserRecord.id, admin: group.admins.includes(currentUserRecord.id) ? true : false})}
                            />
                        }
                        <View style={styles.groupDetails}>
                            <Text style={styles.groupTitle}>{group.name}</Text>
                            <Text style={styles.groupSubtitle}>{group.isPrivate == true ? 'Private Group - ' + numOfMembers + ' members' : 'Public Group - ' + numOfMembers + ' members'}</Text>
                            <Text style={styles.groupSubtitle}>Created: {String(group.createdDate.toDate().toLocaleString([], {year: 'numeric', month: 'long', day: 'numeric'}))}</Text>
                            <Text style={styles.groupDescription}>{group.description}</Text>
                        </View>
                    
                        {group.users.indexOf(currentUserRecord.id) > -1 ? 
                            <View style={styles.groupBtns}>
                                <TouchableOpacity style={styles.joinBtn} onPress={() => navigation.navigate('BookList', {groupId: groupId, currentBookId: currentBookId, admin: group.admins.includes(currentUserRecord.id) ? true : false, groupUsers: arrayOfMembers})}>
                                    <Text style={styles.btnText}>Book List</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.joinBtn} onPress={() => goToVote()}>
                                    {votesNeeded == true &&
                                        <Badge value="!" status="success" containerStyle={{ position: 'absolute', top: -6, right: -5 }} />
                                    }
                                    <Text style={styles.btnText}>Vote</Text>
                                </TouchableOpacity>
                            </View>
                            : 
                            <View style={styles.groupBtns}>
                                <TouchableOpacity style={styles.joinBtn} onPress={() => {setModalVisible(true);}}>
                                    <Text style={styles.btnText}>Join</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {Object.keys(group.currentBook).length > 0 &&
                            <View> 
                                <Divider style={{ backgroundColor: '#b5bfd7', height: 5 }} />           
                                <Text style={styles.currentBookAreaTitle}>Currently Reading</Text>

                                <View style={styles.currentBookArea}>
                                    <Avatar
                                        size={'large'}
                                        avatarStyle={{borderRadius:20}}
                                        containerStyle={styles.currentBookImage}
                                        // icon={{name: 'book', color: '#fb5b5a', type: 'font-awesome'}}
                                        // source={require('../../assets/newLogo.png')}
                                        source={{
                                            uri: group.currentBook.image,
                                          }}
                                        imageProps={{resizeMode: 'contain'}}
                                    />
                                    <View style={styles.bookDetails}>
                                        <Text>{group.currentBook.title}</Text>
                                        <Text style={{fontSize: 12}}>{group.currentBook.author}</Text>
                                    </View>
                                </View>
                                <Divider style={{ backgroundColor: '#465881', height: 5, marginTop: 20, marginBottom: 20 }} />
                            </View>
                        }

                        {group.users.indexOf(currentUserRecord.id) > -1 &&
                            <View>
                                <View style={styles.commentArea}>
                                    {/* <Avatar
                                        rounded
                                        size={'small'}
                                        containerStyle={styles.commentAvatar}
                                        icon={{name: 'user', color: 'white', type: 'font-awesome'}}
                                        source={require('../../assets/newLogo.png')}
                                    /> */}
                                    <TextInput
                                        style={styles.textArea}
                                        placeholder='Add Comment...'
                                        placeholderTextColor="#465881"
                                        onChangeText={(text) => setUserComment(text)}
                                        multiline={true}
                                        numberOfLines={4}
                                        value={userComment}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity style={styles.postBtn} onPress={() => addNewComment()}>
                                        <Text style={styles.btnText}>Post</Text>
                                    </TouchableOpacity>
                                </View>
                                <Divider style={{ backgroundColor: '#465881', height: 5, marginTop: 20, marginBottom: 10 }} />
                            </View>
                        }
                    </>
                }
                ItemSeparatorComponent={itemSeparator}
                keyExtractor={keyExtractor}
                data={groupComments}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
}
