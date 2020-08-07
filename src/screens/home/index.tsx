import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { observer, appStore, userStore } from '@src/store';
import { VideoList, useClipboardLink, CollectionContent } from '@src/content';
import { useApolloClient } from '@apollo/react-hooks';
import { Overlay } from 'teaset';

export default observer(() => {
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
                        <CollectionContent client={appStore.client} onClose={onClose} {...params} />
                    </Overlay.PopView>,
                );
            }
        };
    }, []);

    useEffect(() => {
        if (userStore.login && shareContent) {
            showShareContentModal(shareContent);
        }
    }, [userStore, shareContent]);

    return (
        <View style={{ flex: 1 }}>
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
