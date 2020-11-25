import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, SafeAreaView, Modal, Alert } from 'react-native'
import { ListItem, Avatar, Badge, SearchBar } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function JoinGroupsScreen({navigation}) {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [groups, setGroups] = useState([]); // Initial empty array of groups
    const [filteredGroups, setFilteredGroups] = useState([]); 
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [selectedGroupName, setSelectedGroupName] = useState('');
    const [selectedGroupDesc, setSelectedGroupDesc] = useState('');
    const [selectedGroupPrivate, setSelectedGroupPrivate] = useState(false);

    useEffect(() => {
      const user = firebase.auth().currentUser;
      
      const groupsRef = firebase.firestore().collection('groups')
      const allGroups = groupsRef.onSnapshot(querySnapshot => {
          const groups = [];
          querySnapshot.forEach(documentSnapshot => {
            if(documentSnapshot.data().users.indexOf(user.uid) < 0){
                groups.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                    groupSize: documentSnapshot.data().users.length,
                  });
            }
          });
    
          setGroups(groups);
          setFilteredGroups(groups);
          setLoading(false);
        });

      // Unsubscribe from events when no longer in use
      return () => allGroups();
    }, []);

    const updateSearch = (input) => {
        const formattedQuery = input.toLowerCase();
        const filteredData = groups.filter(group => {
            return group.name.toLowerCase().includes(formattedQuery);
        });
        setFilteredGroups(filteredData);
        setSearch(input);
      }

    const showSelectedGroup = (id, name, description, isPrivate) => {
        setSelectedGroupId(id);
        setSelectedGroupName(name);
        setSelectedGroupDesc(description);
        setSelectedGroupPrivate(isPrivate)
        setModalVisible(true);
    }

    const joinSelectedGroup = () => {
        if(selectedGroupPrivate == true){
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
            console.log('Joining Group ' + selectedGroupName)
            const groupRef = firebase.firestore().collection('groups').doc(selectedGroupId);
            groupRef.update({'users': firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)})
            .then(() => {
                setModalVisible(false);
                navigation.navigate('GroupsHome')
            })
        }
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={() => showSelectedGroup(item.key, item.name, item.description, item.isPrivate)}>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalGroupInfo}>
                            <Text style={styles.modalGroupName}>{selectedGroupName}</Text>
                            <Text style={styles.modalGroupDesc}>{selectedGroupDesc}</Text>
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
            <SearchBar
                placeholder="Search Groups..."
                onChangeText={updateSearch}
                value={search}
                lightTheme={true}
                round={true}
            />
            <View style={styles.groupListArea}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={filteredGroups}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
    )
}
