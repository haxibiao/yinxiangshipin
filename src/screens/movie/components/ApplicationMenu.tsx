import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';

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
// 频道选择
const SelectApplicationItem = ({ filter, navigation }) => {
    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.1}
                onPress={() => navigation.navigate(images[index].route, { index: index - 1 })}
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
const ApplicationMenu = (props: any) => {
    const { navigation } = props;
    const data = props.data ?? [];
    const newData = data.slice(1, 2);
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
        marginVertical: pixel(16),
        flexDirection: 'row',
        // height: pixel(80),
    },
    menuList: {
        flex: 1,
    },
    menuImage: {
        width: pixel(35),
        height: pixel(30),
        borderRadius: pixel(5),
    },
    menuBox: {
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: pixel(5),
    },
    menuText: {
        color: '#a8a8a8',
        fontFamily: 'HelveticaNeue-CondensedBold',
    },
    menuPress: {
        marginHorizontal: pixel(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ApplicationMenu;
