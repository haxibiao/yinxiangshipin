import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, Button, Alert } from 'react-native';
import { PageContainer } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
const Newuser = props => {
    const navigation = useNavigation();
    return (
        <ScrollView>
            <View style={styles.Topshape}>
                <Image
                    source={require('@app/assets/images/newuser.jpg')}
                    style={{ width: pixel(400), height: pixel(1400) }}
                />
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    Topshape: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
export default Newuser;
