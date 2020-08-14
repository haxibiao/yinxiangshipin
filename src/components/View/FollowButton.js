import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useFollowMutation, errorMessage } from '@src/apollo';
import { userStore } from '@src/store';
import { exceptionCapture } from '@src/common';
import Iconfont from '../Iconfont';

type Props = {
    style?: any,
    titleStyle?: any,
    activeColor?: any,
    tintColor?: any,
};

const FollowButton = (props: Props) => {
    const { user, activeColor, tintColor, ...others } = props;
    const navigation = useNavigation();
    let title, backgroundColor, textColor;
    if (user?.followed_status > 0) {
        title = '已关注';
        textColor = activeColor;
        backgroundColor = '#b2b2b2';
    } else {
        title = '关注';
        textColor = tintColor;
        backgroundColor = Theme.secondaryColor;
    }
    const style = {
        backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
    };

    const titleStyle = {
        fontSize: font(13),
        color: textColor,
        overflow: 'hidden',
        ...props.titleStyle,
    };

    const followUser = useFollowMutation({
        variables: {
            id: user?.id,
        },
        refetchQueries: () => [
            {
                query: GQL.followedUsersQuery,
                variables: { user_id: userStore.me?.id },
            },
            // {
            //     query: GQL.userQuery,
            //     variables: { id: user?.id },
            // },
        ],
    });

    const onFollowHandler = useCallback(async () => {
        if (!userStore.login) {
            navigation.navigate('Login');
        } else {
            user.followed_status = user?.followed_status > 0 ? null : user?.id;
            const [error, res] = await exceptionCapture(followUser);
            console.log('res', res);
            if (error) {
                user.followed_status = user?.followed_status > 0 ? null : user?.id;
                Toast.show({ content: errorMessage(error) || '关注失败', layout: 'top' });
            }
        }
    }, [user, followUser]);

    if (userStore.me.id === user?.id) {
        return null;
    }
    console.log('user.followed_status', user.followed_status);
    return (
        <TouchableOpacity {...others} style={style} onPress={onFollowHandler}>
            {!user?.followed_status > 0 && (
                <Iconfont
                    name="iconfontadd"
                    size={titleStyle.fontSize}
                    color={titleStyle.color}
                    style={{ marginRight: titleStyle.fontSize / 2 }}
                />
            )}
            <Text style={titleStyle} numberOfLines={1}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

FollowButton.defaultProps = {
    activeOpacity: 0.6,
    activeColor: '#fff',
    tintColor: '#fff',
};

export default FollowButton;

const styles = StyleSheet.create({});
