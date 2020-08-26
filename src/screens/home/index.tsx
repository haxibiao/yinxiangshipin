import React, { useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { observer, appStore, userStore } from '@src/store';
import { VideoList, useClipboardLink, VideoCaptureData } from '@src/content';
import { useApolloClient } from '@apollo/react-hooks';
import { useBeginner } from '@src/common';
import { Overlay } from 'teaset';

export default observer(() => {
    useBeginner();

    const [shareContent] = useClipboardLink();

    const showShareContentModal = useMemo(() => {
        var isShow = false;
        var popViewRef;
        function onClose() {
            popViewRef.close();
            isShow = false;
        }
        return (params) => {
            if (!isShow) {
                isShow = true;
                Overlay.show(
                    <Overlay.PopView style={styles.overlay} ref={(ref) => (popViewRef = ref)}>
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
        </View>
    );
});

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
