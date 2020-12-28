import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgIcon, SvgPath } from '@src/components';
import { userStore } from '@src/store';

export default function CategoryMenu() {
    const navigation = useNavigation();
    const historyNavigate = useCallback((i) => {
        if (userStore.login) {
            navigation.navigate('MovieHistories');
        } else {
            navigation.navigate('Login');
        }
    }, []);
    const menuNavigate = useCallback((type) => {
        navigation.navigate('CategoriesTab', { category: type });
    }, []);
    return (
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
            <TouchableWithoutFeedback onPress={() => navigation.navigate('MovieCategories')}>
                <View style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <SvgIcon name={SvgPath.category} size={26} color={'#FF8C7D'} />
                    </View>
                    <Text style={styles.menuName}>全部</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => menuNavigate('GANG')}>
                <View style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <SvgIcon name={SvgPath.tv} size={28} color={'#FF8C7D'} />
                    </View>
                    <Text style={styles.menuName}>港剧</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => menuNavigate('RI')}>
                <View style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <SvgIcon name={SvgPath.flower} size={28} color={'#FF8C7D'} />
                    </View>
                    <Text style={styles.menuName}>日剧</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => menuNavigate('MEI')}>
                <View style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <SvgIcon name={SvgPath.movie} size={28} color={'#FF8C7D'} />
                    </View>
                    <Text style={styles.menuName}>美剧</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => menuNavigate('HAN')}>
                <View style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <SvgIcon name={SvgPath.star} size={28} color={'#FF8C7D'} />
                    </View>
                    <Text style={styles.menuName}>韩剧</Text>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const MENU_WIDTH = (Device.WIDTH - pixel(80)) / 5;

const styles = StyleSheet.create({
    menuList: {
        marginTop: pixel(20),
        paddingRight: pixel(14),
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
