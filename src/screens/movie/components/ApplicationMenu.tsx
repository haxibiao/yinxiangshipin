import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const ApplicationMenu = () => {
    return (
        <View style={styles.listPage}>
            <ScrollView
                style={styles.menuList}
                horizontal={true}
                alwaysBounceHorizontal={true}
                centerContent={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    style={styles.menuPress}
                    activeOpacity={0.1}
                    onPress={() => {
                        console.log(1);
                    }}>
                    <View style={styles.menuBox}>
                        <Image
                            style={styles.menuImage}
                            source={require('@app/assets/images/movie/Application_all.png')}
                        />
                    </View>
                    <Text style={styles.menuText}>全部应用</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuPress} activeOpacity={0.1}>
                    <View style={[styles.menuBox, { backgroundColor: '#866ff8' }]}>
                        <Image style={styles.menuImage} source={require('@app/assets/images/movie/Movie_icon.png')} />
                    </View>
                    <Text style={styles.menuText}>电影</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuPress} activeOpacity={0.1}>
                    <View style={styles.menuBox}>
                        <Image
                            style={styles.menuImage}
                            source={require('@app/assets/images/movie/ScienceFiction_icon.png')}
                        />
                    </View>
                    <Text style={styles.menuText}>科幻</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuPress} activeOpacity={0.1}>
                    <View style={styles.menuBox}>
                        <Image
                            style={styles.menuImage}
                            source={require('@app/assets/images/movie/Application_all.png')}
                        />
                    </View>
                    <Text style={styles.menuText}>美剧</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuPress} activeOpacity={0.1}>
                    <View style={styles.menuBox}>
                        <Image
                            style={styles.menuImage}
                            source={require('@app/assets/images/movie/Application_all.png')}
                        />
                    </View>
                    <Text style={styles.menuText}>韩剧</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuPress} activeOpacity={0.1}>
                    <View style={styles.menuBox}>
                        <Image
                            style={styles.menuImage}
                            source={require('@app/assets/images/movie/Application_all.png')}
                        />
                    </View>
                    <Text style={styles.menuText}>日剧</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuPress} activeOpacity={0.1}>
                    <View style={styles.menuBox}>
                        <Image
                            style={styles.menuImage}
                            source={require('@app/assets/images/movie/Application_all.png')}
                        />
                    </View>
                    <Text style={styles.menuText}>泰剧</Text>
                </TouchableOpacity>
            </ScrollView>
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
