import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { Iconfont } from '@src/components';
import { GQL, useMutation } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { observer } from '@src/store';

interface ThumbUpTarget {
    id: number | string;
    liked: boolean;
    likes: number | string;
    [key: string]: any;
}

interface Props {
    [key: string]: any;
}

export default observer((props: Props) => {
    const { comment } = props;
    const navigation = useNavigation();
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            liked_id: Helper.syncGetter('id', comment),
            liked_type: 'COMMENT',
        },
    });

    const likeHandler = __.debounce(async function () {
        const [error] = await Helper.exceptionCapture(likeArticle);
        if (error) {
            comment.liked ? comment.likes-- : comment.likes++;
            comment.liked = !comment.liked;
            Toast.show({ content: '操作失败' });
        }
    }, 500);

    function toggleLike(): void {
        if (TOKEN) {
            comment.liked ? comment.likes-- : comment.likes++;
            comment.liked = !comment.liked;
            likeHandler();
        } else {
            navigation.navigate('Login');
        }
    }
    return (
        <TouchableOpacity style={styles.row} onPress={toggleLike}>
            <Iconfont size={pixel(17)} name="xihuanfill" color={comment.liked ? Theme.watermelon : Theme.slateGray2} />
            <Text style={styles.countLikes}>{comment.likes}</Text>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    countLikes: {
        color: Theme.slateGray2,
        fontSize: font(13),
        marginLeft: pixel(8),
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
