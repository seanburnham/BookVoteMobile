import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, SafeAreaView, Modal, Alert } from 'react-native'
import { ListItem, Avatar, Badge, SearchBar } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function AddBookScreen({navigation}) {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [groups, setGroups] = useState([]); // Initial empty array of groups
    const [filteredGroups, setFilteredGroups] = useState([]); 
    const [search, setSearch] = useState('');

    // useEffect(() => {
    //   const user = firebase.auth().currentUser;
      
    //   const groupsRef = firebase.firestore().collection('groups')
    //   const allGroups = groupsRef.onSnapshot(querySnapshot => {
    //       const groups = [];
    //       querySnapshot.forEach(documentSnapshot => {
    //         if(documentSnapshot.data().users.indexOf(user.uid) < 0){
    //             groups.push({
    //                 ...documentSnapshot.data(),
    //                 key: documentSnapshot.id,
    //                 groupSize: documentSnapshot.data().users.length,
    //               });
    //         }
    //       });
    
    //       setGroups(groups);
    //       setFilteredGroups(groups);
    //       setLoading(false);
    //     });

    //   // Unsubscribe from events when no longer in use
    //   return () => allGroups();
    // }, []);

    // const goToSelectedGroup = (id) => {
    //     navigation.navigate('GroupDetail', {
    //       groupId: id,
    //     });
    //   }

    const updateSearch = (input) => {
        const formattedQuery = input.toLowerCase();
        const filteredData = groups.filter(group => {
            return group.name.toLowerCase().includes(formattedQuery);
        });
        setFilteredGroups(filteredData);
        setSearch(input);
      }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={() => goToSelectedGroup(item.key)}>
            <Avatar rounded icon={{name: 'account-group', type: 'material-community'}} source={require('../../assets/newLogo.png')} />
            <ListItem.Content>
                <ListItem.Title>
                    {item.name + ' '}
                    {item.isPrivate == true && <MaterialCommunityIcons name="lock" color='#fb5b5a' size={12} /> }
                </ListItem.Title>
                <ListItem.Subtitle style={styles.subtitle}>
                    {item.groupSize > 1 ? item.groupSize + ' members' : item.groupSize + ' member'}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    )

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={true} size="large" color='#465881' />
        </View>
      );
    }

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                placeholder="Search Groups..."
                onChangeText={updateSearch}
                value={search}
                lightTheme={true}
                round={true}
            />
            {/* <View style={styles.groupListArea}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={filteredGroups}
                    renderItem={renderItem}
                />
            </View> */}
        </SafeAreaView>
    )
}
