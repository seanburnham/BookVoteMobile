import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white'
    },
    card: {
        flex: .9,
        borderRadius: 4,
        borderWidth: 8,
        borderColor: "#465881",
        backgroundColor: "white",
        marginBottom: 25
    },
    innerCard:{
        flex: 1
    },
    cardView: {
        alignItems: 'center',
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: 20,
        margin: 10
    },
    cardDesc: {
        margin: 10
    },
    topSection: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    bookImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginTop: 10
    },
    bookGRDetails: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    likeBtn: {
        
    },
    likeBtnContainer:{
        marginRight: 20,
        width: '30%'
    },
    dislikeBtnContainer:{
        marginLeft: 20,
        width: '30%'
    },
    dislikeBtn: {
        backgroundColor: 'red'
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    

})