import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, ViewStyle } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeText } from '@src/components';

import Iconfont from '../Iconfont';

interface Props {
    routeName?: string;
    leftComponent?: Element;
    centerComponent?: Element;
    rightComponent?: Element;
    hidden?: boolean;
    lightBar?: boolean;
    customStyle?: ViewStyle;
    backHandler?: () => void;
    onLayout?: (event: any) => void;
}

const Header = (props: Props) => {
    const navigation = useNavigation();
    const route = useRoute();

    const {
        routeName,
        leftComponent,
        centerComponent,
        rightComponent,
        hidden = false,
        lightBar = false,
        customStyle = {},
        backHandler,
        onLayout = (event: any) => null,
    } = props;

    return (
        <View style={[styles.header, lightBar && styles.lightHeader, customStyle]} onLayout={onLayout}>
            {leftComponent ? (
                leftComponent
            ) : (
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.side, { width: 40, left: 15 }]}
                    onPress={() => {
                        if (backHandler) {
                            backHandler();
                        } else {
                            navigation.goBack();
                        }
                    }}>
                    <Iconfont name="fanhui" size={23} color={lightBar ? '#fff' : Theme.primaryFontColor} />
                </TouchableOpacity>
            )}
            {centerComponent ? (
                centerComponent
            ) : (
                <View style={styles.title}>
                    <SafeText style={[styles.routeName, lightBar && { color: '#fff' }]}>
                        {routeName ? routeName : route.name}
                    </SafeText>
                </View>
            )}
            {rightComponent && <View style={[styles.side, { right: 15 }]}>{rightComponent}</View>}
        </View>
    );
};

export default Header;

// TODO:【Bin】下面的paddingTop要换手机顶部tab的高度
const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        backgroundColor: Theme.skinColor || '#FFF',
        borderBottomColor: Theme.lightBorderColor,
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 60 + 40,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 60,
    },
    lightHeader: { backgroundColor: 'transparent', borderBottomColor: 'transparent' },
    routeName: {
        color: Theme.primaryFontColor,
        fontSize: font(17),
        fontWeight: '500',
    },
    side: {
        alignItems: 'center',
        bottom: 0,
        flexDirection: 'row',
        height: 40,
        position: 'absolute',
    },
    title: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 40,
    },
});
