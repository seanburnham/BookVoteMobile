import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f7f3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        alignItems: 'center',
        marginBottom: 40
    },
    inputView:{
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputText:{
        height:50,
        color:"white"
    },
    forgot:{
        color:"#465881",
        fontSize:11
    },
    resetBtn:{
        width:"50%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginBottom:10
    },
    resetText:{
        color:"white",
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#465881'
    },
    footerLink: {
        color: "#465881",
        fontWeight: "bold",
        fontSize: 16
    }
});