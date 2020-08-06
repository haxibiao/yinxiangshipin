import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import { Screen, Button } from '@src/components';
import { Colors } from '@src/common';

import store from '@src/store';

import { Mutation, GQL } from '@src/apollo';

class PasswordVerificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldpassword: '',
            password: '',
            againpassword: '',
            disabled: true,
        };
    }

    render() {
        let { oldpassword, password, disabled, againpassword } = this.state;
        let { navigation } = this.props;
        return (
            <Screen>
                <View style={styles.container}>
                    <View style={{ height: 10, backgroundColor: Colors.lightGray }} />
                    <View style={styles.textWrap}>
                        <TextInput
                            textAlignVertical="center"
                            underlineColorAndroid="transparent"
                            placeholder="请输入当前密码"
                            placeholderText={Colors.tintFontColor}
                            selectionColor={Colors.themeColor}
                            style={styles.textInput}
                            onChangeText={oldpassword => {
                                this.setState({ oldpassword });
                            }}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={styles.textWrap}>
                        <TextInput
                            textAlignVertical="center"
                            underlineColorAndroid="transparent"
                            placeholder="请输入新密码"
                            placeholderText={Colors.tintFontColor}
                            selectionColor={Colors.themeColor}
                            style={styles.textInput}
                            onChangeText={password => {
                                this.setState({ password });
                            }}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={styles.textWrap}>
                        <TextInput
                            textAlignVertical="center"
                            underlineColorAndroid="transparent"
                            placeholder="请再次输入新密码"
                            placeholderText={Colors.tintFontColor}
                            selectionColor={Colors.themeColor}
                            style={styles.textInput}
                            onChangeText={againpassword => this.setState({ againpassword })}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={{ margin: 15, height: 48 }}>
                        <Mutation mutation={GQL.updateUserPasswordMutation}>
                            {updateUserPassword => {
                                return (
                                    <Button
                                        name="完成"
                                        handler={() => {
                                            if (password == againpassword) {
                                                updateUserPassword({
                                                    variables: {
                                                        oldpassword,
                                                        password,
                                                    },
                                                });
                                            } else {
                                                Toast.show({ content: '两次输入的密码不一致' });
                                                return null;
                                            }
                                            // this.props.dispatch(actions.updatePassword(password));
                                            navigation.goBack();
                                        }}
                                        disabled={oldpassword && password && againpassword ? false : true}
                                    />
                                );
                            }}
                        </Mutation>
                    </View>
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
    textWrap: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightBorderColor,
    },
    textInput: {
        fontSize: font(16),
        color: Colors.primaryFontColor,
        padding: 0,
        height: 50,
    },
});

export default PasswordVerificationScreen;
