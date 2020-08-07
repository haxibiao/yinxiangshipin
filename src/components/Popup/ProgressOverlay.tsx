import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { Overlay } from 'teaset';

type Props = {
    message?: string;
    type?: string;
};

class TransferProgress extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    state = {
        progress: 0,
    };

    setProgress = (val: number) => {
        // FIXME:这里能拿到进度值，但是设置到组件无效
        console.log('progress', val / 100);
        this.state = { progress: val / 100 };
    };

    render() {
        const { message, type } = this.props;

        return (
            <View style={styles.progress}>
                {type == 'progress' ? (
                    <Progress.Circle
                        size={46}
                        progress={this.state.progress}
                        color="#6E71F2"
                        unfilledColor={'#fff'}
                        borderColor="rgba(255,255,255,0)"
                        showsText
                    />
                ) : (
                    <ActivityIndicator color="#fff" size={'small'} />
                )}
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        );
    }
}

class ProgressOverlay {
    static show = (message?: string, type: 'progress' | 'waiting' = 'progress') => {
        const overlayView = (
            <Overlay.View modal animated style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TransferProgress ref={(ref: any) => (this.progressRef = ref)} message={message} type={type} />
            </Overlay.View>
        );
        this.overlayKey = Overlay.show(overlayView);
    };

    static progress = (progress: number) => {
        this.progressRef.setProgress(progress);
    };

    static hide = () => {
        if (this.overlayKey) {
            Overlay.hide(this.overlayKey);
            this.overlayKey = null;
        }
    };
}

export default ProgressOverlay;

const styles = StyleSheet.create({
    progress: {
        justifyContent: 'center',
        alignItems: 'center',
        width: pixel(120),
        minHeight: pixel(90),
        backgroundColor: 'rgba(32,30,51,0.7)',
        borderRadius: pixel(10),
    },
    message: {
        marginTop: pixel(6),
        fontSize: font(13),
        color: '#fff',
        textAlign: 'center',
    },
});
