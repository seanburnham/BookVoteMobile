import React, { useEffect, useState } from 'react'
import { FlatList, Text, ScrollView, TouchableOpacity, View, SafeAreaView, Modal, Alert } from 'react-native'
import { Avatar, SearchBar, Divider } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { ActivityIndicator } from 'react-native-paper';
import { parse } from 'fast-xml-parser';


export default function AddBookScreen({route, navigation}) {

    const [loading, setLoading] = useState(false); // Set loading to true on component mount
    const [search, setSearch] = useState('');
    const [foundBooks, setFoundBooks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState({});
    const { groupId, groupUsers } = route.params;

    const findBooks = () => {
        setLoading(true)

        const formattedQuery = search.toLowerCase();

        fetch('https://www.goodreads.com/search/index.xml?key=Te7ahdToiP8n7iV3Lpgw6g&q=' + formattedQuery)
            .then((response) => response.text())
            .then((textResponse) => {
                const bookResults = []
                let obj = parse(textResponse);
                const searchResults = obj.GoodreadsResponse.search.results.work

                searchResults.forEach((book) => {
                    bookResults.push({
                        'title': book.best_book.title,
                        'author': book.best_book.author.name,
                        'image': book.best_book.image_url,
                        'avgRating': book.average_rating,
                        'grBookId': book.best_book.id
                    })
                })
                
                setFoundBooks(bookResults)
                setLoading(false)
                // console.log(obj.GoodreadsResponse.search.results.work)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });

        // setLoading(false)
        
    }

    const openBookModal = (bookId, author, image) => {

        fetch('https://www.goodreads.com/book/show/' + bookId + '.xml?key=Te7ahdToiP8n7iV3Lpgw6g')
            .then((response) => response.text())
            .then((textResponse) => {
                let obj = parse(textResponse);
                const searchResults = obj.GoodreadsResponse.book

                const bookResult = {
                    'bookId': bookId,
                    'title': searchResults.title, 
                    'description': searchResults.description.replace( /(<([^>]+)>)/ig, ' '), //Remove HTML Tags
                    'rating': searchResults.average_rating, 
                    'pageCount': searchResults.num_pages, 
                    'author': author,
                    'image': image
                }
                // console.log(bookResult)
                setSelectedBook(bookResult)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
        setModalVisible(true);
    }

    const addBookToList = () => {
        const booksRef = firebase.firestore().collection('books')
        const query = booksRef.where('grBookID', '==', String(selectedBook.bookId));

        query.get()
            .then(snap => {
                // snap is a QuerySnapshot
                if (snap.empty) {
                    console.log('Book not currently in DB');
                    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
                    const data = {
                        author: selectedBook.author,
                        dateCreated: timestamp,
                        downVotes: [],
                        grBookID: selectedBook.bookId,
                        grDescription: selectedBook.description,
                        grImage: selectedBook.image,
                        grPageCount: selectedBook.pageCount,
                        grRating: selectedBook.rating,
                        groupRatings : {[groupId]: {upVotes: 0, downVotes: 0}},
                        groups: [groupId],
                        title: selectedBook.title,
                        upVotes: []
                    };
                    booksRef.add(data)
                        .then(() => {
                            console.log('New Book Added')
                            navigation.goBack()
                        })
                        .catch((error) => {
                            alert(error)
                            console.log(error)
                        });
                }
                else {
                    let doc = snap.docs[0];
                    if(doc.data().groups.includes(groupId)){
                        Alert.alert(
                            "Alert",
                            "This book has already been added to this group's list.",
                            [
                              { text: "OK", onPress: () => setModalVisible(false) }
                            ],
                            { cancelable: false }
                          );
                    }
                    else{
                        const bookToUpdate = firebase.firestore().collection('books').doc(doc.id);
                        bookToUpdate.update({
                            'groups': firebase.firestore.FieldValue.arrayUnion(groupId),
                            'groupRatings': firebase.firestore.FieldValue.arrayUnion({downVotes: 0, upVotes: 0, groupId: groupId}),
                        })
                        .then(() => {
                            setModalVisible(false);
                            navigation.goBack()
                        })
                    }
                }
                //Update Group doc votesNeededFrom
                const usersArray = groupUsers;
                const groupRef = firebase.firestore().collection('groups').doc(groupId);
                groupRef.update({'votesNeededFrom': usersArray})
                .then(() => {
                    console.log('votesNeededFrom Updated')
                })
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => {openBookModal(item.grBookId, item.author, item.image)}}>
            <Avatar
                size={'medium'}
                source={{uri: item.image}}
                imageProps={{resizeMode: 'contain'}}
            />
            <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '80%' }}>
                <View style={{marginLeft: 5,}}>
                    <Text>{item.title}</Text>
                    <Text style={{fontSize: 10}}>{item.author}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    // if (loading) {
    //   return (
    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //       <ActivityIndicator animating={true} size="large" color='#465881' />
    //     </View>
    //   );
    // }

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
                        <ScrollView>
                            <View style={styles.modalBookInfo}>
                                <Text style={styles.modalBookTitle}>{selectedBook.title}</Text>
                                <Text style={{fontSize: 12, textAlign: 'center'}}>{selectedBook.author}</Text>
                                <View style={styles.grBookDetails}>
                                    <Text style={{fontSize: 12, marginRight: 10, color: '#fb5b5a'}}>Goodreads Rating - {selectedBook.rating} / 5.0</Text>
                                    <Text style={{fontSize: 12, color: '#fb5b5a'}}>Page Count - {selectedBook.pageCount}</Text>
                                </View>
                                <Text style={styles.modalBookDesc}>{selectedBook.description}</Text>
                            </View>
                        </ScrollView>
                        
                        <View style={styles.groupBtns}>
                            <TouchableOpacity style={styles.addBookBtn} onPress={() => addBookToList()}>
                                <Text style={styles.entityText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.entityText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <SearchBar
                placeholder="Search Books..."
                onChangeText={(input) => setSearch(input)}
                onSubmitEditing={findBooks}
                value={search}
                lightTheme={true}
                round={true}
                returnKeyType='search'
                autoCorrect={false}
            />
            {loading == true ? 
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} size="large" color='#465881' />
                </View>

            :

                <View style={styles.bookListArea}>
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={foundBooks}
                        renderItem={renderItem}
                        ItemSeparatorComponent={itemSeparator}
                    />
                </View>
            }
        </SafeAreaView>
    )
}
