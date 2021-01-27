import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Avatar, GridImage, Iconfont, Row, PlaceholderImage, SafeText } from '@src/components';
import { observer } from '@src/store';
import { CommonActions, useNavigation } from '@react-navigation/native';

export interface Props {
    feedback: any;
}

const COVER_WIDTH = Device.WIDTH - pixel(Theme.edgeDistance) * 2;

const FeedbackItem: React.FC<Props> = observer((props: Props) => {
    const { feedback } = props;
    const navigation = useNavigation();
    const { user, content, status_msg, images, created_at, hot, count_comment } = feedback;
    const renderCover = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) {
            return (
                <View style={styles.contentBottom}>
                    <GridImage images={images} />
                </View>
            );
        }
    }, []);

    const pushAction = useMemo(() => {
        return CommonActions.navigate({
            name: 'FeedbackDetail',
            params: {
                feedback,
            },
        });
    }, [feedback]);

    return (
        <TouchableWithoutFeedback onPress={() => navigation.dispatch(pushAction)}>
            <View style={styles.feedbackContainer}>
                <View style={styles.headerWrapper}>
                    <View style={styles.userInfo}>
                        <Avatar source={user.avatar} size={pixel(38)} />
                        <SafeText style={styles.nameText}>{user.name}</SafeText>
                    </View>
                </View>
                <View style={styles.contentTop}>
                    <Text style={styles.bodyText}>{content}</Text>
                </View>
                {renderCover}
                <View style={styles.bottomPartWrapper}>
                    <Row style={styles.metaList}>
                        <SafeText style={styles.timeAgoText} numberOfLines={1}>
                            {created_at}
                        </SafeText>
                        <Row>
                            <Iconfont name="remen1" size={pixel(14)} color={Theme.slateGray1} />
                            <Text style={[styles.metaText, { marginRight: pixel(10) }]} numberOfLines={1}>
                                {hot}
                            </Text>
                            <Iconfont name="liuyanfill" size={pixel(14)} color={Theme.slateGray1} />
                            <Text style={styles.metaText} numberOfLines={1}>
                                {count_comment || 0}
                            </Text>
                        </Row>
                    </Row>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default FeedbackItem;

const styles = StyleSheet.create({
    bodyText: { color: Theme.defaultTextColor, fontSize: font(16), letterSpacing: 0.8 },
    bottomPartWrapper: {
        marginTop: pixel(10),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    contentBottom: {
        marginTop: pixel(12),
    },
    contentTop: {
        marginTop: pixel(12),
    },
    feedbackContainer: {
        paddingHorizontal: pixel(Theme.edgeDistance),
        marginVertical: pixel(Theme.edgeDistance),
    },
    headerWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        justifyContent: 'space-between',
        marginLeft: pixel(Theme.edgeDistance),
    },
    landscape: {
        width: COVER_WIDTH,
        height: (COVER_WIDTH * 9) / 16,
        borderRadius: pixel(6),
    },
    metaList: {
        flex: 1,
        justifyContent: 'space-between',
    },
    metaText: {
        marginLeft: pixel(5),
        fontSize: font(11),
        color: Theme.slateGray2,
    },
    nameText: { fontSize: font(14), color: Theme.defaultTextColor, marginLeft: pixel(5) },
    portrait: {
        width: COVER_WIDTH * 0.5,
        height: COVER_WIDTH * 0.8,
        borderRadius: pixel(6),
    },
    rewardText: {
        marginLeft: pixel(5),
        fontSize: font(11),
        color: Theme.watermelon,
    },
    statusLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(24),
        borderRadius: pixel(12),
        paddingHorizontal: pixel(9),
        backgroundColor: Theme.groundColour,
    },
    statusText: {
        fontSize: font(11),
        color: Theme.subTextColor,
    },
    timeAgoText: { fontSize: font(12), color: Theme.slateGray1, fontWeight: '300' },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(Theme.edgeDistance),
    },
});
