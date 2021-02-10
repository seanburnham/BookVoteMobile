import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    entityText: {
        fontSize: 20,
        color: '#333333',
        margin: 15
    },
    item: {
        padding: 20,
    },
    username: {
        fontSize: 20
    },
    listItem: {
        flexDirection: 'row', 
        padding: 10, 
        backgroundColor: '#ffffff',
    },
    privateSwitch: {
        fontSize: 16, 
        color: '#86939e', 
        fontWeight: 'bold', 
        paddingLeft: 10
    },
    editButton: {
        backgroundColor: '#465881',
        // alignItems: "center",
        // justifyContent: 'center',
        // width: '50%'
    },
})