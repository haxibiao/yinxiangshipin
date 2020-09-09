import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { observer, appStore, userStore } from '@src/store';
import { useClipboardLink, VideoCaptureData } from '@src/content';
import { useApolloClient } from '@apollo/react-hooks';
import { useBeginner } from '@src/common';
import { NavBarHeader } from '@src/components';
import { Overlay } from 'teaset';
import RecommendVideos from './RecommendVideos';

export default observer(() => {
    useBeginner();

    const [shareContent] = useClipboardLink();
    const isShow = useRef(false);
    const overlayRef = useRef();

    const showShareContentModal = useMemo(() => {
        function onClose() {
            overlayRef.current?.close();
            isShow.current = false;
        }
        return (params) => {
            if (!isShow.current) {
                isShow.current = true;
                Overlay.show(
                    <Overlay.PopView
                        style={styles.overlay}
                        ref={overlayRef}
                        onDisappearCompleted={() => (isShow.current = false)}>
                        <VideoCaptureData
                            client={appStore.client}
                            onSuccess={onClose}
                            onFailed={onClose}
                            onClose={onClose}
                            {...params}
                        />
                    </Overlay.PopView>,
                );
            }
        };
    }, []);

    useEffect(() => {
        if (userStore.login && shareContent && appStore.currentRouteName !== 'CreatePost') {
            showShareContentModal(shareContent);
        }
    }, [shareContent]);

    // useEffect(() => {
    //     const hardwareBackPress = BackHandler.addEventListener('hardwareBackPress', () => {
    //         if (overlayRef.current) {
    //             overlayRef.current?.close();
    //             return true;
    //         }
    //         return false;
    //     });
    //     return () => {
    //         hardwareBackPress.remove();
    //     };
    // }, []);

    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        appStore.viewportHeight = height;
    }, []);

    return (
        <View style={{ flex: 1 }} onLayout={onLayout}>
            <RecommendVideos />
            <NavBarHeader
                navBarStyle={styles.navBarStyle}
                hasGoBackButton={false}
                isTransparent={true}
                hasSearchButton={true}
                statusbarProperties={{ barStyle: 'light-content' }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        width: '100%',
    },
});
