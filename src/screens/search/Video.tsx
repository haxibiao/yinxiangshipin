import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { PageContainer, Iconfont, HxfTextInput, ScrollTabBar } from 'components';
import { Storage, Keys } from '@src/store';
import { FocusAwareStatusBar } from '@src/router';
import { useApolloClient, GQL } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import __ from 'lodash';
import SearchRecord from './components/SearchRecord';
import SearchedVideo from './components/SearchedVideo';
import CollectionPost from '@src/screens/collection/components/CollectionPost';

const Search = () => {
    const route = useRoute();
    const tag_id = useMemo(() => route?.params?.tag_id, []);
    const user_id = useMemo(() => route?.params?.user_id, []);
    const collection_id = useMemo(() => route?.params?.collection_id, []);

    const navigation = useNavigation();
    const backButtonPress = useCallback(() => {
        navigation.goBack();
    }, []);

    const [keyword, setKeyword] = useState('');
    const [textValue, setTextValue] = useState('');
    const [searchVisible, toggleSearchVisible] = useState(false);

    const trimmedValue = textValue && textValue.trim();
    const recordZIndex = !trimmedValue ? 1 : -1;
    const inputValueZIndex = trimmedValue.length ? 2 : -1;
    const resultTabViewZIndex = searchVisible ? 3 : -1;

    const search = __.debounce((kw) => {
        setTextValue(kw);
        setKeyword(kw);
        toggleSearchVisible(true);
    }, 100);

    const searchBtnOnPress = __.debounce(() => {
        setKeyword(trimmedValue);
        toggleSearchVisible(true);
    }, 100);

    const onChangeText = useCallback(
        (text) => {
            setTextValue(text);
            if (text.length < 1) {
                toggleSearchVisible(false);
            }
        },
        [keyword],
    );

    const onFocus = useCallback(() => {
        toggleSearchVisible(false);
    }, []);

    const onSubmitEditing = useCallback(() => {
        if (trimmedValue) {
            searchBtnOnPress();
        }
    }, [trimmedValue, searchBtnOnPress]);

    const resetTextValue = useCallback(() => {
        setTextValue('');
        toggleSearchVisible(false);
    }, []);

    const Record = useMemo(() => {
        return <SearchRecord searchKeyword={keyword} search={search} color="#fff" />;
    }, [keyword]);

    const KeywordsList = useMemo(() => {
        return (
            <View style={styles.listHeader}>
                <Text style={styles.searchText}>
                    搜索包含"<Text style={styles.highlightText}>{textValue}</Text>"的动态
                </Text>
            </View>
        );
    }, [textValue]);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
            <FocusAwareStatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={1} onPress={backButtonPress} style={styles.backButton}>
                    <Iconfont name="zuojiantou" color={'#fff'} size={pixel(21)} />
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <Image style={styles.searchImage} source={require('@app/assets/images/icons/ic_search_g.png')} />
                    <View style={styles.inputWrap}>
                        <HxfTextInput
                            value={textValue}
                            placeholder={`搜索${tag_id || collection_id ? '合集中' : '用户发布'}的内容`}
                            onFocus={onFocus}
                            onSubmitEditing={onSubmitEditing}
                            onChangeText={onChangeText}
                            TextColor={'#DDDDDD'}
                            style={styles.textInput}
                        />
                    </View>
                    <TouchableOpacity style={styles.closeButton} activeOpacity={0.8} onPress={resetTextValue}>
                        <View style={styles.closeLabel}>
                            <Image
                                style={styles.iconClose}
                                source={require('@app/assets/images/icon_close_white.png')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={searchBtnOnPress}
                    style={styles.searchButton}
                    disabled={!(inputValueZIndex > 0)}>
                    <Text style={[styles.searchButtonText, inputValueZIndex > 0 && { color: Theme.primaryColor }]}>
                        搜索
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={[styles.posContent, { zIndex: recordZIndex }]}>{Record}</View>
                <View style={[styles.posContent, { zIndex: inputValueZIndex }]}>{KeywordsList}</View>
                <View style={[styles.posContent, { zIndex: resultTabViewZIndex }]}>
                    <SearchedVideo
                        keyword={keyword}
                        navigation={navigation}
                        tag_id={tag_id}
                        user_id={user_id}
                        collection_id={collection_id}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161924',
    },
    posContent: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#161924',
    },
    header: {
        height: pixel(Theme.statusBarHeight + 48),
        paddingTop: pixel(Theme.statusBarHeight + 5),
        paddingBottom: pixel(5),
        backgroundColor: '#161924',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: pixel(45),
        paddingLeft: pixel(15),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    searchButton: {
        paddingHorizontal: pixel(15),
        alignSelf: 'stretch',
        justifyContent: 'center',
        textAlign: 'center',
    },
    searchButtonText: {
        fontSize: font(14),
        color: '#98999E',
    },
    inputContainer: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: pixel(2),
        paddingVertical: pixel(5),
        paddingLeft: pixel(10),
        paddingRight: pixel(7),
        backgroundColor: '#3A3B44',
        borderRadius: pixel(5),
        // overflow: 'hidden',
    },
    inputWrap: {
        flex: 1,
        alignSelf: 'stretch',
    },
    textInput: {
        flex: 1,
        marginLeft: pixel(6),
        fontSize: font(13),
        color: '#fff',
    },
    closeButton: {
        paddingLeft: pixel(10),
        width: pixel(30),
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeLabel: {
        width: pixel(16),
        height: pixel(16),
        borderRadius: pixel(8),
        backgroundColor: '#98999E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconClose: {
        width: pixel(10),
        height: pixel(10),
    },
    searchImage: {
        height: pixel(16),
        width: pixel(16),
    },
    listHeader: {
        padding: pixel(Theme.itemSpace),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + pixel(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchText: {
        fontSize: font(13),
        color: '#98999E',
        marginLeft: pixel(2),
    },
    highlightText: {
        fontSize: font(13),
        color: '#F8CE1C',
    },
});

export default Search;
