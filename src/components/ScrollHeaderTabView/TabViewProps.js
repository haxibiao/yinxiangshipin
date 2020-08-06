import PropTypes from 'prop-types';

// tabView的props
export const TabViewProps = {
    ...TabProps,
    initialPage: PropTypes.number, // 初始页面序号
    renderTabBar: PropTypes.func, // 渲染tabBar元素方法
    extraData: PropTypes.any, // 由于tabView继承至PureComponent，需要刷新页面的额外数据
    onChangeTab: PropTypes.func, // tab切换的回调 参数(上次页面，当前页)
    onScroll: PropTypes.func, // 滚动回调
    preInitSceneNum: PropTypes.number, // 预加载页面数
    locked: PropTypes.bool, // 是否锁定滚动
    pageDidShow: PropTypes.func, // 当前展示的页面
    renderHeader: PropTypes.func, // 渲染头部 参数{item,index}
    renderFooter: PropTypes.func, // 渲染尾部 参数{item,index}
    tabBarStyle: PropTypes.any, // tabBar style
};

// tabBar的props
export const TabProps = {
    tabs: PropTypes.array.isRequired, // 数据源
    tabNameConvert: PropTypes.func, // tabBar显示文字转换方法:可以指定数据源tabs中 tabName是直接显示还是经过方法转换,
    averageTab: PropTypes.bool, // tabItem宽度是否均分
    tabsContainerStyle: PropTypes.any, // tabBar容器样式
    tabsContentStyle: PropTypes.any, // tabBar内部ScrollView样式
    activeTextStyle: PropTypes.object, // 选中样式
    inactiveTextStyle: PropTypes.object, // 未选中样式
};

export const TABVIEW_TABDIDCLICK = 'TABVIEW_TABDIDCLICK';
export const TABVIEW_BECOME_RESPONDER = 'TABVIEW_BECOME_RESPONDER';
