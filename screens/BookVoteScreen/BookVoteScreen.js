import React, { useEffect, useState } from 'react'
import { Keyboard, Text, TouchableOpacity, ScrollView, View, Image, SafeAreaView } from 'react-native'
import { Card, Button, Icon } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { ActivityIndicator } from 'react-native-paper';
// import Swiper from 'react-native-deck-swiper'


export default function BookVoteScreen({route}) {

    const { groupId } = route.params;
    const currentUser = firebase.auth().currentUser;
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [currentBook, setCurrentBook] = useState([]);

    useEffect(() => {
        const booksRef = firebase.firestore().collection('books')
        const currentGroupBooks = booksRef.where('groups', 'array-contains', groupId)
            .onSnapshot(querySnapshot => {
                const books = [];
                querySnapshot.forEach(documentSnapshot => {
                    // const currentGroupRatings = documentSnapshot.data().groupRatings.find( ({ groupId }) => groupId === groupId );
                    if(!documentSnapshot.data().upVotes.includes(currentUser.uid) && !documentSnapshot.data().downVotes.includes(currentUser.uid)){
                        books.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id
                        });
                    }
                });
                setBooks(books);
                setCurrentBook(books[0]);
                setLoading(false);
            });

      // Unsubscribe from events when no longer in use
      return () => currentGroupBooks();
    }, []);

    const addUpvote = () => {
        
        const bookRef = firebase.firestore().collection('books').doc(currentBook.key);
        bookRef.update({
                'upVotes': firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
                ['groupRatings.' + groupId + '.upVotes'] : firebase.firestore.FieldValue.increment(1)
            })
            .then(() => {
                books.shift()
                setCurrentBook(books[0]);
                console.log('Upvoted');
            })
    }

    const addDownvote = () => {
        const bookRef = firebase.firestore().collection('books').doc(currentBook.key);
        bookRef.update({
                'downVotes': firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
                ['groupRatings.' + groupId + '.downVotes'] : firebase.firestore.FieldValue.increment(1)
            })
            .then(() => {
                books.shift()
                setCurrentBook(books[0]);
                console.log('Downvoted');
            })
    }


    if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator animating={true} size="large" color='#465881' />
          </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            {books.length > 0 ? 
            <View style={styles.container}>
                <Card containerStyle={styles.card} wrapperStyle={styles.innerCard}>
                    <Card.Title>{currentBook.title}</Card.Title>
                    <Text style={{fontSize: 12, textAlign: 'center', marginBottom: 10}}>{currentBook.author}</Text>
                    <Card.Divider/>
                    <ScrollView>
                        <View style={styles.cardView}>
                            <Image style={styles.bookImage} source={{uri: currentBook.grImage,}}></Image>
                            <View style={styles.bookGRDetails}>
                                <Text style={{fontSize: 12, marginRight: 10, color: '#fb5b5a'}}>Goodreads Rating - {currentBook.grRating} / 5.0</Text>
                                <Text style={{fontSize: 12, color: '#fb5b5a'}}>Page Count - {currentBook.grPageCount}</Text>
                            </View>
                            <Text style={styles.cardDesc}>{currentBook.grDescription}</Text>
                        </View>
                    </ScrollView>
                </Card>

                 <View  style={styles.buttonRow}>
                    <Button
                        onPress={addUpvote}
                        raised
                        buttonStyle={styles.likeBtn}
                        containerStyle={styles.likeBtnContainer}
                        icon={
                            <Icon
                                name='thumbs-up' 
                                type='font-awesome' 
                                color='#333333'
                                size={40}
                            />
                        }
                    />
                    <Button
                        onPress={addDownvote}
                        raised
                        buttonStyle={styles.dislikeBtn}
                        containerStyle={styles.dislikeBtnContainer}
                        icon={
                            <Icon
                                name='thumbs-down' 
                                type='font-awesome' 
                                color='#333333'
                                size={40}
                            />
                        }
                    />
                </View>
            </View>
                
            :
            <View style={styles.emptyList}>
                <Text style={{fontSize: 24, color: 'gray'}}>No More Books to Vote On</Text>
            </View>
            }


            {/* <Swiper
                cards={books}
                renderCard={(book) => {
                    return (
                        <View style={styles.card}>
                            <ScrollView>
                                <TouchableOpacity>
                                    <View style={styles.cardView}>
                                        <Text style={styles.cardTitle}>{book.title}</Text>
                                        <Text style={{fontSize: 12, textAlign: 'center'}}>{book.author}</Text>
                                        <Image style={styles.bookImage} source={{uri: book.grImage,}}></Image>
                                        <View style={styles.bookGRDetails}>
                                            <Text style={{fontSize: 12, marginRight: 10, color: '#fb5b5a'}}>Goodreads Rating - {book.grRating} / 5.0</Text>
                                            <Text style={{fontSize: 12, color: '#fb5b5a'}}>Page Count - {book.grPageCount}</Text>
                                        </View>
                                        <Text style={styles.cardDesc}>{book.grDescription}</Text>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    )
                }}
                onSwipedRight={(cardIndex) => addUpvote(cardIndex)}
                onSwipedLeft={(cardIndex) => addDownvote(cardIndex)}
                onSwipedAll={() => {console.log('onSwipedAll')}}
                cardIndex={0}
                stackSeparation={14}
                stackScale={5}
                disableBottomSwipe
                disableTopSwipe
                verticalSwipe={false}
                backgroundColor={'transparent'}
                animateOverlayLabelsOpacity
                overlayLabels={{
                    left: {
                        title: 'NOPE',
                        style: {
                            label: {
                                backgroundColor: 'red',
                                color: 'white',
                                fontSize: 20
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                marginTop: 30,
                                marginLeft: -30
                            }
                        }
                    },
                    right: {
                        title: 'LIKE',
                        style: {
                            label: {
                                backgroundColor: 'blue',
                                color: 'white',
                                fontSize: 20
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginTop: 30,
                                marginLeft: 30
                            }
                        }
                    }
                }}
                stackSize= {3}>
                <View style={styles.topSection}>
                    <Text>{'<- '}Swipe To Vote{' ->'}</Text>
                </View>
            </Swiper> */}
        </SafeAreaView>
    )
}
