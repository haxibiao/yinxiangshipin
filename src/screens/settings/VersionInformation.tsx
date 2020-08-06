import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { PageContainer } from '@src/components';

// 其他
interface Props {
    navigation: any;
}
const VersionInformation = (props: Props) => {
    const { navigation } = props;
    return (
        <PageContainer title="其他" white>
            <View style={styles.comment}>
                <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('UserProtocol')}>
                    <Text style={styles.textWord}>用户协议</Text>
                    <Image source={require('@app/assets/images/more_right.png')} style={styles.jTouImage} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('PrivacyPolicy')}>
                    <Text style={styles.textWord}>隐私政策</Text>
                    <Image source={require('@app/assets/images/more_right.png')} style={styles.jTouImage} />
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('UseInstructions')}>
                    <Text style={styles.textWord}>健康分使用说明</Text>
                    <Image source={require('@app/assets/images/more_right.png')} style={styles.jTouImage} />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('CommonQuestion')}>
                    <Text style={styles.textWord}>常见问题</Text>
                    <Image source={require('@app/assets/images/more_right.png')} style={styles.jTouImage} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchStyle} onPress={() => navigation.navigate('AboutUs')}>
                    <Text style={styles.textWord}>关于</Text>
                    <Image source={require('@app/assets/images/more_right.png')} style={styles.jTouImage} />
                </TouchableOpacity>
            </View>
        </PageContainer>
    );
};
const styles = StyleSheet.create({
    comment: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: pixel(15),
    },
    jTouImage: {
        height: pixel(22),
        width: pixel(22),
    },
    textWord: {
        color: 'rgba(0, 0, 0, 1)',
        fontSize: font(16),
    },
    touchStyle: {
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: pixel(0.3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: pixel(15),
        paddingVertical: pixel(8),
    },
});
export default VersionInformation;
