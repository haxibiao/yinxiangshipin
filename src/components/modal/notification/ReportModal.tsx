import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal, TextInput, ScrollView } from 'react-native';
import { GQL, useMutation, errorMessage } from '@src/apollo';
import { observer, autorun, adStore, userStore, notificationStore } from '@src/store';
import Iconfont from '../../Iconfont';
import { DebouncedPressable } from '../../Basic/DebouncedPressable';
import KeyboardSpacer from '../../Other/KeyboardSpacer';

const reportReasons = ['低俗色情', '侮辱谩骂', '垃圾广告', '违法侵权', '感官不适', '政治敏感'] as const;

// type: 'articles' | 'comments' | 'user';

export const ReportModal = observer(() => {
    const [visible, setVisible] = useState(false);
    const [noticeData, setNoticeData] = useState({});
    const shown = useRef(false);

    const [reasonType, setReasonType] = useState('');
    const [description, setDescription] = useState('');
    const [createReportMutation, { loading }] = useMutation(GQL.createReportMutation, {
        variables: {
            type: noticeData?.type,
            id: noticeData?.target?.id,
            reason: reasonType + (description ? `：${description}` : ''),
        },
        onCompleted: (data) => {
            Toast.show({
                content: '举报成功，感谢您的反馈',
            });
        },
        onError: (error) => {
            Toast.show({
                content: errorMessage(error, '举报失败'),
            });
        },
    });

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
            setNoticeData(data);
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            notificationStore.reduceReportNotice();
            setVisible(false);
            setNoticeData({});
            setReasonType('');
            setDescription('');
            shown.current = false;
        }
    }, []);

    useEffect(
        () =>
            autorun(() => {
                if (notificationStore.reportNotice.length > 0) {
                    showModal(notificationStore.reportNotice[0]);
                }
            }),
        [],
    );

    return (
        <Modal
            animationType="fade"
            visible={visible}
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <ScrollView keyboardDismissMode="interactive" contentContainerStyle={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <DebouncedPressable
                                style={[styles.headerButton, { left: 0 }]}
                                activeOpacity={0.8}
                                onPress={hideModal}>
                                <Iconfont name="guanbi1" size={font(20)} color="#2b2b2b" />
                            </DebouncedPressable>
                            <Text style={styles.title}>举报原因</Text>
                            <DebouncedPressable
                                style={[styles.headerButton, { right: 0 }]}
                                activeOpacity={0.8}
                                disabled={!reasonType}
                                onPress={() => {
                                    createReportMutation();
                                    hideModal();
                                }}>
                                <Text style={[styles.submitText, !reasonType && { color: '#b2b2b2' }]}>提交</Text>
                            </DebouncedPressable>
                        </View>
                        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                            <View style={styles.reasonsContainer}>
                                {reportReasons.map((item) => {
                                    return (
                                        <DebouncedPressable
                                            key={item}
                                            style={styles.reasonItem}
                                            onPress={() => {
                                                setReasonType(item);
                                            }}>
                                            <Iconfont
                                                name={
                                                    reasonType === item ? 'radiobuttonchecked' : 'radiobuttonunchecked'
                                                }
                                                color={reasonType === item ? Theme.primaryColor : '#b2b2b2'}
                                                size={font(20)}
                                            />
                                            <Text style={styles.reasonText}>{item}</Text>
                                        </DebouncedPressable>
                                    );
                                })}
                            </View>
                            <View style={styles.inputWrap}>
                                <TextInput
                                    multiline
                                    textAlignVertical="top"
                                    maxLength={200}
                                    style={styles.reasonInput}
                                    placeholder="补充举报信息(200字以内)"
                                    value={description}
                                    onChange={(value) => setDescription(value)}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
                <KeyboardSpacer />
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
    header: {
        alignItems: 'center',
        height: pixel(48),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    title: {
        color: '#212121',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    headerButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        paddingHorizontal: pixel(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        fontSize: font(16),
        color: Theme.primaryColor,
    },
    content: {
        flexGrow: 1,
        padding: pixel(15),
        backgroundColor: '#fff',
    },
    reasonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    reasonItem: {
        width: '50%',
        height: pixel(40),
        flexDirection: 'row',
        alignItems: 'center',
    },
    reasonText: {
        fontSize: font(16),
        lineHeight: font(20),
        color: '#2b2b2b',
        marginLeft: pixel(10),
    },
    inputWrap: {
        marginTop: pixel(15),
    },
    reasonInput: {
        height: pixel(120),
        padding: pixel(10),
        fontSize: font(15),
        lineHeight: font(20),
        borderRadius: pixel(5),
        color: '#2b2b2b',
        backgroundColor: '#f0f0f0',
    },
});
