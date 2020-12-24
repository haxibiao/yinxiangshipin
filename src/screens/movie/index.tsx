import React, { useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { NavBarHeader, SvgIcon, SvgPath } from '@src/components';
import { observer, adStore, userStore } from '@src/store';
import { useNavigation } from '@react-navigation/native';
import MoviesPoster from './components/MoviesPoster';
import MovieFollows from './components/MovieFollows';
import MovieRecommend from './components/MovieRecommend';
import MovieCategory from './components/MovieCategory';

export default observer(() => {
    const navigation = useNavigation();
    const historyNavigate = useCallback((i) => {
        if (userStore.login) {
            navigation.navigate('MoreTable');
        } else {
            navigation.navigate('Login');
        }
    }, []);
    const menuNavigate = useCallback((i) => {
        navigation.navigate('ApplicationMenuTable', { i });
    }, []);
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topSection}>
                <MoviesPoster />
                <ScrollView
                    style={{ paddingLeft: pixel(14) }}
                    contentContainerStyle={styles.menuList}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <TouchableWithoutFeedback onPress={historyNavigate}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <SvgIcon name={SvgPath.history} size={26} color={'#FF8C7D'} />
                            </View>
                            <Text style={styles.menuName}>记录</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('MovieCategoryListScreen')}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <SvgIcon name={SvgPath.category} size={26} color={'#FF8C7D'} />
                            </View>
                            <Text style={styles.menuName}>全部</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => menuNavigate(3)}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <SvgIcon name={SvgPath.tv} size={28} color={'#FF8C7D'} />
                            </View>
                            <Text style={styles.menuName}>港剧</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => menuNavigate(2)}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <SvgIcon name={SvgPath.flower} size={28} color={'#FF8C7D'} />
                            </View>
                            <Text style={styles.menuName}>日剧</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => menuNavigate(0)}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <SvgIcon name={SvgPath.movie} size={28} color={'#FF8C7D'} />
                            </View>
                            <Text style={styles.menuName}>美剧</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => menuNavigate(1)}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <SvgIcon name={SvgPath.star} size={28} color={'#FF8C7D'} />
                            </View>
                            <Text style={styles.menuName}>韩剧</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
            <MovieFollows />
            <MovieRecommend categoryName="今日推荐" />
            <MovieCategory type="MEI" categoryName="热门美剧" />
            <MovieCategory type="HAN" categoryName="精选韩剧" />
            <MovieCategory type="RI" categoryName="精选日剧" />
            <MovieCategory type="GANG" categoryName="怀旧港剧" />
        </ScrollView>
    );
});

const MENU_WIDTH = (Device.WIDTH - pixel(80)) / 5;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.BOTTOM_HEIGHT,
        backgroundColor: '#ffffff',
    },
    topSection: {
        paddingVertical: pixel(14),
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    menuList: {
        marginTop: pixel(14),
    },
    menuItem: {
        alignItems: 'center',
        marginRight: pixel(10),
    },
    menuIcon: {
        width: MENU_WIDTH,
        height: MENU_WIDTH * 0.7,
        borderRadius: MENU_WIDTH * 0.35,
        backgroundColor: '#FFE7E3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuName: {
        marginTop: pixel(4),
        fontSize: font(12),
        color: '#909090',
    },
});
