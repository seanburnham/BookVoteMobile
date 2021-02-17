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
        marginTop: 10,
        textAlign: 'center'
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        // padding: 35,
        width: '80%',
        maxHeight: '60%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalBookInfo: {
        marginTop: 15,
    },
    modalBookTitle: {
        fontSize: 20,
        color: '#333333',
        textAlign: 'center'
    },
    modalBookDesc: {
        fontSize: 12,
        color: '#333333',
        margin: 10,
        textAlign: 'left'

    },
    modalBtn:{
        width:"20%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:35,
        alignItems:"center",
        justifyContent:"center",
        margin:5,
    },
    closeModalBtn: {
        marginBottom: 5,
        marginRight: 15,
    },
})