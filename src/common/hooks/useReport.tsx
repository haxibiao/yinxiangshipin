import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { GQL } from '@src/apollo';
import { Overlay } from 'teaset';

type ChooserItem = {
    title: string;
    onPress: Function;
};

let overlayKey = null;

const hideChooser = () => {
    if (overlayKey) {
        Overlay.hide(overlayKey);
    }
};

const showChooser = (Choose: Array<ChooserItem>) => {
    const overlayView = (
        <Overlay.PullView
            containerStyle={{ backgroundColor: 'transparent' }}
            style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
            animated>
            <View style={styles.actionSheetView}>
                <FlatList
                    bounces={false}
                    scrollEnabled={false}
                    contentContainerStyle={styles.chooseContainer}
                    data={Choose}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={index}
                                style={styles.chooserItem}
                                onPress={() => {
                                    hideChooser();
                                    item.onPress();
                                }}>
                                <Text style={styles.chooserItemText}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    ItemSeparatorComponent={() => (
                        <View style={[{ height: pixel(1), backgroundColor: Theme.groundColour }]} />
                    )}
                    keyExtractor={(item, index) => 'key_' + (item.id ? item.id : index)}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.closeItem}
                    onPress={() => {
                        hideChooser();
                    }}>
                    <Text style={styles.headerText}>取消</Text>
                </TouchableOpacity>
            </View>
        </Overlay.PullView>
    );
    overlayKey = Overlay.show(overlayView);
};

interface Props {
    type: 'articles' | 'comments' | 'users' | 'user' | 'post';
    target: any;
}

export const useReport = ({ type = 'articles', target }: Props) => {
    const reason = useRef();
    const [reportMutation] = useMutation(GQL.createReportMutation, {
        variables: {
            type,
            id: target?.id,
            reason: reason.current,
        },
        onCompleted: (data) => {
            Toast.show({
                content: '举报成功，感谢您的反馈',
            });
        },
        onError: (error) => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '举报失败',
            });
        },
    });

    const reportAction = useCallback(
        (content) => {
            reason.current = content;
            reportMutation();
        },
        [reportMutation],
    );

    const report = useCallback(() => {
        const operations = [
            {
                title: '低俗色情',
                onPress: () => reportAction('低俗色情'),
            },
            {
                title: '侮辱谩骂',
                onPress: () => reportAction('侮辱谩骂'),
            },
            {
                title: '违法行为',
                onPress: () => reportAction('违法行为'),
            },
            {
                title: '垃圾广告',
                onPress: () => reportAction('垃圾广告'),
            },
            {
                title: '政治敏感',
                onPress: () => reportAction('政治敏感'),
            },
        ];
        showChooser(operations);
    }, [reportAction]);

    return report;
};

const styles = StyleSheet.create({
    actionSheetView: {
        marginBottom: Theme.bottomInset,
        overflow: 'hidden',
        padding: pixel(Theme.edgeDistance),
    },
    popSheetView: {
        marginBottom: Theme.bottomInset,
        overflow: 'hidden',
        padding: pixel(Theme.edgeDistance * 2),
    },
    chooseContainer: {
        backgroundColor: '#fff',
        borderRadius: pixel(6),
    },
    chooserItem: {
        height: pixel(50),
        justifyContent: 'center',
    },
    chooserItemText: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        textAlign: 'center',
    },
    closeItem: {
        height: pixel(46),
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: pixel(6),
        marginTop: pixel(Theme.edgeDistance),
    },
    headerText: {
        fontSize: font(16),
        color: Theme.confirm,
        textAlign: 'center',
    },
});
