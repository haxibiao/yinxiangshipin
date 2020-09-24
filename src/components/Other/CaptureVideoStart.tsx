import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Theme, PxFit, percent } from 'utils';
import { app } from 'store';
import { SafeText } from '@src/components';
// interface Props {
//     earnings: number;
// }

const CaptureVideoStart = (props) => {
    return (
        <ImageBackground style={styles.overlayImage} source={require('@app/assets/images/participation_profit.png')}>
            <View style={styles.overlayContent}>
                <View style={styles.title}>
                    <Text style={styles.text2}>从您的粘贴板获取视频分享链接</Text>
                    <SafeText style={styles.text1}>正在分享视频</SafeText>
                </View>
            </View>
        </ImageBackground>
    );
};

const OVERLAY_WIDTH = percent(76);
const OVERLAY_HEIGHT = (OVERLAY_WIDTH * 600) / 480;

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: OVERLAY_WIDTH * 0.7,
        height: OVERLAY_WIDTH * 0.15,
        justifyContent: 'center',
        width: OVERLAY_WIDTH * 0.7,
    },
    buttonText: {
        color: Theme.secondaryColor,
        fontSize: PxFit(16),
    },
    overlayContent: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    overlayImage: {
        height: OVERLAY_HEIGHT,
        paddingTop: (OVERLAY_HEIGHT * 260) / 600,
        width: OVERLAY_WIDTH,
    },
    text1: {
        color: '#fff',
        fontSize: PxFit(20),
        fontWeight: 'bold',
    },
    text2: {
        color: '#fff',
        fontSize: PxFit(15),
        marginTop: PxFit(15),
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: PxFit(30),
    },
});

export default CaptureVideoStart;
