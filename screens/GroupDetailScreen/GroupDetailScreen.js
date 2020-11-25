import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, SafeAreaView, ScrollView } from 'react-native'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { Divider, Avatar } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';

export default function GroupDetailScreen({ route, navigation }) {

    const currentUser = firebase.auth().currentUser;
    const { groupId } = route.params;
    const [group, setGroup] = useState([]);
    const [numOfMembers, setNumOfMembers] = useState('');
    const [userComment, setuserComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const groupsRef = firebase.firestore().collection('groups').doc(groupId);
        groupsRef.get().then(function(doc) {
            if (doc.exists) {
                setGroup(doc.data())
                setNumOfMembers(doc.data().users.length)
                console.log(Object.keys(group.currentBook).length)
                console.log("Document data found!");
            } else {
                console.log("No such document!");
                //TODO: Send user back to group list with alert of error
            }
          }).catch(function(error) {
              console.log("Error getting document:", error);
              //TODO: Send user back to group list with alert of error
        });

        setTimeout(() => setLoading(false), 1000);

      }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={true} size="large" color='#465881' />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.groupDetails}>
                    <Text style={styles.groupTitle}>{group.name}</Text>
                    <Text style={styles.groupSubtitle}>{group.isPrivate == 'true' ? 'Private Group - ' + numOfMembers + ' members' : 'Public Group - ' + numOfMembers + ' members'}</Text>
                    <Text style={styles.groupDescription}>{group.description}</Text>
                </View>
            
                {group.users.indexOf(currentUser.uid) > -1 ? 
                <View style={styles.groupBtns}>
                    <TouchableOpacity style={styles.joinBtn} onPress={() => console.log('Pressed Add To List')}>
                        <Text style={styles.btnText}>Add Book</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.joinBtn} onPress={() => console.log('Pressed Vote')}>
                        <Text style={styles.btnText}>Vote</Text>
                    </TouchableOpacity>
                </View>
                : 
                <View style={styles.groupBtns}>
                    <TouchableOpacity style={styles.joinBtn} onPress={() => console.log('Pressed Join')}>
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
                                icon={{name: 'book', color: '#fb5b5a', type: 'font-awesome'}}
                                source={require('../../assets/newLogo.png')}
                            />
                            <View style={styles.bookDetails}>
                                <Text>{group.currentBook.title}</Text>
                                <Text>{group.currentBook.author}</Text>
                            </View>
                        </View>
                    </View>
                }

                {group.users.indexOf(currentUser.uid) > -1 &&
                    
                    <View>
                        <Divider style={{ backgroundColor: '#465881', height: 5, marginTop: 20, marginBottom: 20 }} />
                        <View style={styles.commentArea}>
                            <Avatar
                                rounded
                                size={'small'}
                                containerStyle={styles.commentAvatar}
                                icon={{name: 'user', color: 'white', type: 'font-awesome'}}
                                source={require('../../assets/newLogo.png')}
                            />
                            <TextInput
                                style={styles.textArea}
                                placeholder='Add Comment...'
                                placeholderTextColor="#465881"
                                onChangeText={(text) => setuserComment(text)}
                                multiline={true}
                                numberOfLines={4}
                                value={userComment}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                        </View>
                        <Divider style={{ backgroundColor: '#465881', height: 5, marginTop: 20, marginBottom: 10 }} />
                    </View>
                }

                
                

            </ScrollView>
        </SafeAreaView>
    )
}
