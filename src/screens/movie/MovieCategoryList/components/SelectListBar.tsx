import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeText, PageContainer, TouchFeedback } from '@src/components';
import Theme from '@app/src/common/theme';
// data 筛选
// filterType 类型
// fetchData 查询数据
// currentFiltersRef
export default function SelectListBar(props: any) {
    const { data, currentFiltersRef, filterType, fetchData, colors } = props;
    const [id, setid] = useState(0);
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.map((value, index) => {
                const islect = id === index;
                const backgroundColor = islect ? Theme.primaryColor : 'transparent';
                return (
                    <Pressable
                        style={[styles.button, { backgroundColor: backgroundColor }]}
                        onPress={() => alert('11')}>
                        <Text style={[islect ? styles.text : { color: '#000' }]}>{value}</Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: font(14),
        lineHeight: font(18),
        textAlign: 'center',
        color: '#fff',
    },
    button: {
        paddingHorizontal: pixel(5),
        paddingVertical: pixel(3),
        marginLeft: pixel(15),
        marginRight: pixel(5),
        marginVertical: pixel(8),
        borderRadius: pixel(5),
    },
});
