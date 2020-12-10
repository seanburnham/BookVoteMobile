import React, { useEffect, useState } from 'react'
import { Button, Keyboard, Text, TouchableOpacity, ScrollView, View, Image, Animated } from 'react-native'
import styles from './styles';
import { firebase } from '../../src/firebase/config'
import { ActivityIndicator } from 'react-native-paper';
import Swiper from 'react-native-deck-swiper'


export default function BookVoteScreen({route}) {

    const { groupId } = route.params;
    const currentUser = firebase.auth().currentUser;
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const groupsRef = firebase.firestore().collection('books')
        const currentGroupBooks = groupsRef.where('groups', 'array-contains', groupId)
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
                setLoading(false);
            });

      // Unsubscribe from events when no longer in use
      return () => currentGroupBooks();
    }, []);

    if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator animating={true} size="large" color='#465881' />
          </View>
        );
    }

    return (
        <View style={styles.container}>
            <Swiper
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
                onSwiped={(cardIndex) => {console.log(cardIndex)}}
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
            </Swiper>
        </View>
    )
}
