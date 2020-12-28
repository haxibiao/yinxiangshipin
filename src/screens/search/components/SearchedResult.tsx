import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollTabBar } from '@src/components';
import Movies from './Movies';
import Collections from './Collections';
import Posts from './Posts';
import Users from './Users';
import Tags from './Tags';

export default function SearchedResult({ keyword }) {
    const navigation = useNavigation();

    return (
        <ScrollableTabView
            key={keyword}
            style={{ flex: 1 }}
            renderTabBar={(props) => (
                <ScrollTabBar
                    {...props}
                    // tabWidth={TAB_WIDTH}
                    style={styles.tabBarStyle}
                    underlineStyle={styles.underlineStyle}
                    activeTextStyle={styles.activeTextStyle}
                    tintTextStyle={styles.tintTextStyle}
                />
            )}>
            <Movies tabLabel="影视" keyword={keyword} navigation={navigation} />
            <Collections tabLabel="合集" keyword={keyword} navigation={navigation} />
            <Posts tabLabel="动态" keyword={keyword} navigation={navigation} />
            <Users tabLabel="用户" keyword={keyword} navigation={navigation} />
            <Tags tabLabel="专题" keyword={keyword} navigation={navigation} />
        </ScrollableTabView>
    );
}

const TAB_WIDTH = pixel(60);
const UNDER_LINE_WIDTH = pixel(30);
const UNDER_LINE_LEFT = (Device.WIDTH - TAB_WIDTH * 5) / 2 + (TAB_WIDTH - UNDER_LINE_WIDTH) / 2;

const styles = StyleSheet.create({
    tabBarStyle: {
        height: pixel(42),
        // paddingHorizontal: pixel(42),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
        // justifyContent: 'center',
    },
    underlineStyle: {
        // width: UNDER_LINE_WIDTH,
        // left: UNDER_LINE_LEFT,
        backgroundColor: Theme.primaryColor,
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
