import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Button } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, GQL, useApolloClient } from '@src/apollo';
import { observer } from '@src/store';

const CategoryItem = (props) => {
    const { category, isHot, selectedCategories, selectCategory } = props;
    const selected = selectedCategories && selectedCategories.id === category.id;
    const navigation = useNavigation();
    const onPress = useCallback(() => {
        selectCategory(category);
        navigation.goBack();
    }, [category]);
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.categoryItem}>
                <Text style={styles.categoryName}>#{category.name}</Text>
                {isHot && (
                    <View style={styles.hotMark}>
                        <Text style={styles.hotMarkText}>热</Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const SelectCategory = (props) => {
    const client = useApolloClient();
    const route = useRoute();
    const selectCategory = route.params?.selectCategory;
    const selectedCategories = route.params?.categories;
    const [hotCategories, setHotCategories] = useState([]);
    const [latestCategories, setLatestCategories] = useState([]);
    const [promiseState, setPromiseState] = useState({ error: null, loading: true });
    // const [keyword, setKeyword] = useState();

    // const onChangeText = useCallback(inputKeyword => {
    //     setKeyword(inputKeyword);
    // }, []);

    const categoriesQuery = useCallback(() => {
        const hotCategoriesQuery = client.query({
            query: GQL.categoriesQuery,
            variables: { filter: 'hot' },
        });
        const latestCategoriesQuery = client.query({
            query: GQL.categoriesQuery,
            variables: { filter: 'other', count: 10 },
        });
        Promise.all([hotCategoriesQuery, latestCategoriesQuery])
            .then(function (responses) {
                const hotCategoriesData = Helper.syncGetter('data.categories.data', responses[0]);
                const latestCategoriesData = Helper.syncGetter('data.categories.data', responses[1]);
                if (hotCategoriesData) {
                    setHotCategories(hotCategoriesData);
                }
                if (latestCategoriesData) {
                    setLatestCategories(latestCategoriesData);
                }
                setPromiseState({
                    error: null,
                    loading: false,
                });
            })
            .catch(function (error) {
                setPromiseState({
                    loading: false,
                    error,
                });
            });
    }, [client, promiseState]);

    useEffect(() => {
        categoriesQuery();
    }, []);

    const renderHotCategories = useMemo(() => {
        return hotCategories.map((item) => (
            <CategoryItem
                key={item.id}
                isHot={true}
                category={item}
                selectedCategories={selectedCategories}
                selectCategory={selectCategory}
            />
        ));
    }, [hotCategories, selectedCategories]);

    const renderLatestCategories = useMemo(() => {
        return latestCategories.map((item) => (
            <CategoryItem
                key={item.id}
                category={item}
                selectedCategories={selectedCategories}
                selectCategory={selectCategory}
            />
        ));
    }, [latestCategories, selectedCategories]);
    return (
        <PageContainer title="选择话题" loading={promiseState.loading} error={promiseState.error}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                    <View style={styles.categorySection}>
                        <Text style={styles.categorySectionTitle}>热门话题</Text>
                        <View style={styles.categoryWrap}>{renderHotCategories}</View>
                    </View>
                    <View style={styles.categorySection}>
                        <Text style={styles.categorySectionTitle}>最新话题</Text>
                        <View style={styles.categoryWrap}>{renderLatestCategories}</View>
                    </View>
                </ScrollView>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    categoryItem: {
        alignItems: 'center',
        backgroundColor: Theme.slateGray2,
        borderRadius: pixel(4),
        flexDirection: 'row',
        height: pixel(34),
        justifyContent: 'center',
        marginRight: pixel(10),
        marginTop: pixel(10),
        paddingHorizontal: pixel(12),
    },
    categoryName: {
        color: Theme.secondaryTextColor,
        fontSize: font(13),
    },
    categorySection: {
        marginTop: pixel(Theme.edgeDistance),
    },
    categorySectionTitle: {
        color: Theme.slateGray1,
        fontSize: font(14),
        marginVertical: pixel(10),
    },
    categoryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    contentContainerStyle: {
        paddingBottom: Theme.bottomInset,
        paddingHorizontal: pixel(Theme.edgeDistance),
    },
    hotMark: {
        alignItems: 'center',
        backgroundColor: Theme.watermelon,
        borderRadius: pixel(4),
        height: pixel(18),
        justifyContent: 'center',
        marginLeft: pixel(10),
        width: pixel(18),
    },
    hotMarkText: {
        color: '#fff',
        fontSize: font(11),
    },
});

export default SelectCategory;
