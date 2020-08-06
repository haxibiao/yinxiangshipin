import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import { TABVIEW_TABDIDCLICK, TABVIEW_BECOME_RESPONDER } from './TabViewProps';

export default HPageViewHoc = (WrappedComponent) => {
    const AnimatePageView = Animated.createAnimatedComponent(WrappedComponent);

    class HPageView extends React.Component {
        static propTypes = {
            containerTrans: PropTypes.any.isRequired, //
            makeHeaderHeight: PropTypes.func, // 获取头部高度
        };

        static defaultProps = {
            makeHeaderHeight: () => {},
        };

        constructor(props) {
            super(props);
            this._onScroll = this._onScroll.bind(this);
            this.updateView = this.updateView.bind(this);
            this._onContentSizeChange = this._onContentSizeChange.bind(this);
            this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
            this.scrollTop = 0;
            this.state = {
                placeHeight: 0, // 占位高
                hideContent: true, // 是否显示内容
            };
            // 是否didMount
            this.didMount = false;
        }

        getOnScroll() {
            const { containerTrans, isActive } = this.props;

            if (isActive) {
                return Animated.event([{ nativeEvent: { contentOffset: { y: containerTrans } } }], {
                    useNativeDriver: true,
                    listener: this._onScroll,
                });
            } else {
                return this._onScroll;
            }
        }

        _onScroll(e) {
            this.scrollTop = e.nativeEvent.contentOffset.y;
        }

        tabDidClick = () => {
            this.stopScroll = true;
        };

        becomeResponder = (index) => {
            this.stopScroll = false;
        };

        componentDidMount() {
            this.didMount = true;
            this.addListener();
        }

        componentWillUnmount() {
            this.removeListener();
        }

        addListener() {
            const { addListener, containerTrans } = this.props;
            addListener(this, TABVIEW_TABDIDCLICK, this.tabDidClick);
            addListener(this, TABVIEW_BECOME_RESPONDER, this.becomeResponder);
            containerTrans && containerTrans.addListener(this.updateView);
        }

        removeListener() {
            const { removeListener, containerTrans } = this.props;
            removeListener(this, TABVIEW_TABDIDCLICK, this.tabDidClick);
            removeListener(this, TABVIEW_BECOME_RESPONDER, this.becomeResponder);
            containerTrans && containerTrans.removeListener(this.updateView);
        }

        onScrollBeginDrag() {
            const { scenePageDidDrag, index } = this.props;
            scenePageDidDrag(index);
        }

        /**
         * 在特定距离内，当容器内scrollView滚动后，其他ScrollView同时滚动
         * @param {*} e
         */
        updateView(e) {
            if (this.stopScroll) return;
            const { makeHeaderHeight, isActive } = this.props;

            if (isActive) return;
            if (e.value > makeHeaderHeight()) {
                if (this.scrollTop < makeHeaderHeight()) {
                    this.scrollTo({ y: makeHeaderHeight() });
                }
                return;
            }

            this.scrollTo({ y: e.value });
        }

        scrollTo(e) {
            if (this._scrollView) {
                const elementNode = this._scrollView;

                if (this.canScroll('scrollTo')) {
                    elementNode.scrollTo({ x: 0, y: e.y, animated: false });
                } else if (this.canScroll('scrollToOffset')) {
                    elementNode.scrollToOffset({ offset: e.y, animated: false });
                } else if (this.canScroll('scrollToLocation')) {
                    elementNode.scrollToLocation({ itemIndex: 0, sectionIndex: 0, viewOffset: -e.y, animated: false });
                }
            }
        }

        canScroll(scrollName) {
            return WrappedComponent.prototype.hasOwnProperty(scrollName);
        }

        tryScroll() {
            if (this.didMount) {
                this.didMount = false;
                const { containerTrans, makeHeaderHeight } = this.props;
                const scrollValue =
                    containerTrans._value > makeHeaderHeight() ? makeHeaderHeight() : containerTrans._value;

                this.scrollTo({ y: scrollValue });

                setTimeout(() => {
                    this.setState({ hideContent: false });
                }, 0);
            }
        }

        /**
         *  根据contentSize决定占位视图高度
         */
        _onContentSizeChange(contentWidth, contentHeight) {
            const { placeHeight } = this.state;
            const { expectHeight, faultHeight } = this.props;
            const containerHeight = expectHeight + faultHeight;
            if (contentHeight < containerHeight) {
                // 添加占位高度 placeHeight
                const newPlaceHeight = placeHeight + containerHeight - contentHeight;
                this.setState({ placeHeight: newPlaceHeight });
            } else {
                this.tryScroll();

                if (placeHeight > 0) {
                    // 有占位高，考虑减少占位高

                    const moreHeight = contentHeight - containerHeight;
                    const newPlaceHeight = moreHeight > placeHeight ? 0 : placeHeight - moreHeight;
                    if (newPlaceHeight != placeHeight) {
                        this.setState({ placeHeight: newPlaceHeight });
                    }
                }
            }
        }

        render() {
            const { children, containerTrans, makeHeaderHeight, forwardedRef, ...rest } = this.props;
            const { placeHeight } = this.state;
            const headerHeight = makeHeaderHeight();
            return (
                <AnimatePageView
                    ref={(_ref) => {
                        this._scrollView = _ref;
                        if (forwardedRef && forwardedRef.constructor) {
                            if (typeof forwardedRef === 'function') {
                                forwardedRef(_ref);
                            } else if (typeof forwardedRef === 'object') {
                                forwardedRef.current = _ref;
                            }
                        }
                    }}
                    style={{ opacity: this.state.hideContent ? 0 : 1 }}
                    scrollEventThrottle={16}
                    directionalLockEnabled
                    automaticallyAdjustContentInsets={false}
                    onScrollBeginDrag={this.onScrollBeginDrag}
                    onScroll={this.getOnScroll()}
                    overScrollMode="never"
                    contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: placeHeight }}
                    onContentSizeChange={this._onContentSizeChange}
                    {...rest}
                    showsVerticalScrollIndicator={false}>
                    {children}
                </AnimatePageView>
            );
        }
    }

    return React.forwardRef((props, ref) => {
        return <HPageView {...props} forwardedRef={ref} />;
    });
};
