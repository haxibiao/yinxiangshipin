import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectListBar from './components/SelectListBar';
// 头部选择
export default function SelectHeader(props) {
    // const fetchData = props?.fetchData;
    const colors = props?.colors;
    const data = props?.data ?? []; // 筛选条件数据
    return (
        <View style={[styles.container]}>
            {data.map((item, index) => {
                return (
                    <SelectListBar
                        key={item.id}
                        // fetchData={fetchData}
                        // filterType={item?.id}
                        data={item?.filterOptions}
                        colors={colors}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
    },
});
