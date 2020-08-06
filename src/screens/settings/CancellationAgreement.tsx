import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { PageContainer, Avatar } from '@src/components';

const CancellationAgreement = () => {
    return (
        <PageContainer title="注销协议" white>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>用户注销协议</Text>
                    <View style={styles.body}>
                        <Text style={styles.foreword}> 在您注销您的账户之前，请充分阅读、理解并同意下列事项：</Text>

                        <Text style={styles.foreword}>
                            在此善意地提醒您，注销成功后，我们将删除您的个人信息，使其保持不可被检索、访问的状态，或对其进行匿名化处理。
                        </Text>

                        <Text style={styles.textStyle}>1.如果您仍执意注销账户，您需同时满足以下条件：</Text>
                        <Text style={styles.subtitle}> （1）您知晓并理解该协议；</Text>
                        <Text style={styles.subtitle}> （2）账户内无未完成的提现申请；</Text>
                        <Text style={styles.subtitle}> （3）账户无任何纠纷，包括投诉举报或被投诉举报；</Text>

                        <Text style={styles.textStyle}>
                            2.在点墨阁账户注销期间，如果您的点墨阁账户涉及争议纠纷，包括但不限于投诉、举报、国家有权机关调查等，点墨阁有权自行终止点墨阁评账户的注销而无需另行得到您的同意。
                        </Text>

                        <Text style={styles.textStyle}>
                            {`3.账户一旦被注销将不可恢复，请您仔细检查${Config.goldAlias}、余额等，您将无法再使用此账户，也将无法找回您点墨阁上的个人资料、历史信息、${Config.goldAlias}和余额等（即使您使用相同的手机号码再次注册并使用点墨阁）。`}
                        </Text>

                        <Text style={styles.textStyle}>
                            4.注销本点墨阁账户并不代表本点墨阁账户注销前的账户行为和相关责任得到豁免或减轻。
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </PageContainer>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F4F4F4',
        flex: 1,
        alignItems: 'center',
    },
    title: {
        marginTop: 20,
        fontSize: font(27),
        color: '#000000',
    },
    body: {
        margin: 15,
    },
    foreword: {
        fontSize: font(17),
        margin: 5,
    },
    textStyle: {
        fontSize: font(19),
        paddingVertical: 10,
    },
    subtitle: {
        paddingVertical: 8,
        fontSize: font(16),
    },
});

export default CancellationAgreement;
