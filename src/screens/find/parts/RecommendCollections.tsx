import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
    Easing,
    Platform,
    ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { GQL, useQuery } from '@src/apollo';
import { Iconfont, DebouncedPressable } from '@src/components';
import { adStore, userStore } from '@src/store';

export const PADDING = pixel(14);
const POSTER_WIDTH = (Device.width - pixel(1) - PADDING * 4) / 3;
const POSTER_HEIGHT = POSTER_WIDTH;

interface Collection {
    id: string;
    logo: string;
    name: string;
    description: string;
}
interface CollectionProps {
    collection: Collection;
    navigation: {
        navigate: (p1: String, p2?: any) => void;
    };
}

function CollectionItem({ collection, navigation }: CollectionProps) {
    if (!collection?.id) {
        return <CollectionPlaceholder />;
    }

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Collection', { collection })}>
            <View style={styles.collectionContent}>
                <ImageBackground style={styles.collectionCover} i resizeMode="cover" source={{ uri: collection?.logo }}>
                    <LinearGradient
                        style={styles.picBt}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}>
                        <View style={{ flex: 1 }}>
                            {collection?.count_posts && (
                                <Text style={styles.picText} numberOfLines={1}>
                                    {collection?.count_posts}个视频
                                </Text>
                            )}
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.collectionInfo}>
                    <Text style={styles.collectionName} numberOfLines={1}>
                        {collection?.name || ''}
                    </Text>
                    <Text style={styles.collectionDesc} numberOfLines={1}>
                        {collection?.description ||
                            `${Helper.count((Number(collection?.count_views) + Number(collection?.id)) * 10)}次播放`}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

interface Props {
    style?: ViewStyle;
    collections?: Collection[];
    sectionName?: string;
}

export default ({ style, collections, sectionName }: Props) => {
    const navigation = useNavigation();

    return (
        <View style={[styles.secContainer, style]}>
            <View style={styles.secHead}>
                <Text style={styles.secTitle}>{sectionName || '推荐合集'}</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.collectionList}
                horizontal={true}
                bounces={false}
                showsHorizontalScrollIndicator={false}>
                {collections.map((item, index) => {
                    return (
                        <View style={styles.itemWrap} key={item?.id || index}>
                            <CollectionItem collection={item} navigation={navigation} />
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

function CollectionPlaceholder() {
    const animation = new Animated.Value(0.5);
    const animationStyle = { opacity: animation };

    (function startAnimation() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0.5,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    })();

    return (
        <View style={styles.collectionContent}>
            <Animated.View style={[styles.collectionCover, animationStyle]} />
            <View style={styles.collectionInfo}>
                <Animated.View style={[styles.placeholderName, animationStyle]} />
                <Animated.View style={[styles.placeholderDesc, animationStyle]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    secContainer: {
        paddingBottom: PADDING,
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    secHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PADDING,
    },
    secTitle: {
        fontSize: font(16),
        color: '#202020',
        fontWeight: 'bold',
    },
    collectionList: {
        paddingLeft: PADDING,
        paddingTop: pixel(15),
    },
    itemWrap: {
        marginRight: PADDING,
        width: POSTER_WIDTH,
    },
    secFoot: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: PADDING,
    },
    refreshText: {
        marginLeft: pixel(4),
        fontSize: font(13),
        color: Theme.primaryColor,
    },
    collectionContent: {},
    collectionCover: {
        position: 'relative',
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        borderRadius: pixel(8),
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.24,
                shadowRadius: pixel(8),
                shadowOffset: {
                    width: 0,
                    height: pixel(3),
                },
            },
            android: {
                elevation: 6,
            },
        }),
    },
    picLabel: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: (font(19) * 64) / 34,
        height: font(19),
        paddingHorizontal: pixel(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    picLabelText: {
        color: '#fff',
        lineHeight: font(14),
        fontSize: font(11),
    },
    picBt: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: pixel(10),
        paddingBottom: pixel(4),
        paddingHorizontal: pixel(8),
    },
    picText: {
        color: '#fff',
        lineHeight: font(14),
        fontSize: font(11),
    },
    collectionInfo: {
        marginTop: pixel(5),
        minHeight: font(42),
    },
    placeholderName: {
        width: '60%',
        height: font(15),
        borderRadius: font(5),
        marginTop: font(6),
        backgroundColor: '#f0f0f0',
    },
    placeholderDesc: {
        width: '90%',
        height: font(15),
        borderRadius: font(5),
        marginTop: font(6),
        backgroundColor: '#f0f0f0',
    },
    collectionName: {
        color: '#202020',
        lineHeight: font(22),
        fontSize: font(14),
    },
    collectionDesc: {
        color: '#909090',
        lineHeight: font(20),
        fontSize: font(12),
    },
});
