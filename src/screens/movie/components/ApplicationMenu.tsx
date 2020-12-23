import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const images = [
    {
        icon: require('@app/assets/images/movie/icon_movieAll.png'),
        route: 'MovieCategoryListScreen',
    },
    {
        icon: require('@app/assets/images/movie/ic_hanju.png'),
        route: 'ApplicationMenuTable',
    },
    {
        icon: require('@app/assets/images/movie/ic_riju.png'),
        route: 'ApplicationMenuTable',
    },
    {
        icon: require('@app/assets/images/movie/ic_meiju.png'),
        route: 'ApplicationMenuTable',
    },
    {
        icon: require('@app/assets/images/movie/ic_gangju.png'),
        route: 'ApplicationMenuTable',
    },
];

const ApplicationMenu = (props: any) => {
    const navigation = useNavigation();
    const data = props.data ?? [];
    const newData = data.slice(1, 2);
    const navigationHandle = useCallback((i) => {
        navigation.navigate('ApplicationMenuTable', { i });
    }, []);
    // 频道选择
    const SelectApplicationItem = ({ filter, navigation }) => {
        const _renderItem = ({ item, index }) => {
            return (
                <TouchableOpacity
                    activeOpacity={0.1}
                    // onPress={() => navigation.navigate(images[index].route, { index: index - 1 })}
                    onPress={() =>
                        index != 0 ? navigationHandle({ i: index - 1 }) : navigation.navigate('MovieCategoryListScreen')
                    }
                    style={styles.menuPress}>
                    <View style={[styles.menuBox]}>
                        <Image style={styles.menuImage} source={images[index].icon} resizeMode="cover" />
                    </View>
                    <Text style={styles.menuText}>{item}</Text>
                </TouchableOpacity>
            );
        };

        return (
            <FlatList
                style={styles.menuList}
                data={filter?.filterOptions}
                renderItem={_renderItem}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    };
    return (
        <View style={styles.listPage}>
            {newData.map((item, index) => {
                return <SelectApplicationItem navigation={navigation} filter={item} key={index} />;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    listPage: {
        width: Device.WIDTH,
        marginVertical: pixel(10),
        flexDirection: 'row',
    },
    menuList: {
        flex: 1,
    },
    menuImage: {
        width: pixel(35),
        height: pixel(30),
    },
    menuBox: {
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    menuText: {
        color: '#333333',
        marginTop: pixel(5),
    },
    menuPress: {
        marginHorizontal: pixel(8),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: pixel(12),
    },
});

export default ApplicationMenu;
