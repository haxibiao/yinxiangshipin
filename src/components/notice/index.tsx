import React, { Component } from 'react';
import { StyleSheet, AppRegistry, DeviceEventEmitter, View } from 'react-native';
import Notice, { NoticeProps } from './Notice';

let keyValue = 0;

type NoticeData = Exclude<NoticeProps, 'key' | 'onClose'>;

export default class Notification extends Component {
    static add(notice: NoticeData) {
        let key = ++keyValue;
        DeviceEventEmitter.emit('addNotice', { ...notice, key });
        return key;
    }

    static remove(key) {
        DeviceEventEmitter.emit('removeNotice', { key });
    }

    static removeAll() {
        DeviceEventEmitter.emit('removeAllNotice', {});
    }

    constructor(props) {
        super(props);
        this.state = {
            noticesData: [],
        };
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('addNotice', this.add);
        DeviceEventEmitter.addListener('removeNotice', this.remove);
        DeviceEventEmitter.addListener('removeAllNotice', this.removeAll);
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('addNotice');
        DeviceEventEmitter.removeAllListeners('removeNotice');
        DeviceEventEmitter.removeAllListeners('removeAllNotice');
    }

    add = (e) => {
        const { noticesData } = this.state;
        noticesData.push(e);
        this.setState({ noticesData });
    };

    remove = (e) => {
        const { noticesData } = this.state;
        for (let i = noticesData.length - 1; i >= 0; --i) {
            if (noticesData[i].key === e.key) {
                noticesData.splice(i, 1);
                break;
            }
        }
        this.setState({ noticesData });
    };

    removeAll = (e) => {
        this.setState({ noticesData: [] });
    };

    render() {
        const { noticesData } = this.state;
        return (
            <View style={styles.noticeWrap}>
                {noticesData.map((item) => {
                    return <Notice key={item.key} notice={item} onClose={Notification.remove} />;
                })}
            </View>
        );
    }
}

if (!AppRegistry.originRegisterComponent) {
    AppRegistry.originRegisterComponent = AppRegistry.registerComponent;
}

AppRegistry.registerComponent = function (appKey, componentProvider) {
    class RootElement extends Component {
        render() {
            const OriginAppComponent = componentProvider();
            return (
                <View style={styles.container}>
                    <OriginAppComponent {...this.props} />
                    <Notification />
                </View>
            );
        }
    }

    return AppRegistry.originRegisterComponent(appKey, () => RootElement);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    noticeWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
});
