import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { PageContainer, Iconfont, HxfTextInput, ScrollTabBar, SafeText, FocusAwareStatusBar } from '@src/components';
import { Storage, RecordKeys } from '@src/store';
import { useApolloClient, GQL } from '@src/apollo';
import { useNavigation } from '@react-navigation/native';
import __ from 'lodash';
import HotKeywords from './components/HotKeywords';
import SearchHistory from './components/SearchHistory';
import SearchedResult from './components/SearchedResult';

const Search = () => {
    const navigation = useNavigation();

    const [keyword, setKeyword] = useState('');
    const [textValue, setTextValue] = useState('');
    const [searchVisible, toggleSearchVisible] = useState(false);

    const trimmedValue = textValue && textValue.trim();
    const recordZIndex = !trimmedValue ? 1 : -1;
    const inputValueZIndex = trimmedValue.length ? 2 : -1;
    const resultTabViewZIndex = searchVisible ? 3 : -1;

    const onSearch = __.debounce((kw) => {
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

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
            <FocusAwareStatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()} style={styles.backButton}>
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
                <View style={[styles.posContent, { zIndex: recordZIndex }]}>
                    <HotKeywords onSearch={onSearch} />
                    <SearchHistory searchKeyword={keyword} onSearch={onSearch} />
                </View>
                <View style={[styles.posContent, { zIndex: inputValueZIndex }]}>
                    <View style={styles.listHeader}>
                        <SafeText style={styles.searchText}>
                            搜索包含"<SafeText style={styles.highlightText}>{textValue}</SafeText>"的动态、影视和问答
                        </SafeText>
                    </View>
                </View>
                <View style={[styles.posContent, { zIndex: resultTabViewZIndex }]}>
                    <SearchedResult keyword={keyword} />
                </View>
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
});

export default Search;
