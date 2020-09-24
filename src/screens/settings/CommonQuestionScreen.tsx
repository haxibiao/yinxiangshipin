import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { PageContainer, Row, SafeText } from '@src/components';

class CommonQuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [
                {
                    question: '如何发布视频问答？有什么奖励？',
                    answer:
                        `1.为了提高视频学习的趣味性，平台新增了视频问答的发布类型，您可以在提问页描述清楚您的问题，并插入相关视频内容即可发布视频问答,发布优质的视频问答将奖励一定${Config.goldAlias}。` +
                        '\n' +
                        '2.优质问答需保持真实客观，用语规范；凡带有其他软件水印的视频将不会被推荐，建议上传无水印视频；内容不得涉黄、政治引导、煽动谣言、传播垃圾广告。',
                },
                {
                    question: '如何去第三方平台收藏视频',
                    answer: `打开第三方App，点击分享按钮然后复制链接，再回到${Config.AppName}中，稍等几秒然后就可以点击收藏视频了`,
                },
                {
                    question: '绑定支付宝账户是否会有风险？',
                    answer:
                        '绑定支付宝账户只是为了方便给您提现哦，除了您的支付宝账户，我们不会获取您支付宝的任何信息，完全不用担心会有风险哦。',
                },
            ],
        };
    }

    renderQuestions = () => {
        return this.state.questions.map((elem, index) => {
            return (
                <View style={styles.issueItem} key={index}>
                    <View style={styles.question}>
                        <Image style={styles.avatar} source={require('@app/assets/images/avatar_man.png')} />
                        <View style={styles.content}>
                            <View style={[styles.inner, styles.right]}>
                                <SafeText style={styles.questionText}>{elem.question}</SafeText>
                            </View>
                        </View>
                    </View>
                    <View style={styles.answer}>
                        <View style={styles.content}>
                            <View style={[styles.inner, styles.left]}>
                                <Text style={styles.answerText}>{elem.answer}</Text>
                            </View>
                        </View>
                        <Image style={styles.avatar} source={require('@app/assets/images/avatar_women.png')} />
                    </View>
                </View>
            );
        });
    };

    render() {
        const { navigation } = this.props;
        return (
            <PageContainer title="常见问题" white>
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    bounces={false}>
                    <View>{this.renderQuestions()}</View>
                    <View style={styles.footer}>
                        <Row>
                            <Text style={{ fontSize: font(13), color: Theme.subTextColor }}>没有解决？</Text>
                            <TouchableOpacity
                                navigation={navigation}
                                authenticated
                                onPress={() => navigation.navigate('Feedback')}>
                                <Text style={{ fontSize: font(13), color: Theme.linkColor }}>去反馈</Text>
                            </TouchableOpacity>
                        </Row>
                    </View>
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    answer: {
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: pixel(Theme.itemSpace),
    },
    answerText: {
        color: Theme.defaultTextColor,
        fontSize: font(15),
        lineHeight: font(18),
    },
    avatar: {
        height: pixel(42),
        width: pixel(42),
    },
    container: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
        paddingTop: pixel(Theme.itemSpace * 2),
    },
    content: {
        flex: 1,
    },
    footer: {
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: pixel(Theme.itemSpace),
    },
    inner: {
        borderRadius: pixel(5),
        padding: pixel(10),
    },
    issueItem: {
        marginBottom: pixel(Theme.itemSpace * 2),
        paddingHorizontal: pixel(Theme.itemSpace),
    },
    left: {
        backgroundColor: '#FFEBEE',
        marginRight: pixel(10),
    },
    question: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    questionText: {
        color: Theme.defaultTextColor,
        fontSize: font(15),
        fontWeight: 'bold',
        lineHeight: font(20),
    },
    right: {
        backgroundColor: '#E1F4FE',
        marginLeft: pixel(10),
    },
});

export default CommonQuestionScreen;
