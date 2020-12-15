import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 20,
        color: '#333333',
        textAlign: 'center'
    },
    signOutButton: {
        width:"40%",
        marginLeft: 10,
        marginTop: 20,
        height: 48,
        borderRadius: 25,
        borderColor: '#fb5b5a',
        borderWidth: 2,
        alignItems: "center",
        justifyContent: 'center'
    },
    signOutbuttonTitle:{
        color: '#465881',
        fontSize: 16,
        fontWeight: "bold"
    },
    editButton: {
        width:"40%",
        backgroundColor: '#fb5b5a',
        // marginLeft: 30,
        marginRight: 10,
        marginTop: 20,
        height: 48,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    profileDetails:{
        marginTop: 20
    }
  })