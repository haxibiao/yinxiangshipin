/*
 * @flow
 * created by wyk made in 2019-04-01 17:53:01
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Text,
    Keyboard,
    Animated,
    Easing,
    ScrollView,
} from 'react-native';
import {
    TouchFeedback,
    Iconfont,
    Row,
    ItemSeparator,
    StatusView,
    Placeholder,
    KeyboardSpacer,
    Footer,
    SafeText,
} from '@src/components';
import { Query, Mutation, compose, GQL } from '@src/apollo';
import { appStore } from '@src/store';
import { observer } from 'mobx-react';
import Comments from './Comments';

@observer
class CommentOverlay extends Component {
    constructor(props) {
        super(props);
        this.offset = new Animated.Value(0);
        this.state = {
            visible: false,
            autoFocus: false,
        };
    }

    // 显示动画
    slideUp = params => {
        appStore.modalIsShow = true;
        this.setState(
            () => ({ visible: true, autoFocus: params?.autoFocus }),
            () => {
                Animated.timing(this.offset, {
                    easing: Easing.linear,
                    duration: 200,
                    toValue: 1,
                    useNativeDriver: true,
                }).start();
            },
        );
    };

    // 隐藏动画
    slideDown = () => {
        Animated.timing(this.offset, {
            easing: Easing.linear,
            duration: 200,
            toValue: 0,
            useNativeDriver: true,
        }).start(() => {
            this.setState({ visible: false, autoFocus: false });
            appStore.modalIsShow = false;
        });
    };

    render() {
        const { media } = this.props;
        const translateY = this.offset.interpolate({
            inputRange: [0, 1],
            outputRange: [(Device.HEIGHT * 2) / 3, 0],
            extrapolate: 'clamp',
        });
        if (!this.state.visible || !media) {
            return <View />;
        }
        return (
            <View style={styles.container}>
                <View style={styles.modalLayout}>
                    <TouchableOpacity style={styles.mask} onPress={this.slideDown} activeOpacity={1} />
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateY,
                                },
                            ],
                        }}>
                        <View style={styles.contentContainer}>
                            <View style={styles.header}>
                                <SafeText style={styles.headerText}>
                                    <SafeText style={styles.countCommentsText}>
                                        {Helper.syncGetter('count_comments', media)}
                                    </SafeText>
                                    {Helper.syncGetter('count_comments', media) > 0 ? '条评论' : '评论'}
                                </SafeText>
                                <TouchFeedback style={styles.close} onPress={this.slideDown}>
                                    <Iconfont name="guanbi1" size={pixel(20)} color={Theme.defaultTextColor} />
                                </TouchFeedback>
                            </View>
                            <Comments
                                media={media}
                                autoFocus={this.state.autoFocus}
                                commentAbleId={media.id}
                                commentAbleType="articles"
                            />
                        </View>
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    close: {
        alignItems: 'center',
        bottom: 0,
        height: pixel(44),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        width: pixel(44),
    },
    container: {
        ...StyleSheet.absoluteFill,
        zIndex: 1000,
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        height: (Device.HEIGHT * 2) / 3,
        overflow: 'hidden',
        paddingBottom: pixel(Theme.bottomInset),
    },
    countCommentsText: {
        fontSize: font(16),
    },
    header: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
    },
    headerText: {
        color: Theme.defaultTextColor,
        fontSize: font(15),
        fontWeight: 'bold',
    },
    mask: {
        ...StyleSheet.absoluteFill,
    },
    modalLayout: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export default CommentOverlay;
