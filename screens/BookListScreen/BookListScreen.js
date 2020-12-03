import React, { useEffect, useState } from 'react'
import { FlatList, Text, View, SafeAreaView } from 'react-native'
import { Divider, Avatar } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { ActivityIndicator } from 'react-native-paper';


export default function BookList({route, navigation}) {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [books, setBooks] = useState([]);
    const [topBook, setTopBook] = useState([]);
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
            books.sort((a, b) => (a.upVotes > b.upVotes) ? 1 : -1);
            if(books[0].upVotes > 0){
                const topBook = books.shift();
                setTopBook(topBook);
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
        <View style={{flexDirection: 'row', margin: 10, }}>
            <Avatar
                size={'medium'}
                // containerStyle={styles.commentAvatar}
                // icon={{name: 'user', color: 'white', type: 'font-awesome'}}
                source={{uri: item.grImage}}
                imageProps={{resizeMode: 'contain'}}
            />
            <View style={{justifyContent: 'center', marginLeft: 5, width: '90%'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{alignItems: 'center'}}>
                        <Text>{item.title}</Text>
                    </View>
                    {/* <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 8}}>{String(item.postDate.toDate().toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'}))}</Text>
                    </View> */}
                </View>
                <View style={{marginTop: 5}}>
                    <Text>{item.author}</Text>
                </View>
            </View>
        </View>
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

                {books.length > 0 ? 
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={books}
                        renderItem={renderItem}
                        ItemSeparatorComponent={itemSeparator}
                        ListHeaderComponent={
                            <>
                                {topBook.length > 0 &&
                                    <Text>Top Rated Book</Text>
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
