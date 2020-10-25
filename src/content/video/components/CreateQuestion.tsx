import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HxfTextInput } from '@src/components';

export default function CreateQuestion() {
    const client = useApolloClient();

    const createQuestion = useCallback(async () => {}, []);

    const onSubmit = useCallback(() => {}, []);

    return (
        <View style={styles.container}>
            <View style={styles.borderItem}>
                <Text style={styles.itemTypeText}>题目题干</Text>
            </View>
            <HxfTextInput
                style={styles.questionInput}
                value={description}
                onChangeText={inputDescription}
                multiline
                maxLength={300}
                textAlignVertical="top"
                placeholder="填写题干，不少于8个字......"
            />
            <View style={[styles.borderItem, { justifyContent: 'flex-start', marginBottom: 0 }]}>
                <Text style={styles.itemTypeText}>答案选项</Text>
            </View>
            <HxfTextInput
                style={styles.optionInput}
                value={optionValue}
                onChangeText={inputOptionValue}
                placeholder="填写答案选项......"
                maxLength={100}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    borderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: pixel(10),
        paddingLeft: pixel(6),
        borderLeftWidth: pixel(3),
        borderLeftColor: Theme.primaryColor,
    },
    tips: {
        fontSize: pixel(12),
        color: '#969696',
    },
    questionInput: {
        height: pixel(120),
        padding: pixel(10),
        borderWidth: pixel(1),
        borderRadius: pixel(5),
        borderColor: '#f0f0f0',
        fontSize: pixel(14),
        lineHeight: pixel(20),
        backgroundColor: '#fff',
    },
    optionInput: {
        flex: 1,
        height: pixel(50),
        borderColor: '#f0f0f0',
        fontSize: pixel(14),
        lineHeight: pixel(20),
    },
});
