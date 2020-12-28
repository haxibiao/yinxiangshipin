import React from 'react';
import { StyleSheet, Text, View, Image, TextStyle, ViewStyle, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';

// 列表各状态：加载中、加载更多、没有数据、出错所对应的UI
type Status = 'loading' | 'loadMore' | 'empty' | 'error' | 'loadAll';

const statusContent: { [key in Status]: any } = {
    loading: {
        title: '努力加载中',
        image: require('@app/assets/json/loading.json'),
    },
    loadMore: {
        title: '加载更多',
        image: require('@app/assets/images/default/default_loading.png'),
    },
    empty: {
        title: '没有相关内容哦',
        image: require('@app/assets/images/default/default_empty.png'),
    },
    error: {
        title: '加载失败，点击重试',
        image: require('@app/assets/images/default/default_error.png'),
    },
};

interface Props {
    status: Status;
    style?: ViewStyle;
    titleStyle?: TextStyle;
    refetch?: (p: any) => any;
}

export default function ContentStatus({ status = 'loading', style, titleStyle, refetch }: Props) {
    const data = statusContent[status];

    if (!status) {
        return null;
    }

    if (status === 'loading') {
        return (
            <View style={[styles.container, style]}>
                <LottieView source={data.image} style={{ width: '40%' }} loop autoPlay />
            </View>
        );
    }

    if (status === 'loadMore') {
        return <LoadingContent data={data} style={style} />;
    }

    if (status === 'loadAll') {
        return (
            <View style={styles.listFooter}>
                <Text style={styles.listFooterText}>--end--</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <Image style={styles.image} source={data.image} />
            <Text style={[styles.title, refetch && { color: '#0584FF' }, titleStyle]} onPress={refetch}>
                {data.title}
            </Text>
        </View>
    );
}

function LoadingContent({ data, style }) {
    const startAnimation = React.useRef(false);
    const animation = React.useRef(new Animated.Value(1));

    if (!startAnimation.current) {
        const runAnimation = () => {
            animation.current.setValue(0);
            Animated.timing(animation.current, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => runAnimation());
        };
        runAnimation();
        startAnimation.current = true;
    }

    const rotateZ = animation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={[styles.listFooter, style]}>
            <Animated.Image style={[styles.loadingImage, { transform: [{ rotateZ }] }]} source={data.image} />
            <Text style={styles.loadingText}>{data.title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: percent(100),
    },
    image: {
        width: percent(36),
        height: percent(36),
        resizeMode: 'contain',
    },
    title: {
        fontSize: font(14),
        color: '#b2b2b2',
        marginTop: pixel(10),
    },
    listFooter: {
        width: '100%',
        height: pixel(50),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooterText: {
        fontSize: font(13),
        color: '#b4b4b4',
    },
    loadingImage: {
        width: pixel(20),
        height: pixel(20),
        resizeMode: 'contain',
    },
    loadingText: {
        fontSize: font(12),
        color: '#b2b2b2',
        marginLeft: font(6),
    },
});
