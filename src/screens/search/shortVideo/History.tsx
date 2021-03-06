import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Iconfont, Row } from '@src/components';
import { Storage, RecordKeys } from '@src/store';

export default ({ searchKeyword, onSearch }) => {
    const [recordData, setRecordData] = useState([]);

    const getRecord = useCallback(async () => {
        const record = await Storage.getItem(RecordKeys.searchRecord);
        console.log('record', record);
        if (Array.isArray(record)) {
            setRecordData(record);
        }
    }, []);

    const addRecord = useCallback((newKeyword) => {
        setRecordData((oldData) => {
            const newData = new Set([newKeyword, ...oldData]);
            Storage.setItem(RecordKeys.searchRecord, [...newData]);
            return [...newData];
        });
    }, []);

    const removeRecordItem = useCallback((keyword) => {
        setRecordData((oldData) => {
            const newData = new Set(oldData);
            newData.delete(keyword);
            Storage.setItem(RecordKeys.searchRecord, [...newData]);
            return [...newData];
        });
    }, []);

    const reduceRecodes = useCallback(() => {
        setRecordData(() => {
            Storage.setItem(RecordKeys.searchRecord, []);
            setRecordData([]);
        });
    }, []);

    useEffect(() => {
        if (searchKeyword) {
            addRecord(searchKeyword);
        }
    }, [searchKeyword]);

    useEffect(() => {
        getRecord();
    }, []);

    const recordList = useMemo(() => {
        if (Array.isArray(recordData)) {
            return recordData.map((keyword) => {
                return (
                    <TouchableWithoutFeedback key={keyword} onPress={() => onSearch(keyword)}>
                        <View style={styles.keywordItem}>
                            <Row>
                                <Iconfont name="shizhong" size={font(16)} color="#202020" />
                                <Text style={styles.keywordText}>{keyword}</Text>
                            </Row>
                            <TouchableOpacity
                                style={styles.closeBtn}
                                activeOpacity={0.9}
                                onPress={() => removeRecordItem(keyword)}>
                                <Iconfont name="guanbi1" size={font(16)} color="#202020" />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });
        }
    }, [recordData]);

    return (
        <View style={styles.container}>
            {Array.isArray(recordData) && recordData.length > 0 && (
                <View style={styles.historyHeader}>
                    <Text style={styles.title}>搜索历史</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={reduceRecodes}>
                        <Text style={{ fontSize: font(14), color: '#b2b2b2' }}>清空</Text>
                    </TouchableOpacity>
                </View>
            )}
            {recordList}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: pixel(10),
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pixel(15),
        paddingVertical: pixel(5),
        height: pixel(30),
    },
    title: {
        color: '#202020',
        fontSize: font(15),
        fontWeight: 'bold',
    },
    keywordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: pixel(36),
        paddingLeft: pixel(15),
    },
    keywordText: {
        color: '#202020',
        fontSize: font(14),
        marginLeft: pixel(6),
    },
    closeBtn: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: pixel(15),
    },
});
