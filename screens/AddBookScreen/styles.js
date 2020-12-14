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
        maxHeight: '50%',
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
    grBookDetails: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    modalBookInfo: {
        marginTop: 10,
    },
    modalBookTitle: {
        fontSize: 20,
        color: '#333333',
        textAlign: 'center',
        margin: 5
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
    addBookBtn: {
        width:"20%",
        backgroundColor:"blue",
        borderRadius:25,
        height:35,
        alignItems:"center",
        justifyContent:"center",
        margin:5,
    },
    entityText:{
        color: 'white'
    },
    groupBtns: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
})