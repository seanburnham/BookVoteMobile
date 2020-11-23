import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    groupListArea: {
        flex: 1,
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
        margin: 10

    },
    groupBtns: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
        marginTop: 25,
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