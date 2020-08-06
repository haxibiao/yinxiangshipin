import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Iconfont } from 'components';

const SearchRecord = ({ data, remove, search }) => {
    const recordList = useMemo(() => {
        if (Array.isArray(data)) {
            return data.map(name => {
                return (
                    <TouchableWithoutFeedback key={name} onPress={() => search(name)}>
                        <View style={styles.categoryItem}>
                            <Text style={styles.categoryName}>{name}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>搜索历史</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={remove}>
                    <Iconfont name="delete" color={'#999999'} size={pixel(20)} />
                </TouchableOpacity>
            </View>
            <View style={styles.categoryWrap}>{recordList}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    deleteButton: {
        paddingVertical: pixel(5),
        paddingLeft: pixel(10),
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: pixel(5),
        paddingHorizontal: pixel(15),
    },
    titleText: {
        color: '#666666',
        fontSize: font(14),
        // fontWeight: 'bold',
    },
    categoryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: pixel(10),
        marginLeft: pixel(20),
    },
    categoryItem: {
        alignItems: 'center',
        backgroundColor: Theme.groundColour,
        borderRadius: pixel(14),
        flexDirection: 'row',
        height: pixel(30),
        minWidth: pixel(44),
        justifyContent: 'center',
        marginRight: pixel(20),
        marginBottom: pixel(10),
        paddingHorizontal: pixel(10),
    },
    categoryName: {
        color: '#363636',
        fontSize: font(13),
    },
});

export default SearchRecord;
