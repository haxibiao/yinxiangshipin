import React, { useCallback, useState, useMemo, observable } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Image, FlatList } from 'react-native';
import { PageContainer, ScrollTabBar, Iconfont, Avatar, StatusView } from './node_modules/@src/components';
import { font } from './node_modules/src/common/scale';
import ScrollableTabView from './node_modules/react-native-scrollable-tab-view';
import SearchDynamic from './SearchDynamic';
import SearchQA from './SearchQ&A';
import { GQL, useQuery, useApolloClient, ApolloProvider } from './node_modules/@src/apollo';
import { userStore, observer } from './node_modules/@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LoadingSpinner } from './node_modules/@src/components/StatusView/LoadingSpinner';
import { from } from 'apollo-boost';

const index = observer(props => {
    const navigation = useNavigation();
    const searchText = props.data;
    const client = useApolloClient();
    const { data } = useQuery(GQL.searchArticle, {
        variables: { query: searchText, type: 'POST' },
    });
    let articles = useMemo(() => Helper.syncGetter('searchArticle.data', data), [data]);
    console.log(articles, 'article');
    const onPress = useCallback(post => {
        console.log(post);

        navigation.navigate('PostDetail', { post });
    }, []);
    const renderEmptyComponent = () => {
        return <LoadingSpinner></LoadingSpinner>;
    };
    // if (Array.isArray(articles)) {
    //     articles = observable(articles);
    // }
    return (
        <View style={styles.panelItem}>
            <FlatList
                data={articles}
                ListEmptyComponent={() => renderEmptyComponent}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback onPress={() => onPress(item)}>
                        <View style={styles.searchItem}>
                            <View style={{ width: Device.WIDTH - pixel(30), flexDirection: 'row', padding: pixel(10) }}>
                                <Image style={styles.itemImage} source={{ uri: item.cover }} />
                                <View style={{ flex: 1, paddingHorizontal: pixel(8) }}>
                                    <View>
                                        <Avatar
                                            style={{ width: pixel(35), height: pixel(35) }}
                                            source={item.user.avatar}></Avatar>
                                        <Text>{item.user.name}</Text>
                                    </View>
                                    <Text style={{ flexWrap: 'wrap' }}>{item.title}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    panelItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,1)',
        // marginTop: pixel(2),
        // marginBottom: pixel(6),
        // maxHeight: pixel(245),
    },
    searchItem: {
        width: Device.WIDTH,
        height: pixel(150),
        // backgroundColor: 'skyblue',
        borderTopWidth: pixel(0.5),
        // borderBottomWidth: pixel(0.5),
        borderColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    itemImage: {
        width: pixel(100),
        height: pixel(100),
    },
});

export default index;
