import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableNativeFeedback,
    TouchableOpacity,
    ViewProps,
    ViewStyle,
    TextStyle,
} from 'react-native';

interface Props extends ViewProps {
    containerWidth: number; //tabBar外部容器宽度
    scrollValue: number; //切换tab的对应系数
    tabs: Array;
    tabUnderlineWidth?: number;
    tabUnderlineHeight?: number;
    tabUnderlineScaleX?: number;
    hiddenUnderLine?: boolean;
    underLineColor?: string;
    underlineStyle?: ViewStyle;
    activeTextStyle?: TextStyle;
    tintTextStyle?: TextStyle;
    tabWidth?: number;
    tabStyle?: ViewStyle;
    textStyle?: TextStyle;
    style?: ViewStyle;
}

export default class DefaultTabBar extends Component<Props> {
    static defaultProps = {
        activeTextStyle: { color: Theme.defaultTextColor },
        tintTextStyle: { color: Theme.subTextColor },
        underLineColor: Theme.secondaryColor,
        tabUnderlineHeight: 2,
        hiddenUnderLine: false,
    };

    _renderTab(name: string, page: number, isTabActive: boolean, onPressHandler: Function) {
        let { tabWidth, tabStyle, textStyle, activeTextStyle, tintTextStyle } = this.props;
        let style = isTabActive ? activeTextStyle : tintTextStyle;
        let tabWidthStyle = tabWidth ? { width: tabWidth } : { flex: 1 };
        tabStyle = {
            alignItems: 'center',
            justifyContent: 'center',
            ...tabWidthStyle,
            ...tabStyle,
        };
        textStyle = {
            fontSize: font(16),
            ...style,
            ...textStyle,
        };
        return (
            <TouchableOpacity style={tabStyle} key={name} onPress={() => onPressHandler(page)}>
                <Text style={textStyle}>{name}</Text>
            </TouchableOpacity>
        );
    }

    _renderUnderline() {
        let {
            tabs,
            underlineStyle,
            containerWidth,
            tabWidth,
            tabUnderlineWidth,
            tabUnderlineHeight,
            tabUnderlineScaleX,
            underLineColor,
            scrollValue,
        } = this.props;
        let numberOfTabs = tabs.length;
        let underlineWidth = tabUnderlineWidth
            ? tabUnderlineWidth
            : tabWidth
            ? tabWidth * 0.6
            : containerWidth / (numberOfTabs * 2);
        let scale = tabUnderlineScaleX ? tabUnderlineScaleX : 2;
        let deLen = tabWidth ? tabWidth * 0.2 : (containerWidth / numberOfTabs - underlineWidth) / 2;
        let tabUnderlineStyle = {
            position: 'absolute',
            width: underlineWidth,
            height: tabUnderlineHeight,
            borderRadius: tabUnderlineHeight,
            backgroundColor: underLineColor,
            bottom: 0,
            left: deLen,
            ...underlineStyle,
        };

        // 滑动tab，对应系数0~1
        let translateX = scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, tabWidth ? tabWidth : containerWidth / numberOfTabs],
        });

        // 计算scaleX动画系数
        let scaleValue = (defaultScale) => {
            let number = 4;
            let arr = new Array(number * 2);
            return arr.fill(0).reduce(
                function (pre, cur, idx) {
                    idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx - 1] + 0.5);
                    idx % 2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1);
                    return pre;
                },
                { inputRange: [], outputRange: [] },
            );
        };

        let scaleX = scrollValue.interpolate(scaleValue(scale));

        return (
            <Animated.View
                style={[
                    tabUnderlineStyle,
                    {
                        transform: [{ translateX }, { scaleX }],
                    },
                ]}
            />
        );
    }

    componentDidMount() {
        this.props.onMounted && this.props.onMounted();
    }

    render() {
        let { style, tabs, hiddenUnderLine } = this.props;
        return (
            <Animated.View style={[styles.tabBar, style]}>
                {!hiddenUnderLine && this._renderUnderline()}
                {tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    return this._renderTab(name, page, isTabActive, this.props.goToPage);
                })}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    tabBar: {
        height: pixel(Theme.NAVBAR_HEIGHT),
        flexDirection: 'row',
        alignItems: 'stretch',
        borderWidth: pixel(0.5),
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: Theme.borderColor,
    },
});