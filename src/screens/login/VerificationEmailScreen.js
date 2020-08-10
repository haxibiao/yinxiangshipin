import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Screen, Button } from '@src/components';

class VerificationEmailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
        };
    }

    render() {
        const { navigation } = this.props;
        return (
            <Screen>
                <View style={styles.container}>
                    <View style={styles.textWrap}>
                        <TextInput
                            textAlignVertical="center"
                            underlineColorAndroid="transparent"
                            placeholder="请输入注册时的邮箱地址"
                            placeholderText={Theme.tintFontColor}
                            selectionColor={Theme.themeColor}
                            style={styles.textInput}
                            onChangeText={email => {
                                this.setState({ email });
                            }}
                        />
                    </View>
                    <View style={{ margin: 20, height: 48 }}>
                        <Button
                            name="发送验证码"
                            handler={() => {
                                navigation.navigate('找回密码');
                            }}
                            disabled={this.state.email ? false : true}
                        />
                    </View>
                </View>
            </Screen>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textWrap: {
        marginTop: 20,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: Theme.lightBorderColor,
        borderBottomWidth: 1,
        borderBottomColor: Theme.lightBorderColor,
    },
    textInput: {
        fontSize: 16,
        color: Theme.primaryFontColor,
        padding: 0,
        height: 50,
    },
});

export default VerificationEmailScreen;
