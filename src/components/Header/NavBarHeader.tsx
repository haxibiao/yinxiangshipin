import React, { useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    ViewStyle,
    TextStyle,
    StatusBar,
    StatusBarProperties,
} from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import SafeText from '../Basic/SafeText';
import Iconfont from '../Iconfont';

{
    /* <LinearGradient
    style={styles.shadow}
    start={{ x: 0, y: 1 }}
    end={{ x: 0, y: 0 }}
    colors={['rgba(000,000,000,0.4)', 'rgba(000,000,000,0.2)', 'rgba(000,000,000,0.0)']}>
</LinearGradient>; */
}

interface Props {
    statusbarProperties: StatusBarProperties;
    navBarStyle?: ViewStyle;
    centerStyle?: ViewStyle;
    titleStyle?: TextStyle;
    title?: string;
    leftComponent?: JSX.Element;
    centerComponent?: JSX.Element;
    rightComponent?: JSX.Element;
    isTransparent?: boolean;
    hasGoBackButton?: boolean;
    hasSearchButton?: boolean;
    hasMoreButton?: boolean;
    onPressSearch?: () => void;
    backHandler?: () => void;
}

export default (props: Props) => {
    const navigation = useNavigation();
    const {
        statusbarProperties = {},
        navBarStyle,
        centerStyle,
        titleStyle,
        title,
        leftComponent,
        centerComponent,
        rightComponent,
        isTransparent,
        hasGoBackButton = true,
        hasSearchButton,
        hasMoreButton,
        onPressSearch,
        backHandler,
    } = props;

    const headerLeft = useMemo(() => {
        if (React.isValidElement(leftComponent)) {
            return leftComponent;
        } else if (hasGoBackButton) {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.leftButton}
                    onPress={() => {
                        if (backHandler instanceof Function) {
                            backHandler();
                        } else {
                            navigation.goBack();
                        }
                    }}>
                    <Iconfont
                        style={isTransparent && styles.textShadow}
                        name="fanhui"
                        size={23}
                        color={isTransparent ? '#fff' : '#2b2b2b'}
                    />
                </TouchableOpacity>
            );
        }
    }, [leftComponent, hasGoBackButton, backHandler]);

    const headerRight = useMemo(() => {
        if (React.isValidElement(rightComponent)) {
            return rightComponent;
        } else if (hasSearchButton) {
            return (
                <TouchableOpacity
                    style={styles.rightButton}
                    activeOpacity={1}
                    onPress={() => {
                        if (onPressSearch instanceof Function) {
                            onPressSearch();
                        } else {
                            navigation.push('Search');
                        }
                    }}>
                    <Iconfont
                        style={isTransparent && styles.textShadow}
                        name="fangdajing"
                        size={23}
                        color={isTransparent ? '#fff' : '#2b2b2b'}
                    />
                </TouchableOpacity>
            );
        } else if (hasMoreButton) {
            return (
                <TouchableOpacity style={styles.rightButton} activeOpacity={1}>
                    <Iconfont
                        style={isTransparent && styles.textShadow}
                        name="androidgengduo"
                        size={23}
                        color={isTransparent ? '#fff' : '#2b2b2b'}
                    />
                </TouchableOpacity>
            );
        }
    }, [rightComponent, hasSearchButton, hasMoreButton, onPressSearch]);

    const center = useMemo(() => {
        if (React.isValidElement(centerComponent)) {
            return centerComponent;
        } else if (title) {
            return (
                <Animated.View style={[styles.center, centerStyle]}>
                    <SafeText style={[styles.title, { color: isTransparent ? '#fff' : '#2b2b2b' }, titleStyle]}>
                        {title}
                    </SafeText>
                </Animated.View>
            );
        }
    }, [centerComponent, centerStyle, title, titleStyle]);

    const isFocused = useIsFocused();

    return (
        <View style={[styles.navBar, isTransparent && styles.transparent, navBarStyle]}>
            {isFocused ? <StatusBar {...statusbarProperties} /> : null}
            <View style={styles.header}>
                <View style={[styles.headerSide, styles.sideLeft]}>{headerLeft}</View>
                {center}
                <View style={[styles.headerSide, styles.sideRight]}>{headerRight}</View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        paddingTop: Theme.statusBarHeight,
        backgroundColor: Theme.skinColor || '#FFF',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    transparent: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Theme.NAVBAR_HEIGHT,
    },
    headerSide: {
        position: 'absolute',
        bottom: 0,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        marginHorizontal: pixel(65),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: Theme.primaryFontColor,
        fontSize: font(18),
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
    },
    sideLeft: {
        left: 0,
    },
    sideRight: {
        right: 0,
    },
    leftButton: {
        width: pixel(40),
        paddingLeft: pixel(12),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    rightButton: {
        width: pixel(40),
        paddingRight: pixel(12),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    shadow: {
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
    },
});
