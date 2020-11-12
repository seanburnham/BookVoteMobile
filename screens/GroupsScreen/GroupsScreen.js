import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native'
import { ListItem, Avatar, Badge } from 'react-native-elements'
import styles from './styles';
import { firebase } from '../../src/firebase/config'

export default function GroupsScreen() {

    const goToSelectedGroup = (id) => {
        console.log(id)
    }

    const list = [
        {
          name: 'Group 1',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          subtitle: '17 members'
        },
        {
          name: 'Group 2',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          subtitle: '43 members'
        },
        {
            name: 'Group 1',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: '17 members'
          },
          {
            name: 'Group 2',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: '43 members'
          },
          {
            name: 'Group 1',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: '17 members'
          },
          {
            name: 'Group 2',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: '43 members'
          },
          {
            name: 'Group 1',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: '17 members'
          },
          {
            name: 'Group 2',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: '43 members'
          },
          {
            name: 'Group 1',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: '17 members'
          },
          {
            name: 'Group 2',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: '43 members'
          },
          {
            name: 'Group 1',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: '17 members'
          },
          {
            name: 'Group 2',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: '43 members'
          },
          {
            name: 'Group 1',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: '17 members'
          },
          {
            name: 'Group 2',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: '43 members'
          },
          {
            name: 'Group 1',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: '17 members'
          },
          {
            name: 'Group 2',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: '43 members'
          },
          {
            name: 'Group 1',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: '17 members'
          },
          {
            name: 'Group 2',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: '43 members'
          },
          
    ]

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem bottomDivider onPress={() => goToSelectedGroup(item.name)}>
            <Avatar rounded source={{uri: item.avatar_url}} />
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.groupListArea}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={list}
                    renderItem={renderItem}
                />
            </View>
            

            <View style={styles.groupBtns}>
                <TouchableOpacity style={styles.newGroupBtn} >
                    <Text style={styles.entityText}>Join</Text>
                </TouchableOpacity><TouchableOpacity style={styles.newGroupBtn} >
                    <Text style={styles.entityText}>Create</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
