import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Iconfont, HxfTextInput } from '@src/components';
import { observer } from '@src/store';

const TagItem = (props) => {
    const { tag, selectTag, onClose } = props;
    const onPress = useCallback(() => {
        selectTag(tag?.name);
        onClose();
    }, [tag]);
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.tagItem}>
                <Iconfont name="biaoqian" size={font(15)} color="#fff" style={{ marginRight: pixel(4) }} />
                <View style={{ maxWidth: pixel(100) }}>
                    <Text style={styles.tagName} numberOfLines={1}>
                        {tag?.name}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default (props) => {
    const { selectTag, tagsData = [], onClose } = props;

    const renderTags = useMemo(() => {
        if (Array.isArray(tagsData) && tagsData.length > 0) {
            return tagsData
                .slice(0, 6)
                .map((item) => <TagItem key={item.id} tag={item} selectTag={selectTag} onClose={onClose} />);
        }
        return null;
    }, [selectTag, tagsData]);

    const [tagName, setTagName] = useState('');

    const inputTagName = useCallback((description) => {
        setTagName(description);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>添加标签</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Iconfont name="guanbi1" size={pixel(20)} color={Theme.defaultTextColor} />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                {!!renderTags && (
                    <View style={styles.tagsContainer}>
                        <Text style={styles.title}>常用标签</Text>
                        <ScrollView style={styles.tagListContainer}>
                            <View style={styles.tagList}>{renderTags}</View>
                        </ScrollView>
                    </View>
                )}
                <View style={styles.formContainer}>
                    <HxfTextInput
                        style={styles.tagNameInput}
                        placeholderTextColor="#e4e4e4"
                        onChangeText={inputTagName}
                        multiline={true}
                        maxLength={20}
                        textAlignVertical="top"
                        placeholder="输入标签(2~20字)"
                    />
                    <TouchableOpacity
                        disabled={tagName.length < 2}
                        style={[styles.publishButton, tagName.length < 2 && styles.disabledButton]}
                        onPress={() => {
                            selectTag(tagName);
                            onClose();
                        }}>
                        <Text style={[styles.publishText, tagName.length < 2 && styles.disabledPublishText]}>添加</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const CONTENT_WIDTH = percent(86) > pixel(300) ? pixel(300) : percent(86);

const styles = StyleSheet.create({
    container: {
        width: CONTENT_WIDTH,
        minHeight: CONTENT_WIDTH,
        borderRadius: pixel(6),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    header: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    headerText: {
        color: '#2b2b2b',
        fontSize: font(15),
        fontWeight: 'bold',
    },
    closeBtn: {
        alignItems: 'center',
        bottom: 0,
        height: pixel(44),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        width: pixel(44),
    },
    body: {
        justifyContent: 'center',
        paddingHorizontal: pixel(15),
        paddingTop: pixel(15),
        paddingBottom: pixel(20),
    },
    tagsContainer: {
        marginBottom: pixel(20),
    },
    title: {
        color: '#2b2b2b',
        fontSize: font(14),
        fontWeight: 'bold',
        marginVertical: pixel(10),
    },
    tagListContainer: {
        height: pixel(100),
    },
    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pixel(32),
        paddingHorizontal: pixel(6),
        borderRadius: pixel(3),
        marginRight: pixel(10),
        marginBottom: pixel(12),
        backgroundColor: '#0584FF',
    },
    tagName: {
        color: '#fff',
        fontSize: font(12),
    },
    formContainer: {},
    tagNameInput: {
        height: pixel(60),
        paddingTop: pixel(8),
        padding: pixel(8),
        marginBottom: pixel(15),
        lineHeight: pixel(20),
        borderWidth: pixel(1),
        borderRadius: pixel(5),
        borderColor: '#f0f0f0',
    },
    publishButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#FF5E7D',
        borderRadius: pixel(15),
        height: pixel(30),
        justifyContent: 'center',
        paddingHorizontal: pixel(14),
    },
    disabledButton: {
        backgroundColor: '#f0f0f0',
    },
    publishText: {
        color: '#fff',
        fontSize: font(15),
        textAlign: 'center',
    },
});
