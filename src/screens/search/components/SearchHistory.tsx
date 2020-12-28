import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Iconfont, Row } from '@src/components';
import { Storage, RecordKeys } from '@src/store';

export default ({ searchKeyword, onSearch }) => {
    const [recordData, setRecordData] = useState([]);

    const getRecord = useCallback(async () => {
        const record = await Storage.getItem(RecordKeys.searchRecord);
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

    const removeHistoryItem = useCallback((keyword) => {
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
                    <HistoryItem
                        key={keyword}
                        onSearch={onSearch}
                        keyword={keyword}
                        removeHistory={removeHistoryItem}
                    />
                );
            });
        }
    }, [recordData]);

    return (
        <View style={styles.container}>
            {Array.isArray(recordData) && recordData.length > 0 && (
                <View style={styles.historyHeader}>
                    <Text style={styles.title}>历史搜索</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={reduceRecodes}>
                        <Text style={{ fontSize: font(14), color: '#909090' }}>清空</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.listWrap}>{recordList}</View>
        </View>
    );
};

function HistoryItem({ keyword, onSearch, removeHistory }) {
    const [closeVisible, setCloseVisible] = useState(false);
    return (
        <TouchableWithoutFeedback onLongPress={() => setCloseVisible(true)} onPress={() => onSearch(keyword)}>
            <View style={styles.keywordItem}>
                <Text style={styles.keywordText}>{keyword}</Text>
                {closeVisible && (
                    <TouchableOpacity
                        style={styles.closeBtn}
                        activeOpacity={0.9}
                        onPress={() => removeHistory(keyword)}>
                        <Iconfont name="guanbi1" size={font(11)} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

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
    listWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: pixel(15),
        paddingRight: pixel(5),
    },
    keywordItem: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pixel(15),
        height: pixel(32),
        borderRadius: pixel(5),
        backgroundColor: '#f9f9f9',
        marginRight: pixel(10),
        marginTop: pixel(10),
    },
    keywordText: {
        color: '#202020',
        fontSize: font(12),
    },
    closeBtn: {
        position: 'absolute',
        top: pixel(-2),
        right: pixel(-2),
        width: pixel(14),
        height: pixel(14),
        borderRadius: pixel(7),
        backgroundColor: '#dfdfdf',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
