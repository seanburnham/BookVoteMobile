import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },
    newGroupBtn:{
        width:"40%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        margin:5,
    },
    groupListArea: {
        flex: 1,
    },
    groupBtns: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
        marginTop: 25,
    }
})