import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';

// 频道选择
const SelectApplicationItem = ({ filter, navigation }) => {
    const _renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.1}
                    onPress={() => navigation.navigate('ApplicationMenuTable')}
                    style={styles.menuPress}>
                    <View style={[styles.menuBox, { backgroundColor: '#866ff8' }]}>
                        <Image style={styles.menuImage} source={require('@app/assets/images/movie/Movie_icon.png')} />
                    </View>
                    <Text style={styles.menuText}>{item}</Text>
                </TouchableOpacity>
            </View>
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
            {/* <TouchableOpaci
                style={styles.menuPress}
                activeOpacity={0.1}
                onPress={() => {
                    navigation.navigate('MovieCategoryListScreen');
                }}>
                <View style={styles.menuBox}>
                    <Image style={styles.menuImage} source={require('@app/assets/images/movie/Application_all.png')} />
                </View>
                <Text style={styles.menuText}>全部应用</Text>
            </TouchableOpacity> */}
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
        height: pixel(80),
    },
    menuList: {
        flex: 1,
    },
    menuImage: {
        width: pixel(35),
        height: pixel(35),
    },
    menuBox: {
        backgroundColor: 'skyblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: pixel(25),
        padding: pixel(5),
    },
    menuText: {
        color: '#a8a8a8',
        marginTop: pixel(3),
    },
    menuPress: {
        marginHorizontal: pixel(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ApplicationMenu;
