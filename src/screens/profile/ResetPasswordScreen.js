import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { Colors, navigate } from '@src/common';
import { Screen, SettingItem } from '@src/components';

class ResetPasswordScreen extends Component {
    render() {
        return (
            <Screen>
                <View style={styles.container}>
                    <View style={styles.hint}>
                        <Text style={{ fontSize: font(15), color: Colors.themeColor }}>
                            为了你的账户安全,请选择以下方式进行身份验证
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigate('密码验证')}>
                        <SettingItem itemName="使用当前密码验证" />
                    </TouchableOpacity>
                    {
                        // <TouchableOpacity onPress={() => navigation.navigate("密码验证")}>
                        // 	<SettingItem itemName="使用手机号验证" explain="158****1314" />
                        //</TouchableOpacity>
                        //<TouchableOpacity onPress={() => navigation.navigate("密码验证")}>
                        //	<SettingItem itemName="使用邮箱验证" />
                        //</TouchableOpacity>
                    }
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.skinColor,
    },
    hint: {
        paddingHorizontal: 15,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightBorderColor,
    },
});

export default ResetPasswordScreen;
