import React, { useEffect, useState } from 'react'
import { FlatList, Text, View, SafeAreaView, Image, TouchableOpacity, Modal } from 'react-native'
import { Divider, Avatar, Icon, Button } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { ActivityIndicator } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';


export default function BookList({route, navigation}) {

    const { groupId, currentBookId, admin, groupUsers } = route.params;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [books, setBooks] = useState([]);
    const [booksExist, setBooksExist] = useState(false);
    const [topRatedBook, setTopRatedBook] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState({});
    const [groupCurrentBook, setGroupCurrentBook] = useState('');

    useEffect(() => {
        navigation.setOptions({
            title : 'Book List',
            headerRight: () => (
                <Icon
                  name='add-to-list'
                  type='entypo'
                  color='#32b853'
                  onPress={() => navigation.navigate('AddBook', {groupId: groupId, groupUsers: groupUsers})}
                  style={{marginRight: 25}}
                />
              ), 
        });

        setGroupCurrentBook(currentBookId);
        const booksRef = firebase.firestore().collection('books')
        const currentGroupBooks = booksRef.where('groups', 'array-contains', groupId)
            .onSnapshot(querySnapshot => {
                const books = [];
                querySnapshot.forEach(documentSnapshot => {
                    const currentGroupRatings = documentSnapshot.data().groupRatings[groupId];
                    books.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                        upVotes: currentGroupRatings.upVotes,
                        downVotes: currentGroupRatings.downVotes,
                        lastRead: currentGroupRatings.lastReadDate
                    });
                });
          
                if(books.length > 0){
                    setBooksExist(true);
                    books.sort((a, b) => (a.upVotes < b.upVotes) ? 1 : -1);
                    if(books[0].upVotes > 0){
                        const topBook = books.shift();
                        setTopRatedBook(topBook);
                    }
                    setBooks(books);
                }
                setLoading(false);
            });

      // Unsubscribe from events when no longer in use
      return () => currentGroupBooks();
    }, []);

    const openBookModal = (title, description, rating, pageCount, author, key, image) => {
        const selection = {
            'title': title, 
            'description': description, 
            'rating': rating, 
            'pageCount': pageCount, 
            'author': author,
            'key': key,
            'image': image
        };
        setSelectedBook(selection);
        setModalVisible(true);
    }

    const setCurrentBook = (bookId, author, image, title) => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const currentBookRef = firebase.firestore().collection('books').doc(groupCurrentBook);
        currentBookRef.update({
                ['groupRatings.' + groupId + '.lastReadDate'] : timestamp
            })
            .then(() => {
                console.log('Last Read Date Updated');
                const groupRef = firebase.firestore().collection('groups').doc(groupId);
                groupRef.update({
                        ['currentBook.author'] : author,
                        ['currentBook.id'] : bookId,
                        ['currentBook.image'] : image,
                        ['currentBook.title'] : title,
                    })
                    .then(() => {
                        console.log('New Current Book Set!');
                        setGroupCurrentBook(bookId);
                        setModalVisible(false);
                        navigation.navigate('GroupDetail', {
                            newCurrentBook: bookId,
                          });
                    })
            })

        
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => {openBookModal(item.title, item.grDescription, item.grRating, item.grPageCount, item.author, item.key, item.grImage)}}>
            <Avatar
                size={'medium'}
                source={{uri: item.grImage}}
                imageProps={{resizeMode: 'contain'}}
            />
            <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '80%' }}>
                <View style={{marginLeft: 5, maxWidth: '60%'}}>
                    <Text>{item.title}</Text>
                    <Text style={{fontSize: 10}}>{item.author}</Text>
                    {groupCurrentBook == item.key ?
                        <Text style={{fontSize: 10, backgroundColor: 'green', padding: 2, color: 'white'}}>Currently Reading</Text>
                    :
                      item.lastRead != null &&
                        <Text style={{fontSize: 10, color: 'red', padding: 2}}>Last Read: {String(item.lastRead.toDate().toLocaleString([], {year: 'numeric', month: 'long', day: 'numeric'}))}</Text>
                    }
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name='thumbs-up' type='font-awesome' color='#333333' />
                    <Text style={{marginRight: 15}}> - {item.upVotes}</Text>
                    <Icon name='thumbs-down' type='font-awesome' color='#333333' />
                    <Text> - {item.downVotes}</Text>
                </View>
            </View>
        </TouchableOpacity>

    )

    const itemSeparator = () => (
        <View>
            <Divider style={{ backgroundColor: '#b5bfd7', height: 2 }} /> 
        </View>
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
                    <View style={{width: '80%', alignItems: 'flex-end'}}>
                        <Icon
                            containerStyle={styles.closeModalBtn}
                            name='times'
                            type='font-awesome'
                            color='#fb5b5a'
                            size = '30'
                            onPress={() => {setModalVisible(!modalVisible);}}
                        />
                    </View>
                    <View style={styles.modalView}>
                        <ScrollView>
                            <View style={styles.modalBookInfo}>
                                <Text style={styles.modalBookTitle}>{selectedBook.title}</Text>
                                <Text style={{fontSize: 12, textAlign: 'center'}}>{selectedBook.author}</Text>
                                <View style={styles.topRatedBookDetails}>
                                    <Text style={{fontSize: 12, marginRight: 10, color: '#fb5b5a'}}>Goodreads Rating - {selectedBook.rating} / 5.0</Text>
                                    <Text style={{fontSize: 12, color: '#fb5b5a'}}>Page Count - {selectedBook.pageCount}</Text>
                                </View>
                                <Text style={styles.modalBookDesc}>{selectedBook.description}</Text>
                            </View>
                        </ScrollView>
                        
                        <View style={{marginTop: 10}}>
                            {admin == true ?
                                groupCurrentBook != selectedBook.key &&
                                <Button
                                    title="Set As Current Book"
                                    containerStyle={{marginBottom: 10}}
                                    buttonStyle={{backgroundColor: 'green'}}
                                    onPress={() => {setCurrentBook(selectedBook.key, selectedBook.author, selectedBook.image, selectedBook.title);}}
                                />
                            :
                                <></>
                            }
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.bookListArea}>
                {booksExist == true ? 
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={books}
                        renderItem={renderItem}
                        ItemSeparatorComponent={itemSeparator}
                        ListHeaderComponent={
                            <>
                                {Object.keys(topRatedBook).length != 0 &&
                                    <TouchableOpacity onPress={() => {openBookModal(topRatedBook.title, topRatedBook.grDescription, topRatedBook.grRating, topRatedBook.grPageCount, topRatedBook.author, topRatedBook.key)}}>
                                        <View style={styles.topBookArea}>
                                            <Text style={styles.topVotedBookLabel}>Top Rated Book</Text>
                                            <Text style={styles.topVotedBookTitle}>{topRatedBook.title}</Text>
                                            <Image style={styles.topRateBookImage} source={{uri: topRatedBook.grImage,}}></Image>
                                            <View style={styles.topRatedBookDetails}>
                                                <Text style={{fontSize: 12, marginRight: 10, color: '#fb5b5a'}}>Goodreads Rating - {topRatedBook.grRating} / 5.0</Text>
                                                <Text style={{fontSize: 12, color: '#fb5b5a'}}>Page Count - {topRatedBook.grPageCount}</Text>
                                            </View>
                                            {currentBookId == topRatedBook.key ?
                                                <Text style={{fontSize: 10, backgroundColor: 'green', padding: 2, color: 'white', marginTop: 10}}>Currently Reading</Text>
                                            :
                                            topRatedBook.lastRead != null &&
                                                <Text style={{fontSize: 10, marginTop: 10, color: 'red', padding: 2}}>Last Read: {String(topRatedBook.lastRead.toDate().toLocaleString([], {year: 'numeric', month: 'long', day: 'numeric'}))}</Text>
                                            }
                                            <View style={{
                                                paddingVertical: 15,
                                                paddingHorizontal: 10,
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                                <Icon name='thumbs-up' type='font-awesome' color='#333333' />
                                                <Text style={{marginRight: 15}}> - {topRatedBook.upVotes}</Text>
                                                <Icon name='thumbs-down' type='font-awesome' color='#333333' />
                                                <Text> - {topRatedBook.downVotes}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </>
                        }
                    />
                :
                    <View style={styles.emptyList}>
                        <Text style={{fontSize: 24, color: 'gray'}}>Empty Book List</Text>
                    </View>
                }

            </View>
        </SafeAreaView>
    )
}
