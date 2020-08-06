import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Iconfont } from '@src/components';
import { font, pixel } from '../../helper';
import { useBetterMutation, GQL } from '../../service';

const reportReasons = ['低俗色情', '侮辱谩骂', '垃圾广告', '违法侵权', '感官不适', '政治敏感', '其他原因'] as const;

interface Props {
    id: number;
    type: 'articles' | 'comments' | 'user';
    close: () => void;
    successful?: (p?: any) => any;
    failure?: (p?: any) => any;
}

// const successful = useCallback(() => {
//     Toast.show({ content: '举报成功' });
// }, []);
// const failure = useCallback(err => {
//     Toast.show({ content: err || '举报失败' });
// }, []);

export default function Report({ id, type, close, successful, failure }: Props) {
    const [createReport, { loading }] = useBetterMutation(GQL.createReport, { successful, failure });
    const [reasonType, setReasonType] = useState('');
    const [description, setDescription] = useState('');
    const reasons = useMemo(() => {
        return (
            <View style={styles.reasonsContainer}>
                {reportReasons.map(item => {
                    return (
                        <TouchableOpacity
                            key={item}
                            style={styles.reasonItem}
                            onPress={() => {
                                if (reason !== '其他原因') {
                                    setDescription('');
                                }
                                setReasonType(item);
                            }}>
                            <Text style={styles.reasonText}>{item}</Text>
                            <Iconfont
                                name={reasonType === item ? 'radiobuttonchecked' : 'radiobuttonunchecked'}
                                color={reasonType === item ? '#0584FF' : '#b2b2b2'}
                                size={font(20)}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }, [reasonType]);

    const reason = useMemo(() => (reasonType === '其他原因' ? description : reasonType), [reasonType]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} activeOpacity={0.8} onPress={close}>
                    <Iconfont name="guanbi1" size={font(20)} color="#2b2b2b" />
                </TouchableOpacity>
                <Text style={styles.title}>举报原因</Text>
                <TouchableOpacity
                    style={styles.headerButton}
                    activeOpacity={0.8}
                    disabled={!reason}
                    onPress={() =>
                        createReport({
                            variables: {
                                id,
                                type,
                                reason,
                            },
                        })
                    }>
                    <Text style={[styles.submitText, !reason && { color: '#b2b2b2' }]}>提交</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {reasons}
                <View style={styles.inputWrap}>
                    <TextInput
                        multiline
                        editable={reasonType !== '其他原因'}
                        maxLength={200}
                        style={[styles.reasonInput, reasonType !== '其他原因' && { backgroundColor: '#efefef' }]}
                        placeholder="请描述举报原因(200字以内)"
                        value={description}
                        onChange={value => setDescription(value)}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        overflow: 'hidden',
    },
    header: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
    },
    title: {
        color: '#2b2b2b',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    headerButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: pixel(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        fontSize: font(18),
        color: '#0584FF',
    },
    content: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    reasonsContainer: {
        marginTop: pixel(15),
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    reasonItem: {
        width: '50%',
        height: pixel(40),
        paddingHorizontal: pixel(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reasonText: {
        fontSize: font(16),
        color: '#2b2b2b',
        marginRight: pixel(12),
    },
    inputWrap: {
        padding: pixel(15),
    },
    reasonInput: {
        height: pixel(80),
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
        paddingTop: 0,
        paddingBottom: 0,
        padding: 0,
        backgroundColor: '#fff',
    },
});
