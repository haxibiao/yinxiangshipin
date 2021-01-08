import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useFollowMutation, errorMessage } from '@src/apollo';
import { userStore } from '@src/store';
import { exceptionCapture } from '@src/common';
import Iconfont from '../Iconfont';

interface Props {
    user: any;
    style?: ViewStyle;
    textStyle?: ViewStyle;
    activeStyle?: ViewStyle;
    inactiveStyle?: ViewStyle;
    textActiveStyle?: ViewStyle;
    textInactiveStyle?: ViewStyle;
}

const defaultProps = {
    style: {},
    textStyle: {},
    activeStyle: {
        backgroundColor: '#b2b2b2',
    },
    inactiveStyle: {
        backgroundColor: Theme.secondaryColor,
    },
    textActiveStyle: {},
    textInactiveStyle: {},
    activeOpacity: 0.7,
};

const FollowButton = (props: Props) => {
    const { user, style, textStyle, activeStyle, inactiveStyle, textActiveStyle, textInactiveStyle, ...others } = props;
    const navigation = useNavigation();
    let btnName,
        btnStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        btnTextStyle = {
            color: '#fff',
            fontSize: font(13),
            overflow: 'hidden',
        };
    if (user?.followed_status > 0) {
        btnName = '已关注';
        btnStyle = {
            ...btnStyle,
            ...style,
            ...activeStyle,
        };
        btnTextStyle = {
            ...btnTextStyle,
            ...textStyle,
            ...textActiveStyle,
        };
    } else {
        btnName = '关注';
        btnStyle = {
            ...btnStyle,
            ...style,
            ...inactiveStyle,
        };
        btnTextStyle = {
            ...btnTextStyle,
            ...textStyle,
            ...textInactiveStyle,
        };
    }

    const followUser = useFollowMutation({
        variables: {
            followed_id: user?.id,
            followed_type: 'users',
        },
        refetchQueries: () => [
            {
                query: GQL.followedUsersQuery,
                variables: { user_id: userStore.me?.id },
            },
            {
                query: GQL.followPostsQuery,
                variables: {
                    user_id: userStore?.me?.id,
                    page: 1,
                    count: 10,
                    filter: 'all',
                },
                fetchPolicy: 'network-only',
            },
        ],
    });

    const onFollowHandler = useCallback(async () => {
        if (!userStore.login) {
            navigation.navigate('Login');
        } else {
            user.followed_status = user?.followed_status > 0 ? null : user?.id;
            const [error, res] = await exceptionCapture(followUser);
            if (error) {
                user.followed_status = user?.followed_status > 0 ? null : user?.id;
                Toast.show({ content: errorMessage(error) || '关注失败', layout: 'top' });
            }
        }
    }, [user, followUser]);

    if (userStore.me.id === user?.id) {
        return null;
    }
    return (
        <Pressable {...others} style={btnStyle} onPress={onFollowHandler}>
            {!user?.followed_status > 0 && (
                <Iconfont
                    name="iconfontadd"
                    size={btnTextStyle.fontSize}
                    color={btnTextStyle.color}
                    style={{ marginRight: btnTextStyle.fontSize / 2 }}
                />
            )}
            <Text style={btnTextStyle} numberOfLines={1}>
                {btnName}
            </Text>
        </Pressable>
    );
};

FollowButton.defaultProps = defaultProps;

export default FollowButton;

const styles = StyleSheet.create({});
