import React from 'react';
import { View, ScrollView, ViewPropTypes, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { TabProps } from './TabViewProps';

const G_WIN_WIDTH = Dimensions.get('window').width;

const TABBAR_HEIGHT = 50;

class TabBar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.renderTabItem = this.renderTabItem.bind(this);
        this.updateView = this.updateView.bind(this);
        this.measureTab = this.measureTab.bind(this);
        this.tabOnLayout = this.tabOnLayout.bind(this);
        this.state = {
            leftUnderline: new Animated.Value(0),
            widthUnderline: new Animated.Value(0),
        };
        this.tabFrames = [];
        this.scrollX = 0;
    }

    componentDidMount() {
        this.props.scrollValue && this.props.scrollValue.addListener(this.updateView);
    }

    componentWillUnmount() {
        this.props.scrollValue && this.props.scrollValue.removeListener(this.updateView);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeIndex != this.props.activeIndex) {
            this.needsScrollTab();
        }
    }

    /**
     * scrollview是否需要滚动
     */
    needsScrollTab() {
        const { activeIndex, averageTab } = this.props;
        if (averageTab) return;
        if (!this.tabBarFrame) return;

        const itemLeft = this.tabFrames[activeIndex].left;
        const itemRight = this.tabFrames[activeIndex].right;

        const tabBar_left = itemLeft - this.scrollX; // 距离tabBar左边距离
        const tabBar_right = this.tabBarFrame.width - (itemRight - this.scrollX); // 距离tabBar左边距离

        if (activeIndex == 0) {
            // 滚动后到第一个
            this.toScrollTab(0);
        } else if (activeIndex == this.props.tabs.length - 1) {
            // 滚动后到最后一个
            this._scrollView && this._scrollView.scrollToEnd();
        } else {
            let scrollX;
            if (tabBar_left < this.tabFrames[activeIndex - 1].width) {
                scrollX = this.tabFrames[activeIndex - 1].left;
                this.toScrollTab(scrollX);
            } else if (tabBar_right < this.tabFrames[activeIndex + 1].width) {
                scrollX = this.tabFrames[activeIndex + 1].right - this.tabBarFrame.width;
                this.toScrollTab(scrollX);
            }
        }
    }

    /**
     * tabBar的scrollview横着滚动多少
     */
    toScrollTab(scrollX) {
        this._scrollView && this._scrollView.scrollTo({ x: scrollX, y: 0, animated: true });
    }

    /**
     * 更新视图
     */
    updateView(offset) {
        const pageNum = this.props.tabs.length;
        const { value } = offset;

        const floorPosition = Math.floor(value); // 对value下舍入
        const ceilPosition = Math.ceil(value); // 对value上舍入
        const pageOffset = offset.value % 1; // 当前页面和前后两个页面的offset

        if (pageNum < 0 || offset.value < 0 || value > pageNum - 1 || !this.tabFrames[floorPosition]) return;

        this.updateUnderLine(floorPosition, pageOffset, ceilPosition);
    }

    updateUnderLine(floorPosition, pageOffset, ceilPosition) {
        const itemLeft = this.tabFrames[floorPosition].left;
        const itemRight = this.tabFrames[floorPosition].right;

        if (ceilPosition < this.props.tabs.length) {
            const itemleftW = this.tabFrames[floorPosition].width;
            const itemrightW = this.tabFrames[ceilPosition].width;

            const line_left = (itemRight - itemLeft) * pageOffset + itemLeft;
            const line_width = (itemrightW - itemleftW) * pageOffset + itemleftW;

            this.state.leftUnderline.setValue(line_left);
            this.state.widthUnderline.setValue(line_width);
        }
    }

    /**
     * 渲染tabItem
     */
    renderTabItem({ item, index, onLayoutTab }) {
        if (!this.state.tabBarWidth) {
            return null;
        }
        const {
            activeIndex,
            activeTextStyle,
            goToPage,
            inactiveTextStyle,
            scrollValue,
            tabItemStyle,
            tabNameConvert,
            tabs,
        } = this.props;

        let opacity = 1;
        if (scrollValue && scrollValue.interpolate && tabs.length > 1) {
            opacity = scrollValue.interpolate({
                inputRange: this.getInputRange(),
                outputRange: this.getOutRange(index),
                extrapolate: 'clamp',
            });
        }

        const isActive = index == activeIndex;
        const textStyle = isActive ? activeTextStyle : inactiveTextStyle;
        const tabItemWidth = this.makeTabStyle();

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={'tabBar' + index}
                style={[tabItemWidth, styles.tabItem, tabItemStyle]}
                onPress={() => goToPage(index)}
                onLayout={e => {
                    onLayoutTab && onLayoutTab(e, index);
                }}>
                <Animated.Text style={[textStyle, { opacity }]}>
                    {tabNameConvert ? tabNameConvert(item) : item}
                </Animated.Text>
            </TouchableOpacity>
        );
    }

    /**
     * 渲染tabBar中间部分
     */
    renderTabBar() {
        const { tabs, underLineHidden, activeIndex, tabsContentStyle } = this.props;
        const { widthUnderline, leftUnderline } = this.state;
        // 如果有传滚动状态，用滚动状态更新下滑线
        const left = this.props.scrollValue ? leftUnderline : this.getItemWidth() * activeIndex;

        if (!tabs.length) return null;
        return (
            <Animated.View style={[{ flex: 1 }, this.props.tabsContainerStyle]} onLayout={this.tabOnLayout}>
                <ScrollView
                    ref={scrollView => {
                        this._scrollView = scrollView;
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    directionalLockEnabled={true}
                    bounces={false}
                    scrollsToTop={false}
                    scrollEventThrottle={16}
                    contentContainerStyle={tabsContentStyle}
                    onScroll={e => {
                        this.scrollX = e.nativeEvent.contentOffset.x;
                    }}>
                    <View style={styles.tabContainer}>
                        {tabs.map((item, index) => {
                            const renderTabItem = this.props.renderTabItem || this.renderTabItem;
                            return renderTabItem({ item, index, onLayoutTab: this.measureTab });
                        })}
                        {underLineHidden ? null : (
                            <Animated.View
                                style={[
                                    styles.tabUnderlineStyle,
                                    { width: widthUnderline, left: left },
                                    this.props.underlineStyle,
                                ]}>
                                <View style={styles.lineStyle} />
                            </Animated.View>
                        )}
                    </View>
                </ScrollView>
            </Animated.View>
        );
    }

    render() {
        const { renderLeftView, renderRightView, style } = this.props;
        return (
            <Animated.View style={[styles.container, style]}>
                {renderLeftView && typeof renderLeftView === 'function' ? renderLeftView() : null}
                {this.renderTabBar()}
                {renderRightView && typeof renderRightView === 'function' ? renderRightView() : null}
            </Animated.View>
        );
    }

    /**
     * 计算tabItem的样式
     */
    makeTabStyle() {
        const { averageTab } = this.props;
        if (averageTab) {
            return { width: this.getItemWidth() };
        } else {
            return { paddingLeft: 20, paddingRight: 20 };
        }
    }

    /**
     * 透明度InputRange
     */
    getInputRange() {
        const { tabs } = this.props;
        const range = [];
        for (let i = 0; i < tabs.length; i++) {
            range.push(i);
        }
        return range;
    }

    /**
     * 透明度outRange
     */
    getOutRange(index) {
        const array = this.getInputRange();
        const outRange = [];
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (index == element) {
                outRange.push(1);
            } else {
                outRange.push(0.6);
            }
        }
        return outRange;
    }

    /**
     * 获取一个tabItem的宽度
     */
    getItemWidth(index) {
        const { tabs, tabsContainerStyle, averageTab } = this.props;
        if (averageTab) {
            const tabW = tabsContainerStyle.width || this.state.tabBarWidth || G_WIN_WIDTH;
            if (!tabs.length) return tabW;
            return tabW / tabs.length;
        } else {
            if (!index || index > this.tabFrames.length - 1) return 0;
            return this.tabFrames[index].width;
        }
    }

    /**
     * tabBar的layout方法
     */
    tabOnLayout(event) {
        this.tabBarFrame = event.nativeEvent.layout;
        if (this.state.tabBarWidth != this.tabBarFrame.width) {
            this.setState({ tabBarWidth: this.tabBarFrame.width });
        }

        if (this.allTabLayout()) {
            this.needsScrollTab();
        }
    }

    measureTab(event, page) {
        const { x, width, height } = event.nativeEvent.layout;
        this.tabFrames[page] = { left: x, right: x + width, width, height };

        this.updateView({
            value: this.props.scrollValue ? (this.props.scrollValue._value ? this.props.scrollValue._value : 0) : 0,
        });

        if (this.allTabLayout()) {
            this.needsScrollTab();
        }
    }

    allTabLayout() {
        const { tabs } = this.props;
        for (let i = 0; i < tabs.length; i++) {
            if (!this.tabFrames[i]) return false;
        }
        return true;
    }
}

TabBar.propTypes = {
    ...TabProps,
    activeIndex: PropTypes.number.isRequired, // 选中tab
    underLineHidden: PropTypes.bool, // 是否隐藏下划线
    style: PropTypes.object, // tabBar样式
    tabItemStyle: ViewPropTypes.style, // tab样式
    underlineStyle: ViewPropTypes.style, // tab样式
    renderTabItem: PropTypes.func, // 自定义tabBar
    scrollValue: PropTypes.object, // 滚动状态
    tabSize: PropTypes.array, // 预留字段
    renderLeftView: PropTypes.func, // 左边视图
    renderRightView: PropTypes.func, // 右边视图
    goToPage: PropTypes.func, // 切换tab方法
};

TabBar.defaultProps = {
    underLineHidden: false,
    style: {},
    tabsContainerStyle: {},
    tabItemStyle: {},
    activeTextStyle: {
        fontSize: font(14),
        color: '#4D4D4D',
        fontWeight: 'bold',
    },
    inactiveTextStyle: {
        fontSize: font(14),
        color: '#848484',
        fontWeight: 'bold',
    },
    underlineStyle: {},
    tabs: [],
    averageTab: true,
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#e8e8ec',
        backgroundColor: '#fff',
        height: TABBAR_HEIGHT,
    },
    leftRightView: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabItem: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabUnderlineStyle: {
        position: 'absolute',
        height: 3,
        bottom: 0,
    },
    lineStyle: {
        backgroundColor: '#FFD321',
        borderRadius: 1.5,
        height: '100%',
        width: '65%',
        alignSelf: 'center',
    },
});

export default TabBar;
