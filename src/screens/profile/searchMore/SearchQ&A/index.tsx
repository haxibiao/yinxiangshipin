import React, { useCallback, useState, useMemo, observable } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Image, FlatList } from 'react-native';
import { PageContainer, ScrollTabBar, Iconfont, Avatar } from './node_modules/@src/components';
import { font } from './node_modules/src/common/scale';
// import { FlatList } from 'react-native-gesture-handler';
import ScrollableTabView from './node_modules/react-native-scrollable-tab-view';
import SearchDynamic from './SearchDynamic';
import SearchQA from './SearchQ&A';
import { GQL, useQuery, useApolloClient, ApolloProvider } from './node_modules/@src/apollo';
import { userStore, observer } from './node_modules/@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
const index = props => {
    const navigation = useNavigation();
    const searchText = props.data;
    const client = useApolloClient();
    const { data } = useQuery(GQL.searchIssue, {
        variables: { query: searchText },
    });
    const Issues = useMemo(() => Helper.syncGetter('searchIssue.data', data), [data]);
    console.log(Issues, 'Issues');
    const onPress = useCallback(post => {
        console.log(post);

        navigation.navigate('PostDetail', { post });
    }, []);
    return (
        <View style={styles.panelItem}>
            <FlatList
                data={Issues}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback onPress={() => onPress(item)}>
                        <View style={styles.searchItem}>
                            <View style={{ width: Device.WIDTH - pixel(30), flexDirection: 'row', padding: pixel(10) }}>
                                <Image style={styles.itemImage} source={{ uri: item.cover }} />
                                <View style={{ flex: 1, paddingHorizontal: pixel(8) }}>
                                    <Text style={{ flexWrap: 'wrap' }}>{item.title}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    panelItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,1)',
    },
    searchItem: {
        width: Device.WIDTH,
        height: pixel(150),
        borderTopWidth: pixel(0.5),
        borderColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: pixel(100),
        height: pixel(100),
    },
});

export default index;
