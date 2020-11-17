import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class SettingItem extends Component {
    render() {
        const {
            itemName = '',
            explain = null,
            rightContent = '',
            leftComponent = null,
            rightComponent = null,
            endItem = false,
            horizontal = false,
            column = false,
            itemNameStyle = '',
        } = this.props;
        return (
            <View
                style={[
                    styles.settingItem,
                    endItem && { borderBottomColor: 'transparent' },
                    horizontal && { justifyContent: 'flex-start' },
                    column && { flexDirection: 'column', alignItems: 'flex-start', height: 80, marginTop: 15 },
                ]}>
                {leftComponent ? (
                    leftComponent
                ) : (
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={itemNameStyle ? itemNameStyle : styles.itemName}>
                            {itemName}
                        </Text>
                        {explain && (
                            <Text numberOfLines={1} style={styles.explain}>
                                {explain}
                            </Text>
                        )}
                    </View>
                )}
                {rightComponent ? (
                    rightComponent
                ) : (
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={[styles.rightContent, column && { paddingLeft: 0 }]}>
                            {rightContent}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    explain: {
        fontSize: font(12),
        color: Theme.tintFontColor,
        marginTop: 6,
    },
    itemName: {
        fontSize: font(16),
        color: Theme.defaultTextColor,
    },
    rightContent: {
        fontSize: font(15),
        color: Theme.subTextColor,
        textAlign: 'right',
        paddingLeft: 15,
    },
    settingItem: {
        minHeight: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 15,
    },
});

export default SettingItem;
