import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { useNavigation, useRoute } from '@react-navigation/native';
const Content = observer(({ media }) => {
    const navigation = useNavigation();
    const {
        time_ago,
        created_at,
        count_tips,
        count_likes,
        count_comments,
        count_replies,
        categories,
        content,
        description,
        user,
        liked,
    } = media;
    console.log('media', media);
    const categoryList = useMemo(() => {
        if (Array.isArray(categories) && categories.length > 0) {
            return (
                <View style={styles.categories}>
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.categoryItem}
                            onPress={() => navigation.navigate('Category', { category })}>
                            <Text style={styles.categoryName}>#{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else {
            return null;
        }
    }, [categories]);

    return (
        <View style={styles.content}>
            <View style={styles.statistical}>
                <Text style={styles.statisticalText} numberOfLines={1}>
                    {count_tips || 0}浏览
                </Text>
                <Text style={[styles.statisticalText, { marginHorizontal: pixel(5) }]}>·</Text>
                <Text style={styles.statisticalText} numberOfLines={1}>
                    {created_at}
                </Text>
            </View>

            <View style={styles.body}>
                <Text style={styles.bodyText}>
                    <Text style={styles.userName}>{user.name + ':  '}</Text>
                    {content || description}
                </Text>
            </View>

            <View style={styles.metaList}>
                {categoryList && (
                    <View style={styles.mateItem}>
                        <Image source={require('@app/assets/images/icon_category_g.png')} style={styles.icon} />
                        {categoryList}
                    </View>
                )}
                <View style={styles.mateItem}>
                    <Image
                        source={
                            liked
                                ? require('@app/assets/images/icon_like_r.png')
                                : require('@app/assets/images/icon_like_g.png')
                        }
                        style={styles.icon}
                    />
                    <Text style={styles.mateText}>{count_likes}</Text>
                </View>
                <View style={styles.mateItem}>
                    <Image source={require('@app/assets/images/icon_comment_g.png')} style={styles.icon} />
                    <Text style={styles.mateText}>{count_comments}</Text>
                </View>
            </View>
        </View>
    );
});

export default Content;

const styles = StyleSheet.create({
    content: {
        padding: pixel(10),
        backgroundColor: '#fff',
    },
    statistical: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statisticalText: {
        color: '#9d9d9d',
        fontSize: font(13),
    },
    body: {
        marginVertical: pixel(10),
    },
    bodyText: {
        color: '#2A2A2A',
        fontSize: font(15),
        lineHeight: font(22),
    },
    userName: {
        color: '#013569',
        fontSize: font(15),
        lineHeight: font(22),
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryItem: {
        marginRight: pixel(5),
    },
    categoryName: {
        color: '#013569',
        fontSize: font(14),
        marginRight: pixel(2),
        lineHeight: font(18),
    },
    mateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: pixel(5),
    },
    icon: {
        width: pixel(18),
        height: pixel(18),
        marginRight: pixel(10),
    },
    mateText: {
        color: '#2A2A2A',
        fontSize: font(14),
        marginRight: pixel(2),
        lineHeight: font(18),
    },
});
