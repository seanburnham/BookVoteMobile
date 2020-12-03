import React, { useEffect, useState } from 'react'
import { FlatList, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import { Divider, Avatar, Icon } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { ActivityIndicator } from 'react-native-paper';


export default function BookList({route, navigation}) {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [books, setBooks] = useState([]);
    const [booksExist, setBooksExist] = useState(false);
    const [topRatedBook, setTopRatedBook] = useState([]);
    const { groupId } = route.params;

    useEffect(() => {
      const groupsRef = firebase.firestore().collection('books')
      const currentGroupBooks = groupsRef.where('groups', 'array-contains', groupId)
        .onSnapshot(querySnapshot => {
          const books = [];
          querySnapshot.forEach(documentSnapshot => {
            const currentGroupRatings = documentSnapshot.data().groupRatings.find( ({ groupId }) => groupId === groupId );
            books.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                upVotes: currentGroupRatings.upVotes,
                downVotes: currentGroupRatings.downVotes
            });
          });
          
          if(books.length > 0){
            setBooksExist(true);
            books.sort((a, b) => (a.upVotes > b.upVotes) ? 1 : -1);
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

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => console.log('Book Pressed')}>
            <Avatar
                size={'medium'}
                source={{uri: item.grImage}}
                imageProps={{resizeMode: 'contain'}}
            />
            <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '80%' }}>
                <View style={{marginLeft: 5,}}>
                    <Text>{item.title}</Text>
                    <Text style={{fontSize: 10}}>{item.author}</Text>
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

                                    <View style={styles.topBookArea}>
                                        <Text style={styles.topVotedBookLabel}>Top Rated Book</Text>
                                        <Text style={styles.topVotedBookTitle}>{topRatedBook.title}</Text>
                                        <Image style={styles.topRateBookImage} source={{uri: topRatedBook.grImage,}}></Image>
                                        <View style={styles.topRatedBookDetails}>
                                            <Text style={{fontSize: 12, marginRight: 10, color: '#fb5b5a'}}>Goodreads Rating - {topRatedBook.grRating} / 5.0</Text>
                                            <Text style={{fontSize: 12, color: '#fb5b5a'}}>Page Count - {topRatedBook.grPageCount}</Text>
                                        </View>
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
