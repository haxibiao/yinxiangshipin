import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { PageContainer, Avatar, PopOverlay } from '@src/components';
import { userStore, appStore } from '@src/store';
import { GQL } from '@src/apollo';

const PhoneVerification = props => {
    const { navigation } = props;
    return (
        <PageContainer title="手机验证">
            <View style={styles.container}>
                <View style={styles.validationBox}>
                    <View style={styles.columnItem}>
                        <Text style={styles.textStyle}>手机号</Text>
                        <Text style={styles.textStyle}>{userStore.me.phone}</Text>
                        <TouchableOpacity style={styles.obtain}>
                            <Text style={{ fontSize: font(16), padding: 6 }}>获取验证码</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.anotherColumnItem}>
                        <Text style={styles.textStyle}>验证码</Text>
                        <TextInput style={{ fontSize: font(20), marginLeft: 20 }} placeholder="请输入验证码" />
                    </View>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ fontSize: font(20) }}>确认</Text>
                </TouchableOpacity>
            </View>
        </PageContainer>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F4F4F4',
        flex: 1,
        alignItems: 'center',
    },
    validationBox: {
        backgroundColor: '#FFF',
        width: Device.WIDTH,
        paddingHorizontal: 5,
    },
    columnItem: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        paddingVertical: 5,
        marginVertical: 5,
        marginHorizontal: 20,
    },
    anotherColumnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        marginVertical: 5,
        marginHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6',
    },
    edgeWidth: {
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6',
    },
    textStyle: {
        fontSize: font(20),
        marginRight: 15,
    },
    obtain: {
        backgroundColor: '#FBFBFB',
        borderWidth: 1,
        borderColor: '#E6E6E6',
    },
    inputBox: {
        height: pixel(30),
        width: pixel(55),
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6E6',
    },
    button: {
        flexDirection: 'row',
        margin: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        height: pixel(35),
        width: pixel(280),
        backgroundColor: '#51B8FF',
    },
});

export default PhoneVerification;
