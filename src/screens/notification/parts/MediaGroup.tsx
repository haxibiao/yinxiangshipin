import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TextContainer, SubComment, UserGroup } from '@src/components';

const MediaGroup = (props: any) => {
    let { navigation, user, rightComponent, description, comment, message, meta } = props;

    return (
        <View style={styles.notificationItem}>
            <View style={styles.userMedia}>
                <UserGroup
                    navigation={navigation}
                    user={user}
                    customStyle={{ avatar: 40 }}
                    rightButton={rightComponent ? rightComponent : null}
                />
            </View>
            <View style={styles.notificationDescribe}>
                <Text style={styles.notificationDescribeText}>{description ? description : null}</Text>
            </View>
            {comment && comment.body ? (
                <TouchableOpacity
                    style={styles.notificationContent}
                    onPress={() => navigation.navigate('评论详情', comment.param)}>
                    <TextContainer>
                        <SubComment numberOfLines={3} style={styles.tintText} body={comment.body} />
                    </TextContainer>
                </TouchableOpacity>
            ) : null}
            {message && message.body ? (
                <TouchableOpacity style={styles.notificationContent} onPress={() => message.skipScreen()}>
                    <TextContainer>{message.body}</TextContainer>
                </TouchableOpacity>
            ) : null}
            <View>
                {meta && (
                    <Text
                        style={{
                            fontSize: font(13),
                            lineHeight: 18,
                            color: Theme.tintFontColor,
                        }}>
                        {meta}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    notificationItem: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Theme.lightBorderColor,
    },
    userMedia: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    customButton: {
        height: 30,
        width: 55,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Theme.tintBorderColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationDescribe: {
        marginVertical: 20,
    },
    notificationDescribeText: {
        fontSize: font(16),
        lineHeight: 24,
        color: Theme.primaryFontColor,
    },
    notificationContent: {
        marginBottom: 20,
    },
    tintText: {
        fontSize: font(15),
        color: Theme.primaryFontColor,
    },
});

export default MediaGroup;
