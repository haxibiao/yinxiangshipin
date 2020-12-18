import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Iconfont from '../Iconfont';

export default function SearchBar() {
    return (
        <View style={styles.header}>
            {/* <TouchableOpacity activeOpacity={1} onPress={backButtonPress} style={styles.backButton}>
                <Iconfont name="zuojiantou" color={'#fff'} size={pixel(21)} />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <Image style={styles.searchImage} source={require('@app/assets/images/icons/ic_search_g.png')} />
                <View style={styles.inputWrap}>
                    <HxfTextInput
                        value={textValue}
                        placeholder={placeholder}
                        onFocus={onFocus}
                        onSubmitEditing={onSubmitEditing}
                        onChangeText={onChangeText}
                        TextColor={'#DDDDDD'}
                        style={styles.textInput}
                    />
                </View>
                <TouchableOpacity style={styles.closeButton} activeOpacity={0.8} onPress={resetTextValue}>
                    <View style={styles.closeLabel}>
                        <Image style={styles.iconClose} source={require('@app/assets/images/icon_close_white.png')} />
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={searchBtnOnPress} style={styles.searchButton} disabled={!(inputValueZIndex > 0)}>
                <Text style={[styles.searchButtonText, inputValueZIndex > 0 && { color: Theme.primaryColor }]}>
                    搜索
                </Text>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: pixel(Theme.statusBarHeight + 48),
        paddingTop: pixel(Theme.statusBarHeight + 5),
        paddingBottom: pixel(5),
        backgroundColor: '#161924',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: pixel(45),
        paddingLeft: pixel(15),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    searchButton: {
        paddingHorizontal: pixel(15),
        alignSelf: 'stretch',
        justifyContent: 'center',
        textAlign: 'center',
    },
    searchButtonText: {
        fontSize: font(14),
        color: '#98999E',
    },
    inputContainer: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: pixel(2),
        paddingVertical: pixel(5),
        paddingLeft: pixel(10),
        paddingRight: pixel(7),
        backgroundColor: '#3A3B44',
        borderRadius: pixel(5),
        // overflow: 'hidden',
    },
    inputWrap: {
        flex: 1,
        alignSelf: 'stretch',
    },
    textInput: {
        flex: 1,
        marginLeft: pixel(6),
        fontSize: font(13),
        color: '#fff',
    },
    closeButton: {
        paddingLeft: pixel(10),
        width: pixel(30),
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeLabel: {
        width: pixel(16),
        height: pixel(16),
        borderRadius: pixel(8),
        backgroundColor: '#98999E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconClose: {
        width: pixel(10),
        height: pixel(10),
    },
    searchImage: {
        height: pixel(16),
        width: pixel(16),
    },
});
