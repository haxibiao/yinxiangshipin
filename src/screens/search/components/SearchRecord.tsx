import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Iconfont, Row } from '@src/components';
import { Storage, RecordKeys } from '@src/store';

const SearchRecord = ({ searchKeyword, search, color = '#2b2b2b' }) => {
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
                    <TouchableWithoutFeedback key={keyword} onPress={() => search(keyword)}>
                        <View style={styles.keywordItem}>
                            <Row>
                                <Iconfont name="shizhong" size={font(16)} color={color} />
                                <Text style={[styles.keywordText, { color }]}>{keyword}</Text>
                            </Row>
                            <TouchableOpacity
                                style={styles.closeBtn}
                                activeOpacity={0.9}
                                onPress={() => removeRecordItem(keyword)}>
                                <Iconfont name="guanbi1" size={font(16)} color={color} />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });
        }
    }, [recordData]);

    return <View style={styles.container}>{recordList}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: pixel(10),
    },
    keywordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: pixel(14),
        height: pixel(46),
        paddingVertical: pixel(5),
        paddingLeft: pixel(15),
    },
    keywordText: {
        color: '#b2b2b2',
        fontSize: font(15),
        marginLeft: pixel(6),
    },
    closeBtn: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: pixel(15),
    },
});

export default SearchRecord;
