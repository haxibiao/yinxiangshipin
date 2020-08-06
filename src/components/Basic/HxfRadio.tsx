import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Iconfont from '../Iconfont';

interface Props {
    mode?: 'button' | 'switch';
    style?: any;
    textStyle?: any;
    initialState?: boolean;
    onChange: () => any;
    radioText: string;
}

const HxfRadio = (props: Props) => {
    const [state, setState] = useState(props.initialState);
    const initial = useRef(true);
    let title;
    useEffect(() => {
        if (!initial.current) {
            props.onChange(state);
        }
        initial.current = false;
    }, [props, state]);
    if (React.isValidElement(props.radioText)) {
        title = props.radioText;
    } else {
        title = <Text style={[styles.radioText, props.textStyle]}>{props.radioText}</Text>;
    }
    if (props.mode === 'switch') {
        const trackImage = state ? require('@app/assets/images/bg.png') : require('@app/assets/images/bf.png');
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.switchModeWrap, props.style]}
                onPress={() => {
                    setState(!state);
                }}>
                {title}
                <Image source={trackImage} style={styles.switchImage} />
            </TouchableOpacity>
        );
    }
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={[styles.buttonModeWrap, props.style]}
            onPress={() => {
                setState(!state);
            }}>
            <Iconfont
                name={state ? 'radio-check' : 'radio-uncheck'}
                color={state ? Theme.primaryColor : '#d4d4d4'}
                size={font(20)}
                style={{ marginRight: pixel(8) }}
            />
            {title}
        </TouchableOpacity>
    );
};

HxfRadio.defaultProps = {
    mode: 'button',
};

const styles = StyleSheet.create({
    buttonModeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioText: {
        fontSize: font(15),
        color: Theme.defaultTextColor,
    },
    switchImage: {
        width: pixel(40),
        height: pixel(25),
        resizeMode: 'cover',
    },
    switchModeWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default HxfRadio;
