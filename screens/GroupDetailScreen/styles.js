import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    groupDetails: {
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    groupTitle: {
        fontSize: 30,
        color: '#333333'
    },
    groupSubtitle: {
        color: 'gray'
    },
    groupDescription: {
        margin: 20,
        textAlign: 'left'
    },
    groupBtns: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
    },
    joinBtn:{
        width:"25%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:25,
        alignItems:"center",
        justifyContent:"center",
        margin:5,
    },
    btnText: {
        fontSize: 12
    },
    currentBookArea: {
        flexDirection: 'row',
        // justifyContent: 'center',
        // marginBottom: 25,
    },
    currentBookImage: {
        marginLeft: 20,
        // marginBottom: 20,
        marginRight: 10
    },
    currentBookAreaTitle:{
        textAlign: 'center', 
        fontSize: 20, 
        marginTop: 10, 
        marginBottom: 10
    },
    bookDetails: {
        justifyContent: 'center'
    },
    commentArea: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textArea: {
        // height: 75,
        justifyContent: "flex-start",
        color:"#465881",
        marginLeft: 10,
        width:"70%",
        borderWidth: 1,
        borderColor: '#465881',
        // backgroundColor:"#b5bfd7",
        borderRadius:5,
        // marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    postBtn: {
        backgroundColor:"#fb5b5a",
        borderRadius: 5,
        height: 45,
        padding: 5,
        width: '15%',
        alignItems:"center",
        justifyContent:"center",
        marginLeft: 5,
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
        height: 'auto',
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
    modalGroupInfo: {
        marginTop: 25,
    },
    modalGroupName: {
        fontSize: 20,
        color: '#333333',
        textAlign: 'center'
    },
    modalGroupDesc: {
        fontSize: 15,
        color: '#333333',
        margin: 10,
        textAlign: 'center'

    },
    modalBtn:{
        width:"40%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:35,
        alignItems:"center",
        justifyContent:"center",
        margin:5,
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },

})