import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { MarqueeHorizontal } from 'react-native-marquee-ab';

const defaultWidth = Dimensions.get('window').width / 3;
const defaultHeight = pixel(18);

export default function MarqueeText({ width = defaultWidth, height = defaultHeight, textList, duration = 10000 }) {
    return (
        <MarqueeHorizontal
            width={width}
            height={height}
            textList={textList}
            duration={duration}
            direction={'left'}
            bgContainerStyle={{ backgroundColor: 'transparent' }}
            textStyle={{ fontSize: font(13), color: '#ffffffee' }}
        />
    );
}

const styles = StyleSheet.create({});
