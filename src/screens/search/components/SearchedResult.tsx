import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { DefaultTabBar } from '@app/src/components/ScrollHeadTabView';
import { observer, adStore, userStore } from '@src/store';
import Movies from './Movies';
import Collections from './Collections';
import Posts from './Posts';
import Users from './Users';
import Tags from './Tags';

export default observer(({ keyword }) => {
    const navigation = useNavigation();

    return (
        <ScrollableTabView
            key={keyword}
            style={{ flex: 1 }}
            renderTabBar={(tabBarProps: any) => (
                <DefaultTabBar
                    {...tabBarProps}
                    tabBarStyle={styles.tabBarStyle}
                    underlineStyle={styles.underlineStyle}
                    activeTextStyle={styles.activeTextStyle}
                    inactiveTextStyle={styles.inactiveTextStyle}
                />
            )}>
            {adStore.enableMovie && <Movies tabLabel="影视" keyword={keyword} navigation={navigation} />}
            <Collections tabLabel="合集" keyword={keyword} navigation={navigation} />
            <Posts tabLabel="动态" keyword={keyword} navigation={navigation} />
            <Users tabLabel="用户" keyword={keyword} navigation={navigation} />
            <Tags tabLabel="专题" keyword={keyword} navigation={navigation} />
        </ScrollableTabView>
    );
});

const styles = StyleSheet.create({
    tabBarStyle: {
        height: pixel(42),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
    },
    underlineStyle: {
        backgroundColor: Theme.primaryColor,
    },
    activeTextStyle: {
        color: '#212121',
        fontSize: font(16),
    },
    inactiveTextStyle: {
        color: '#D0D0D0',
        fontSize: font(16),
    },
});
