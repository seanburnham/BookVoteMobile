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
    const { groupId } = route.params;

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

    const openBookModal = (bookId, author) => {

        fetch('https://www.goodreads.com/book/show/' + bookId + '.xml?key=Te7ahdToiP8n7iV3Lpgw6g')
            .then((response) => response.text())
            .then((textResponse) => {
                let obj = parse(textResponse);
                const searchResults = obj.GoodreadsResponse.book

                const bookResult = {
                    'title': searchResults.title, 
                    'description': searchResults.description.replace( /(<([^>]+)>)/ig, ' '), //Remove HTML Tags
                    'rating': searchResults.average_rating, 
                    'pageCount': searchResults.num_pages, 
                    'author': author
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

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => {openBookModal(item.grBookId, item.author)}}>
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
                {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name='thumbs-up' type='font-awesome' color='#333333' />
                    <Text style={{marginRight: 15}}> - {item.upVotes}</Text>
                    <Icon name='thumbs-down' type='font-awesome' color='#333333' />
                    <Text> - {item.downVotes}</Text>
                </View> */}
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
                        <TouchableOpacity style={styles.modalBtn} onPress={() => {setModalVisible(!modalVisible);}}>
                            <Text style={styles.entityText}>Close</Text>
                        </TouchableOpacity>
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