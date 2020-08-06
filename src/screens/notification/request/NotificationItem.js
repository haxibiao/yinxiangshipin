import React, { Component } from 'react';
import { goContentScreen, Colors } from '@src/common';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '@src/components';
import MediaGroup from '../parts/MediaGroup';

import { Mutation, GQL } from '@src/apollo';

class ContributeStatus extends Component {
    _statusChange = () => {
        let { article } = this.props;
        switch (article.pivot_status) {
            case '待审核':
                return (
                    <Mutation mutation={GQL.approveArticleMutation}>
                        {approveArticle => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.handleButton, { marginRight: 10 }]}>
                                        <Button
                                            outline
                                            name="接受"
                                            theme="rgba(66,192,46,0.9)"
                                            fontSize={15}
                                            handler={() => {
                                                // this.setState({ status: "已收录" });
                                                approveArticle({
                                                    variables: {
                                                        article_id: article.id,
                                                        category_id: article.pivot_category.id,
                                                        is_reject: false,
                                                    },
                                                });
                                            }}
                                        />
                                    </View>
                                    <View style={styles.handleButton}>
                                        <Button
                                            outline
                                            name="拒绝"
                                            fontSize={15}
                                            handler={() => {
                                                // this.setState({ status: "已拒绝" });
                                                approveArticle({
                                                    variables: {
                                                        article_id: article.id,
                                                        category_id: article.pivot_category.id,
                                                        is_reject: true,
                                                    },
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        }}
                    </Mutation>
                );
                break;
            case '已收录':
                return (
                    <View>
                        <Text style={styles.statusText}>已通过</Text>
                    </View>
                );
                break;
            case '已拒绝':
                return (
                    <View>
                        <Text style={styles.statusText}>已拒绝</Text>
                    </View>
                );
                break;
            default:
                return (
                    <View>
                        <Text style={styles.statusText}>作者撤回了投稿</Text>
                    </View>
                );
                break;
        }
    };

    render() {
        return <View>{this._statusChange()}</View>;
    }
}

class NotificationItem extends Component {
    render() {
        let { article, navigation } = this.props;
        return (
            <MediaGroup
                navigation={navigation}
                user={article.user}
                rightComponent={<ContributeStatus article={article} />}
                description={
                    <Text style={{ lineHeight: 24 }}>
                        向你的专题
                        <Text
                            style={styles.linkText}
                            onPress={() =>
                                navigation.navigate('专题详情', {
                                    category: article.pivot_category,
                                })
                            }>
                            {' 《' + article.pivot_category.name + '》 '}
                        </Text>
                        投稿
                    </Text>
                }
                message={{
                    body: <Text style={{ fontSize: font(16), color: Colors.linkColor }}>《{article.title}》</Text>,
                    skipScreen: () => goContentScreen(navigation, article),
                }}
                article={article}
                meta={article.pivot_time_ago}
            />
        );
    }
}

const styles = StyleSheet.create({
    handleButton: {
        width: 55,
        height: 30,
    },
    statusText: {
        fontSize: font(17),
        color: Colors.tintFontColor,
    },
    linkText: {
        lineHeight: 24,
        color: Colors.linkColor,
    },
});

export default NotificationItem;
