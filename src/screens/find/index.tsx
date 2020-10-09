import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image } from 'react-native';
import { observer } from 'mobx-react';
import { NavBarHeader, ScrollTabBar, FocusAwareStatusBar } from '@src/components';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import PostList from './PostList';
import Following from './Following';

export default observer(() => {
    const navigation = useNavigation();
    const route = useRoute();
    const searchHandle = useCallback(() => {
        navigation.navigate('Search');
    }, []);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" />
            <NavBarHeader
                title="动态"
                centerStyle={{ marginHorizontal: pixel(12), justifyContent: 'flex-start' }}
                titleStyle={{ fontSize: font(18) }}
                hasGoBackButton={false}
                rightComponent={
                    <TouchableWithoutFeedback onPress={searchHandle}>
                        <View style={styles.search}>
                            <Image
                                source={require('@app/assets/images/icons/ic_search_b.png')}
                                style={styles.searchIcon}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                }
            />
            <PostList tabLabel="推荐" />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    search: {
        width: pixel(50),
        paddingRight: pixel(12),
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    searchIcon: {
        height: pixel(22),
        width: pixel(22),
        resizeMode: 'cover',
    },
});
