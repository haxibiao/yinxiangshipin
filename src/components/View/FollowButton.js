import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useFollowMutation, errorMessage } from '@src/apollo';
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
    const { id, activeColor, tintColor, followedStatus, ...others } = props;
    const navigation = useNavigation();
    const [followed, setFollowed] = React.useState(!!followedStatus);
    let title, backgroundColor, textColor;
    if (followed) {
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
            Toast.show({ content: errorMessage(error) || '关注失败', layout: 'top' });
        },
    });

    const onFollowHandler = useCallback(() => {
        if (!userStore.login) {
            navigation.navigate('Login');
        } else {
            setFollowed((f) => !f);
            followUser();
        }
    }, [followUser]);

    if (userStore.me.id === props.id) {
        return null;
    }

    return (
        <TouchableOpacity {...others} style={style} onPress={onFollowHandler}>
            {!followed && (
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
