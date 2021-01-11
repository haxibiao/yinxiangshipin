import React from 'react';
import ReactNative, { Animated } from 'react-native';
import memoize from 'memoize-one';
interface Props {
    index: number;
    isActive: boolean;
    containerOffsetY: Animated.Value;
    sceneHeight: number;
    headerHeight: number;
}

const compose = (WrappedComponent) => {
    const AnimateTabView = Animated.createAnimatedComponent(WrappedComponent);

    class TabView extends React.Component<Props> {
        constructor(props: Props) {
            super(props);
            this.scrollOffsetY = 0;
            this.state = {
                bottomPadding: 0,
            };
            this.mounted = false;
        }

        componentDidMount() {
            this.mounted = true;
            this.addListener();
        }

        componentWillUnmount() {
            this.removeListener();
        }

        addListener() {
            const { containerOffsetY } = this.props;
            containerOffsetY?.addListener(this.updateView);
        }

        removeListener() {
            const { containerOffsetY } = this.props;
            containerOffsetY?.removeListener(this.updateView);
        }

        scrollTo(e) {
            if (this._scrollViewRef) {
                const elementNode = this._scrollViewRef;
                if (elementNode?.scrollTo) {
                    elementNode.scrollTo({ x: 0, y: e.y, animated: false });
                } else if (elementNode?.scrollToOffset) {
                    elementNode.scrollToOffset({ offset: e.y, animated: false });
                } else if (elementNode?.scrollToLocation) {
                    elementNode.scrollToLocation({ itemIndex: 0, sectionIndex: 0, viewOffset: -e.y, animated: false });
                }
            }
        }

        // 其它TabView同步同步OffsetY
        updateView = (e) => {
            const { index, headerHeight, isActive } = this.props;
            if (isActive) return;
            if (e.value > headerHeight) {
                if (this.scrollOffsetY < headerHeight) {
                    this.scrollTo({ y: headerHeight });
                }
                return;
            }
            this.scrollTo({ y: e.value });
        };

        // 内容高度变化后，参数调整offset
        adjustScrollOffset = () => {
            if (this.mounted) {
                this.mounted = false;
                const { containerOffsetY, headerHeight } = this.props;
                const scrollValue = containerOffsetY._value > headerHeight ? headerHeight : containerOffsetY._value;
                this.scrollTo({ y: scrollValue });
            }
        };

        // 计算底部占位高度
        onContentSizeChange = (contentWidth, contentHeight) => {
            const { bottomPadding } = this.state;
            const { index, sceneHeight } = this.props;
            if (Math.ceil(contentHeight) < sceneHeight) {
                // 添加占位高度 bottomPadding
                const newBottomPadding = bottomPadding + sceneHeight - contentHeight;
                this.setState({ bottomPadding: newBottomPadding });
            } else {
                this.adjustScrollOffset();
                if (bottomPadding > 0) {
                    // 有占位高，考虑减少占位高
                    const remainingHeight = contentHeight - sceneHeight;
                    const newBottomPadding = remainingHeight > bottomPadding ? 0 : bottomPadding - remainingHeight;
                    if (newBottomPadding != bottomPadding) {
                        this.setState({ bottomPadding: newBottomPadding });
                    }
                }
            }
        };

        getScrollListener = memoize((isActive) => {
            if (isActive) {
                return Animated.event([{ nativeEvent: { contentOffset: { y: this.props.containerOffsetY } } }], {
                    useNativeDriver: true,
                    listener: this.onScroll,
                });
            } else {
                return this.onScroll;
            }
        });

        onScroll = (e) => {
            this.scrollOffsetY = e.nativeEvent.contentOffset.y;
        };

        render() {
            const { isActive, children, headerHeight, forwardedRef, ...restProps } = this.props;
            const { bottomPadding } = this.state;
            const scrollListener = this.getScrollListener(isActive);
            return (
                <AnimateTabView
                    ref={(ref) => {
                        this._scrollViewRef = ref;
                        if (forwardedRef) {
                            if (forwardedRef instanceof Function) {
                                forwardedRef(ref);
                            } else if (typeof forwardedRef === 'object' && forwardedRef.hasOwnProperty('current')) {
                                forwardedRef.current = ref;
                            }
                        }
                    }}
                    onScroll={scrollListener}
                    onContentSizeChange={this.onContentSizeChange}
                    contentContainerStyle={{
                        paddingTop: headerHeight,
                        paddingBottom: bottomPadding,
                    }}
                    overScrollMode="never"
                    scrollEventThrottle={16}
                    directionalLockEnabled={true}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    {...restProps}>
                    {children}
                </AnimateTabView>
            );
        }
    }

    return React.forwardRef((props, ref) => {
        return <TabView {...props} forwardedRef={ref} />;
    });
};

export const FlatList = compose(ReactNative.FlatList);
export const ScrollView = compose(ReactNative.ScrollView);
