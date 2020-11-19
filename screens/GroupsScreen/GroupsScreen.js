import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native'
import { ListItem, Avatar, Badge } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function GroupsScreen({navigation}) {

    const goToSelectedGroup = (id) => {
        console.log(id)
    }

    // const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [groups, setGroups] = useState([]); // Initial empty array of groups

    // if (loading) {
    //   return <ActivityIndicator />;
    // }

    useEffect(() => {
      const user = firebase.auth().currentUser;
      
      const groupsRef = firebase.firestore().collection('groups')
      const currentUsersGroups = groupsRef.where('users', 'array-contains', user.uid)
        .onSnapshot(querySnapshot => {
          const groups = [];
          querySnapshot.forEach(documentSnapshot => {
            groups.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
              groupSize: documentSnapshot.data().users.length
            });
          });
    
          setGroups(groups);
          // setLoading(false);
        });

      // Unsubscribe from events when no longer in use
      return () => currentUsersGroups();
    }, []);

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={() => goToSelectedGroup(item.name)}>
            <Avatar rounded source={require('../../assets/newLogo.png')} />
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.groupSize} {item.groupSize > 1 ? 'members' : 'member'}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.groupListArea}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={groups}
                    renderItem={renderItem}
                />
            </View>
            

            <View style={styles.groupBtns}>
                <TouchableOpacity style={styles.newGroupBtn} >
                    <Text style={styles.entityText}>Join</Text>
                </TouchableOpacity><TouchableOpacity style={styles.newGroupBtn} onPress={() => navigation.navigate('CreateGroup')}>
                    <Text style={styles.entityText}>Create</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
