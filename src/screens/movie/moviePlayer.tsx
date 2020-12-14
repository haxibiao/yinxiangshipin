import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, StatusBarProperties } from 'react-native';
import { PageContainer, StatusView, NavBarHeader } from '@src/components';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation';
import { userStore } from '@src/store';

const moviePlayer = (props) => {
    // https://neihandianying.com/movie/52188
    const route = useRoute();
    const navigation = useNavigation();
    const playUrl = route.params.playUrl;
    const webview = useRef(null);
    const [movieTitle, setMovieTitle] = useState('本片由内涵电影提供');
    const injectedJavascript = `(function() {
        window.postMessage = function(data) {
            window.ReactNativeWebView.postMessage(data);
        };
    })()`;
    const onMessageAction = (event) => {
        console.log('event', event.nativeEvent);
        setMovieTitle(event.nativeEvent.title);
        switch (event.nativeEvent.data) {
            case 'fullscreen':
                Orientation.lockToLandscape();
                break;
            case 'fullscreen_cancel':
                Orientation.lockToPortrait();
                break;
            default:
                break;
        }
    };
    useEffect(() => {
        return () => {
            Orientation.lockToPortrait();
        };
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" />
            {/* <WebView
                ref={webview}
                source={{ uri: playUrl }}
                style={{ width: '100%', height: '100%' }}
                startInLoadingState={true}
                showsVerticalScrollIndicator={false}
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo={true}
                injectedJavascript={injectedJavascript}
                onMessage={onMessageAction}
                renderLoading={() => {
                    return <StatusView.LoadingSpinner />;
                }}
                onLoad={() => {
                    // const user = Tools.syncGetter('user', data);
                    const InjectJavaScript = `receiveMessage('${JSON.stringify(userStore.me)}');true;`;
                    webview.current.injectJavaScript(InjectJavaScript);
                }}
                onLoadStart={() => {}}
                onLoadEnd={() => {}}
            /> */}
            <WebView
                ref={webview}
                source={{ uri: playUrl }}
                style={{ width: '100%', height: '100%', marginTop: Theme.statusBarHeight }}
                // containerStyle={{ marginTop: pixel(15) }}
                startInLoadingState={true}
                showsVerticalScrollIndicator={false}
                mediaPlaybackRequiresUserAction={false}
                // allowsFullscreenVideo={true}
                injectedJavaScript={injectedJavascript}
                onMessage={onMessageAction}
                renderLoading={() => {
                    return <StatusView.LoadingSpinner />;
                }}
                onLoad={() => {
                    const InjectJavaScript = `receiveMessage('${JSON.stringify(userStore.me)}');true;`;
                    webview.current.injectJavaScript(InjectJavaScript);
                }}
                onLoadStart={() => {}}
                onLoadEnd={() => {}}
            />
            {/* <NavBarHeader
                navBarStyle={styles.navBarStyle}
                hasGoBackButton={true}
                isTransparent={true}
                hasSearchButton={false}
                statusbarProperties={{ barStyle: 'dark-content' }}
            /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    optionsButton: {
        flex: 1,
        width: pixel(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Device.WIDTH,
        // backgroundColor: 'skyblue',
    },
});

export default moviePlayer;
