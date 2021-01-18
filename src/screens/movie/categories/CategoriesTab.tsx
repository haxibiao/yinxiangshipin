import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { DefaultTabBar } from '@app/src/components/ScrollHeadTabView';
import { NavBarHeader } from '@src/components';
import CategoryMovies from './CategoryMovies';

const CategoryIndex = {
    JIESHUO: 0,
    MEI: 1,
    GANG: 2,
    RI: 3,
    HAN: 4,
};

const TAB_WIDTH = pixel(58);
const PADDING = pixel(42);
const UNDER_LINE_WIDTH = pixel(28);

// table栏
export default function CategoriesTab() {
    const navigation = useNavigation();
    const route = useRoute();
    const category = route.params?.category || 'MEI';

    return (
        <View style={styles.container}>
            <ScrollableTabView
                style={{ flex: 1 }}
                initialPage={CategoryIndex[category]}
                contentProps={{ keyboardShouldPersistTaps: 'always' }}
                renderTabBar={(tabBarProps: any) => (
                    <DefaultTabBar
                        {...tabBarProps}
                        tabWidth={TAB_WIDTH}
                        paddingInset={PADDING}
                        tabUnderlineWidth={UNDER_LINE_WIDTH}
                        tabBarStyle={styles.tabBarStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        inactiveTextStyle={styles.inactiveTextStyle}
                    />
                )}>
                <CategoryMovies tabLabel="解说" type="JIESHUO" />
                <CategoryMovies tabLabel="美剧" type="MEI" />
                <CategoryMovies tabLabel="港剧" type="GANG" />
                <CategoryMovies tabLabel="日剧" type="RI" />
                <CategoryMovies tabLabel="韩剧" type="HAN" />
            </ScrollableTabView>
            <NavBarHeader
                navBarStyle={styles.navBarStyle}
                hasGoBackButton={true}
                StatusBarProps={{ barStyle: 'dark-content' }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: PADDING,
    },
    tabBarStyle: {
        marginTop: Theme.statusBarHeight,
        height: Theme.NAVBAR_HEIGHT,
        backgroundColor: 'rgba(255,255,255,1)',
    },
    underlineStyle: {
        marginBottom: pixel(2),
        height: pixel(3),
        backgroundColor: Theme.primaryColor,
    },
    activeTextStyle: {
        color: '#212121',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    inactiveTextStyle: {
        color: '#666',
        fontSize: font(16),
    },
});
