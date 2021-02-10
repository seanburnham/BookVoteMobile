import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },
    createBtn: {
        width:"40%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        margin:5,
    },
    inputView:{
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:10,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputText:{
        height:50,
        color:"white"
    },
    textArea: {
        height: 75,
        justifyContent: "flex-start",
        color:"white"
    },
    textAreaView: {
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:10,
        // marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    checkBoxView: {
        width:"80%",
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        marginBottom:20,
    },
    privateSwitch: {
        color: '#43484d',
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 10
    }
})