import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput } from 'react-native';
import { PageContainer } from '@src/components';
// import { Emails } from 'src/utils/RegularExpression';
// import { Toast } from 'teaset';

const EmailModify = props => {
    const emails = props.route.params?.email;
    const [valueData, setValueData] = useState({ nowEmails: '', newEmails: '' });

    const changeEmails = useCallback(value => {
        setValueData(data => {
            return {
                ...data,
                newEmails: value,
            };
        });
    }, []);
    const disableSubmit = useMemo(() => {
        let count = 0;
        const values = Object.values(valueData);
        values.forEach(item => {
            if (item) {
                count++;
            }
        });
        if (count === values.length) {
            return false;
        }
        return true;
    }, []);
    // function checkedEmails() {
    //     if (!Emails.test(neweMails)) {
    //         Toast.fail('邮箱格式不正确');
    //     } else if (!neweMails) {
    //         Toast.fail('请输入验证码');
    //     }
    //     return true;
    // }
    return (
        <PageContainer title="修改邮箱" white>
            <View style={styles.container}>
                <View style={styles.comment}>
                    <Text style={styles.textFont}>当前邮箱:</Text>
                    <TextInput style={styles.textInput} editable={false}>
                        {emails}
                    </TextInput>
                </View>

                <View style={styles.comment}>
                    <Text style={styles.textFont}>新邮箱:</Text>
                    <TextInput
                        placeholder="输入邮箱"
                        style={styles.textInput}
                        value={valueData.newEmails}
                        onChangeText={changeEmails}
                        textAlign="right"
                    />
                </View>

                <TouchableOpacity
                    onPress={() => Alert.alert('修改成功')}
                    disabled={!disableSubmit}
                    style={[styles.btModify, disableSubmit && { backgroundColor: 'rgba(23, 171, 255, 0.3)' }]}>
                    <Text style={styles.btText}>修改邮箱</Text>
                </TouchableOpacity>
            </View>
        </PageContainer>
    );
};
const styles = StyleSheet.create({
    btModify: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(23, 171, 255, 1)',
        borderRadius: pixel(20),
        height: pixel(40),
        justifyContent: 'center',
        marginTop: pixel(30),
        width: pixel(230),
    },
    btText: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: font(16),
    },
    comment: {
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: pixel(0.5),
        flexDirection: 'row',
        marginTop: pixel(20),
    },
    container: {
        marginHorizontal: pixel(15),
    },
    textFont: {
        color: 'rgba(0, 0, 0, 1)',
        fontSize: font(16),
        marginRight: pixel(15),
    },
    textInput: {
        marginLeft: pixel(10),
        padding: pixel(0),
    },
    title: {
        color: 'rgba(0, 0, 0, 1)',
        fontSize: font(18),
        fontWeight: 'bold',
    },
});
export default EmailModify;
