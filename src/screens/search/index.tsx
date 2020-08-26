import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { PageContainer, Iconfont, HxfTextInput, ScrollTabBar } from 'components';
import { Storage, Keys } from '@src/store';
import { FocusAwareStatusBar } from '@src/router';
import { useApolloClient, GQL } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import __ from 'lodash';
import SearchRecord from './components/SearchRecord';
import SearchedPost from './components/SearchedPost';
import SearchedUser from './components/SearchedUser';
import SearchedTag from './components/SearchedTag';

const Search = () => {
    const navigation = useNavigation();
    const backButtonPress = useCallback(() => {
        navigation.goBack();
    }, []);

    const [keyword, setKeyword] = useState('');
    const [textValue, setTextValue] = useState('');
    const [recordData, setRecordData] = useState([]);
    const [searchVisible, toggleSearchVisible] = useState(false);

    const trimmedValue = textValue && textValue.trim();
    const recordZIndex = !trimmedValue ? 1 : -1;
    const inputValueZIndex = trimmedValue.length ? 2 : -1;
    const resultTabViewZIndex = searchVisible ? 3 : -1;

    const search = __.debounce((kw) => {
        setTextValue(kw);
        setKeyword(kw);
        toggleSearchVisible(true);
    }, 400);

    const searchBtnOnPress = __.debounce(() => {
        addRecord(trimmedValue);
        setKeyword(trimmedValue);
        toggleSearchVisible(true);
    }, 400);

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

    const addRecord = useCallback((newKeyword) => {
        setRecordData((prv) => {
            const newData = [...new Set([newKeyword, ...prv])].slice(0, 12);
            Storage.setItem(Keys.searchRecord, newData);
            return newData;
        });
    }, []);

    const getRecord = useCallback(async () => {
        const record = await Storage.getItem(Keys.searchRecord);
        if (record) {
            setRecordData(record);
        }
    }, []);

    const removeRecord = useCallback(() => {
        setRecordData([]);
        Storage.removeItem(Keys.searchRecord);
    }, []);

    useEffect(() => {
        getRecord();
    }, []);

    const Record = useMemo(() => {
        return <SearchRecord data={recordData} remove={removeRecord} search={search} />;
    }, [recordData]);

    const KeywordsList = useMemo(() => {
        return (
            <View style={styles.listHeader}>
                <Text style={styles.searchText}>
                    包含"<Text style={styles.highlightText}>{textValue}</Text>"的动态和问答
                </Text>
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
                        // tabStyle={styles.tabStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <SearchedPost keyword={keyword} tabLabel="动态" />
                <SearchedTag keyword={keyword} tabLabel="专题" />
                <SearchedUser keyword={keyword} tabLabel="用户" />
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
                            style={{ flex: 1, marginLeft: pixel(6), fontSize: font(12) }}
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
        // overflow: 'hidden',
    },
    inputWrap: {
        flex: 1,
        alignSelf: 'stretch',
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
    tabBarStyle: {
        height: pixel(42),
        paddingHorizontal: pixel(42),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
        justifyContent: 'center',
    },
    // tabStyle: {
    //     justifyContent: 'center',
    // },
    underlineStyle: {
        width: pixel(30),
        left: (Device.WIDTH - pixel(70) * 3) / 2 + pixel(20),
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
