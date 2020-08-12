import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image } from 'react-native';
import { observer } from 'mobx-react';
import { PageContainer, ScrollTabBar } from '@src/components';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FocusAwareStatusBar } from '@src/router';
import PostList from './PostList';
import Following from './Following';

export default observer(() => {
    const navigation = useNavigation();
    const route = useRoute();
    const searchHandle = useCallback(() => {
        navigation.navigate('Search');
    }, []);

    return (
        <PageContainer
            title="动态"
            isTopNavigator={true}
            rightView={
                <TouchableWithoutFeedback onPress={searchHandle}>
                    <View style={styles.search}>
                        <Image source={require('@app/assets/images/icons/ic_search_b.png')} style={styles.searchIcon} />
                    </View>
                </TouchableWithoutFeedback>
            }>
            <FocusAwareStatusBar barStyle="dark-content" />
            <PostList tabLabel="推荐" />
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    search: {
        width: pixel(50),
        height: pixel(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcon: {
        height: pixel(22),
        resizeMode: 'cover',
        width: pixel(22),
    },
});
