import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    bookListArea: {
        flex: 1,
    },
    listItem: {
        flexDirection: 'row', 
        padding: 10, 
        backgroundColor: '#ffffff',
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBookArea: {
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderBottomWidth: 2,
        borderColor: '#b5bfd7'
    },
    topVotedBookLabel: {
        fontSize: 20,
        marginTop: 15,
        color: '#333333'
    },
    topVotedBookTitle: {
        fontSize: 15,
        color: '#333333',
        marginTop: 10
    },
    topRateBookImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginTop: 10
    },
    topRatedBookDetails: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
})