import React, { useMemo, ReactChild } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import LottieView from 'lottie-react-native';

const Source = {
    Loading: require('@app/assets/json/loading.json'),
    NotLogged: require('@app/assets/images/default_blank.png'),
    NoContent: require('@app/assets/images/default_empty.png'),
    SomeError: require('@app/assets/images/default_error.png'),
};

interface Props {
    style: ViewStyle;
    title: string;
    titleStyle: TextStyle;
    onPress?: (p?: any) => any;
    children: ReactChild;
}

function NotLogged({ style, onPress, children }: Props) {
    const content = useMemo(() => {
        if (React.isValidElement(children)) {
            return children;
        } else {
            return (
                <>
                    <Text style={styles.title}>你还没有登录</Text>
                    <Text style={styles.description}>登录账号，发现更多精彩内容</Text>
                    <TouchableOpacity style={styles.btnStyle} onPress={onPress}>
                        <Text style={styles.btnName}>登录</Text>
                    </TouchableOpacity>
                </>
            );
        }
    }, []);

    return (
        <View style={[styles.container, style]}>
            <Image style={styles.image} source={Source.NotLogged} />
            {content}
        </View>
    );
}

function Loading({ style, onPress, children }: Props) {
    const content = useMemo(() => {
        if (React.isValidElement(children)) {
            return children;
        } else {
            return <Text style={styles.description}>正在努力加载</Text>;
        }
    }, []);

    return (
        <View style={[styles.container, style]}>
            <LottieView source={Source.Loading} style={{ width: '40%' }} loop autoPlay />
            {content}
        </View>
    );
}

function NoContent({ style, onPress, children }: Props) {
    const content = useMemo(() => {
        if (React.isValidElement(children)) {
            return children;
        } else {
            return <Text style={styles.description}>此处空空如也，什么都没有哦</Text>;
        }
    }, []);

    return (
        <View style={[styles.container, style]}>
            <Image style={styles.image} source={Source.NoContent} />
            {content}
        </View>
    );
}

function SomeError({ style, onPress, children }: Props) {
    const content = useMemo(() => {
        if (React.isValidElement(children)) {
            return children;
        } else {
            <>
                <Text style={styles.title}>可能被外星人劫持了</Text>
                <Text style={styles.description}>请检查网络或者重新打开页面试试吧</Text>
                {onPress instanceof Function && (
                    <TouchableOpacity onPress={onPress}>
                        <Text>刷新一下</Text>
                    </TouchableOpacity>
                )}
            </>;
        }
    }, []);

    return (
        <View style={[styles.container, style]}>
            <Image style={styles.image} source={Source.SomeError} />
            {content}
        </View>
    );
}

export default {
    Loading,
    NotLogged,
    NoContent,
    SomeError,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        minHeight: percent(100),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: percent(50),
        height: percent(50),
        resizeMode: 'contain',
    },
    title: {
        marginTop: pixel(20),
        fontSize: font(16),
        color: '#969696',
    },
    description: {
        marginTop: pixel(15),
        fontSize: font(14),
        color: '#b2b2b2',
    },
    btnStyle: {
        marginTop: pixel(35),
        width: percent(60),
        height: percent(10),
        borderRadius: pixel(4),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.primaryColor,
    },
    btnName: {
        fontSize: font(16),
        color: '#fff',
    },
});
