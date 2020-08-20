import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ViewStyle } from 'react-native';
import { Iconfont, KeyboardSpacer } from '@src/components';
import { observer } from '@src/store';

interface Props {
    style: ViewStyle;
    editable: boolean;
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
}

export default observer(({ style, onSend, editable, value, onChange }: Props) => {
    return (
        <View style={[styles.commentInput, style]}>
            <View style={styles.inputWrap}>
                {!editable ? (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>请把想说的娓娓道来...</Text>
                    </View>
                ) : (
                    <TextInput
                        editable={editable}
                        value={value}
                        onChange={onChange}
                        style={styles.textInput}
                        placeholder="请把想说的娓娓道来..."
                        underlineColorAndroid="transparent"
                        textAlignVertical="center"
                        placeholderTextColor={'#b2b2b2'}
                    />
                )}
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                <Image
                    style={styles.icPlane}
                    source={
                        value
                            ? require('@app/assets/images/icons/ic_plane_red.png')
                            : require('@app/assets/images/icons/ic_plane_gray.png')
                    }
                />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    commentInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputWrap: {
        flex: 1,
        marginRight: pixel(10),
        alignSelf: 'stretch',
    },
    textInput: {
        flex: 1,
        margin: 0,
        paddingTop: 0,
        padding: pixel(10),
        fontSize: font(15),
        color: '#2b2b2b',
    },
    placeholder: {
        flex: 1,
        padding: pixel(10),
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: font(15),
        color: '#fff',
    },
    sendButton: {
        alignSelf: 'stretch',
        width: pixel(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    icPlane: {
        width: pixel(30),
        height: pixel(30),
    },
});
