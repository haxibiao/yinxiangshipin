import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { observer, appStore, userStore } from '@src/store';
import { VideoList, useClipboardLink, VideoCaptureData } from '@src/content';
import { useApolloClient } from '@apollo/react-hooks';
import { useBeginner } from '@src/common';
import { NavBarHeader } from '@src/components';
import { Overlay } from 'teaset';

export default observer(() => {
    useBeginner();

    const [shareContent] = useClipboardLink();
    const isShow = useRef(false);

    const showShareContentModal = useMemo(() => {
        var popViewRef;
        function onClose() {
            popViewRef?.close();
            isShow.current = false;
        }
        return (params) => {
            if (!isShow.current) {
                isShow.current = true;
                Overlay.show(
                    <Overlay.PopView
                        style={styles.overlay}
                        ref={(ref) => (popViewRef = ref)}
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
    }, [userStore, shareContent]);

    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        appStore.viewportHeight = height;
    }, []);

    return (
        <View style={{ flex: 1 }} onLayout={onLayout}>
            <VideoList />
            <NavBarHeader
                navBarStyle={styles.navBarStyle}
                hasGoBackButton={false}
                isTransparent={true}
                hasSearchButton={true}
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
