import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { PageContainer, Iconfont, HxfTextInput, ScrollTabBar, SafeText, FocusAwareStatusBar } from '@src/components';
import { Storage, RecordKeys } from '@src/store';
import { useApolloClient, GQL } from '@src/apollo';
import { useNavigation } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import __ from 'lodash';
import SearchRecord from './components/SearchRecord';
import SearchedPost from './components/SearchedPost';
import SearchedUser from './components/SearchedUser';
import SearchedTag from './components/SearchedTag';
import SearchedCollection from './components/SearchedCollection';
import SearchedMovie from './components/SearchedMovie';

const Search = () => {
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

    const searchKeywordsOnPress = __.debounce((value) => {
        setTextValue(value);
        setKeyword(value);
        toggleSearchVisible(true);
    }, 100);

    const Record = useMemo(() => {
        return (
            <View>
                <View style={styles.recommendHeader}>
                    <Text style={{ fontWeight: '700' }}>热搜</Text>
                </View>
                <FlatList
                    contentContainerStyle={styles.contentStyle}
                    data={recommendWords}
                    numColumns={2}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={item.id}
                                style={styles.keywordsItem}
                                onPress={() => searchKeywordsOnPress(item?.word)}>
                                <Text style={[styles.keywordIndex, index <= 3 && { color: '#333' }]}>{index + 1}</Text>
                                <Text style={{ fontSize: font(14), color: '#333' }} numberOfLines={1}>
                                    {item?.word}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
                <SearchRecord searchKeyword={keyword} search={search} />
            </View>
        );
    }, [keyword]);

    const KeywordsList = useMemo(() => {
        return (
            <View style={styles.listHeader}>
                <SafeText style={styles.searchText}>
                    搜索包含"<SafeText style={styles.highlightText}>{textValue}</SafeText>"的动态、影视和问答
                </SafeText>
            </View>
        );
    }, [textValue]);

    const ResultTabView = useMemo(() => {
        return (
            <ScrollableTabView
                key={keyword}
                style={{ flex: 1 }}
                renderTabBar={(props) => (
                    <ScrollTabBar
                        {...props}
                        tabWidth={pixel(70)}
                        style={styles.tabBarStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <SearchedMovie tabLabel="影视" keyword={keyword} navigation={navigation} />
                <SearchedPost tabLabel="动态" keyword={keyword} navigation={navigation} />
                <SearchedTag tabLabel="专题" keyword={keyword} navigation={navigation} />
                <SearchedUser tabLabel="用户" keyword={keyword} navigation={navigation} />
                <SearchedCollection tabLabel="合集" keyword={keyword} navigation={navigation} />
            </ScrollableTabView>
        );
    }, [keyword]);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
            <FocusAwareStatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={1} onPress={backButtonPress} style={styles.backButton}>
                    <Iconfont name="zuojiantou" color={Theme.primaryTextColor} size={pixel(21)} />
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <Image style={styles.searchImage} source={require('@app/assets/images/icons/ic_search_g.png')} />
                    <View style={styles.inputWrap}>
                        <HxfTextInput
                            value={textValue}
                            placeholder="搜索更多感兴趣的内容"
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
                <View style={[styles.posContent, { zIndex: resultTabViewZIndex }]}>{ResultTabView}</View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    posContent: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    header: {
        height: pixel(Theme.statusBarHeight + 48),
        paddingTop: pixel(Theme.statusBarHeight + 5),
        paddingBottom: pixel(5),
        borderBottomWidth: pixel(0.5),
        borderBottomColor: Theme.navBarSeparatorColor,
        backgroundColor: '#fff',
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
        color: '#999999',
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
        backgroundColor: Theme.groundColour,
        borderRadius: pixel(30),
    },
    inputWrap: {
        flex: 1,
        alignSelf: 'stretch',
    },
    textInput: {
        flex: 1,
        marginLeft: pixel(6),
        fontSize: font(12),
        color: '#2b2b2b',
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
        backgroundColor: '#e9e9e9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconClose: {
        width: pixel(10),
        height: pixel(10),
    },
    recommendHeader: {
        paddingHorizontal: pixel(15),
        paddingVertical: pixel(5),
        height: pixel(30),
    },
    contentStyle: {
        paddingHorizontal: pixel(15),
    },
    keywordsItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: pixel(8),
        paddingRight: pixel(25),
    },
    keywordIndex: {
        width: pixel(24),
        paddingLeft: pixel(1),
        fontSize: font(14),
        fontWeight: '700',
        color: '#9B9B9B',
    },
    listHeader: {
        padding: pixel(Theme.itemSpace),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + pixel(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchText: {
        fontSize: font(13),
        color: Theme.subTextColor,
        marginLeft: pixel(2),
    },
    highlightText: {
        fontSize: font(13),
        color: Theme.secondaryColor,
    },
    searchImage: {
        height: pixel(16),
        width: pixel(16),
    },
    tabBarStyle: {
        height: pixel(42),
        paddingHorizontal: pixel(42),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
        justifyContent: 'center',
    },
    underlineStyle: {
        width: pixel(30),
        left: (Device.WIDTH - pixel(70) * 5) / 2 + pixel(20),
    },
    activeTextStyle: {
        color: '#212121',
        fontSize: font(16),
    },
    tintTextStyle: {
        color: '#D0D0D0',
        fontSize: font(16),
    },
});

export default Search;

// 推荐搜索数据为空时用下面的数据填充
const recommendWords = [
    {
        id: 27705,
        word: '检察官',
    },
    {
        id: 27593,
        word: '傲骨贤妻',
    },
    {
        id: 28421,
        word: '豪斯医生',
    },
    {
        id: 28992,
        word: '非自然死亡',
    },
    {
        id: 31613,
        word: '行尸走肉',
    },
    {
        id: 31631,
        word: '喜剧之心',
    },
    {
        id: 28421,
        word: '校阅女孩河野悦子',
    },
    {
        id: 28992,
        word: '新妓生传',
    },
    {
        id: 31613,
        word: '破产姐妹',
    },
    {
        id: 31631,
        word: '接线女孩',
    },
];
