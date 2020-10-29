import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function HomeScreen() {

    return (
        <View style={styles.container}>
            <Text style={styles.entityText}>Home Screen</Text>
        </View>
    )
}
