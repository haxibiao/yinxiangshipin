import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';

export default (props) => {
    const { selectTag, onClose } = props;

    const [tagName, setTagName] = useState('');

    const inputTagName = useCallback((description) => {
        setTagName(description);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>添加标签</Text>
            </View>
            <View style={styles.body}>
                <TextInput
                    style={styles.tagNameInput}
                    onChangeText={inputTagName}
                    maxLength={18}
                    placeholder="输入标签(2~18字)"
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#b2b2b2"
                />
                <TouchableOpacity
                    disabled={tagName.length < 2}
                    style={[styles.addButton, tagName.length < 2 && { backgroundColor: '#b2b2b2' }]}
                    onPress={() => {
                        selectTag({ name: tagName });
                        onClose();
                    }}>
                    <Text style={styles.btnText}>添加</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const CONTENT_WIDTH = percent(86) > pixel(300) ? pixel(300) : percent(86);

const styles = StyleSheet.create({
    container: {
        width: CONTENT_WIDTH,
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
    title: {
        color: '#2b2b2b',
        fontSize: font(15),
        fontWeight: 'bold',
    },
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: pixel(10),
        paddingVertical: pixel(15),
    },
    tagNameInput: {
        flex: 1,
        marginRight: pixel(15),
        padding: pixel(8),
        height: pixel(40),
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
        borderWidth: pixel(1),
        borderRadius: pixel(5),
        borderColor: '#f0f0f0',
    },
    addButton: {
        width: pixel(58),
        height: pixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF5E7D',
        borderRadius: pixel(15),
    },
    btnText: {
        color: '#fff',
        fontSize: font(15),
    },
});
