/*
 * @flow
 * created by wyk made in 2018-12-11 16:16:04
 */

import React, { Component } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { appStore } from '@src/store';
import { observer } from 'mobx-react';

type Props = {
    onRefresh: Function,
    reset: Function,
    title?: string,
    size?: ?string,
    tintColor?: ?string,
    colors?: Array<string>,
    progressBackgroundColor?: ?string,
};

@observer
class CustomRefreshControl extends Component<Props> {
    static defaultProps = {
        title: '',
        size: undefined,
        tintColor: '#FFCC80',
        colors: [Theme.primaryColor, '#FFCC80'],
        progressBackgroundColor: '#fff',
    };

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: false,
        };
    }

    onRefresh = () => {
        const { onRefresh, reset } = this.props;
        const { deviceOffline } = appStore;
        if (deviceOffline) {
            Toast.show({ content: '网络错误,请检查网络连接' });
            return;
        }
        if (!onRefresh) return;
        this.setState({ isRefreshing: true }, async () => {
            try {
                await onRefresh();
            } catch (e) {
                console.error('onRefresh error', e);
            } finally {
                this.setState({ isRefreshing: false });
                reset && reset();
            }
        });
    };

    render() {
        const { refreshing, onRefresh, ...props } = this.props;
        return <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh} {...props} />;
    }
}

const styles = StyleSheet.create({});

export default CustomRefreshControl;
