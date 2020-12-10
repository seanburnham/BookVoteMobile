import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    card: {
        flex: .75,
        borderRadius: 4,
        borderWidth: 8,
        borderColor: "#465881",
        backgroundColor: "white",
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
        margin: 20
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
    }

})