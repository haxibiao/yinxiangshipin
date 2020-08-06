import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useMutation } from '@src/apollo';
import { userStore } from '@src/store';
import Iconfont from '../Iconfont';

type Props = {
    id: number,
    followedStatus: boolean | number,
    style?: any,
    titleStyle?: any,
    activeColor?: any,
    tintColor?: any,
};

const FollowButton = (props: Props) => {
    const navigation = useNavigation();
    const [followed, setfollowed] = React.useState(props.followedStatus ? true : false);
    const { id, activeColor, tintColor, ...others } = props;
    let { style, titleStyle } = props;
    let title, backgroundColor, textColor;
    if (followed) {
        title = '已关注';
        textColor = activeColor;
        backgroundColor = '#888888';
    } else {
        title = '关注';
        textColor = tintColor;
        backgroundColor = Theme.secondaryColor;
    }

    style = {
        backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
    };

    titleStyle = {
        fontSize: font(13),
        color: textColor,
        overflow: 'hidden',
        ...titleStyle,
    };

    const onFollowHandler = () => {
        // console.log('触发');
        if (!userStore.login) {
            navigation.navigate('Login');
        } else {
            // console.log('true');
            setfollowed(!followed);
            follow();
        }
    };

    const [follow] = useMutation(GQL.followUserMutation, {
        variables: {
            id,
        },
        refetchQueries: () => [
            {
                query: GQL.followedUsersQuery,
                variables: { user_id: userStore.me.id },
            },
            {
                query: GQL.userQuery,
                variables: { id },
            },
        ],
        onError: (error: any) => {
            Toast.show({ content: '操作失败', layout: 'top' });
        },
    });

    if (userStore.me.id === props.id) {
        return null;
    }

    return (
        <TouchableOpacity {...others} style={style} onPress={onFollowHandler}>
            <Text style={titleStyle} numberOfLines={1}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

FollowButton.defaultProps = {
    activeOpacity: 0.6,
    activeColor: Theme.subTextColor,
    tintColor: '#fff',
};

export default FollowButton;

const styles = StyleSheet.create({});
