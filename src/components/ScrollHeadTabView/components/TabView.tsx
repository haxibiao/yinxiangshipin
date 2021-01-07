import React from 'react';
import ReactNative, { Animated } from 'react-native';

interface Props {
    index: number;
    isActive: boolean;
    containerOffsetY: Animated.Value;
    sceneHeight: number;
    headerHeight: number;
}

const tabViewHoc = (WrappedComponent) => {
    const AnimatePageView = Animated.createAnimatedComponent(WrappedComponent);

    class HTabView extends React.Component {
        constructor(props: Props) {
            super(props);
            this.scrollOffsetY = 0;
            this.state = {
                placeHeight: 0,
            };
            this.didMount = false;
        }

        componentDidMount() {
            this.didMount = true;
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
            if (this._scrollView) {
                const elementNode = this._scrollView;
                if (elementNode?.scrollTo) {
                    elementNode.scrollTo({ x: 0, y: e.y, animated: false });
                } else if (elementNode?.scrollToOffset) {
                    elementNode.scrollToOffset({ offset: e.y, animated: false });
                } else if (elementNode?.scrollToLocation) {
                    elementNode.scrollToLocation({ itemIndex: 0, sectionIndex: 0, viewOffset: -e.y, animated: false });
                }
            }
        }

        // 其它scrollTab同步同步OffsetY
        updateView = (e) => {
            const { headerHeight, isActive } = this.props;
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
            if (this.didMount) {
                this.didMount = false;
                const { containerOffsetY, headerHeight } = this.props;
                const scrollValue = containerOffsetY._value > headerHeight ? headerHeight : containerOffsetY._value;
                this.scrollTo({ y: scrollValue });
            }
        };

        // 根据contentSize决定占位视图高度
        onContentSizeChange = (contentWidth, contentHeight) => {
            const { placeHeight } = this.state;
            const { sceneHeight } = this.props;
            if (contentHeight < sceneHeight) {
                // 添加占位高度 placeHeight
                const newPlaceHeight = placeHeight + sceneHeight - contentHeight;
                this.setState({ placeHeight: newPlaceHeight });
            } else {
                this.adjustScrollOffset();
                if (placeHeight > 0) {
                    // 有占位高，考虑减少占位高
                    const moreHeight = contentHeight - sceneHeight;
                    const newPlaceHeight = moreHeight > placeHeight ? 0 : placeHeight - moreHeight;
                    if (newPlaceHeight != placeHeight) {
                        this.setState({ placeHeight: newPlaceHeight });
                    }
                }
            }
        };

        scrollListener = () => {
            const { containerOffsetY, isActive } = this.props;
            if (isActive) {
                return Animated.event([{ nativeEvent: { contentOffset: { y: containerOffsetY } } }], {
                    useNativeDriver: true,
                    listener: this.onScroll,
                });
            } else {
                return this.onScroll;
            }
        };

        onScroll = (e) => {
            this.scrollOffsetY = e.nativeEvent.contentOffset.y;
        };

        render() {
            const { children, headerHeight, forwardedRef, ...restProps } = this.props;
            const { placeHeight } = this.state;
            return (
                <AnimatePageView
                    ref={(ref) => {
                        this._scrollView = ref;
                        if (forwardedRef) {
                            if (typeof forwardedRef === 'function') {
                                forwardedRef(ref);
                            } else if (typeof forwardedRef === 'object') {
                                forwardedRef.current = ref;
                            }
                        }
                    }}
                    onScroll={this.scrollListener()}
                    onContentSizeChange={this.onContentSizeChange}
                    contentContainerStyle={{
                        paddingTop: headerHeight,
                        paddingBottom: placeHeight,
                    }}
                    overScrollMode="never"
                    scrollEventThrottle={16}
                    directionalLockEnabled={true}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    {...restProps}>
                    {children}
                </AnimatePageView>
            );
        }
    }

    return React.forwardRef((props, ref) => {
        return <HTabView {...props} forwardedRef={ref} />;
    });
};

export const FlatList = tabViewHoc(ReactNative.FlatList);
export const ScrollView = tabViewHoc(ReactNative.ScrollView);
