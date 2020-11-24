import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Sentry from '@sentry/react-native';

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
        const code = error.toString().indexOf('Network error');
        if (code < 0 && !__DEV__) {
            Sentry.captureException(error);
        }

        this.setState({ hasError: true });
    }

    componentWillUnmount() {
        this.setState({ hasError: false });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <LottieView
                        source={require('@app/assets/json/error_screen.json')}
                        style={{ width: '60%' }}
                        loop
                        autoPlay
                    />
                    <Text style={styles.title}>出了一点问题，我们会尽快修复</Text>
                    <Text style={styles.title}>请尝试重启App或更新到最新版</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: percent(80),
    },
    image: {
        width: percent(36),
        height: percent(36),
        resizeMode: 'cover',
    },
    title: {
        fontSize: pixel(12),
        marginTop: pixel(10),
        color: Theme.subTextColor,
    },
});

export default AppErrorBoundary;
