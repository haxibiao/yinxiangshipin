import React, { useContext, createContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, ViewStyle } from 'react-native';

const QuestionContext = createContext({
    selectedValue: '',
    submitValue: (value) => {
        throw new Error('Abstract methods need to be overridden');
    },
});

function calculateStatus({ selectedValue, value, answer }) {
    let status, labelStyle, contentStyle;
    if (selectedValue === value) {
        if (answer.includes(value)) {
            status = 'correct';
        } else {
            status = 'error';
        }
    } else if (selectedValue && answer.includes(value)) {
        status = 'missing';
    }
    switch (status) {
        case 'correct':
            labelStyle = { backgroundColor: '#12E2BB' };
            contentStyle = { color: '#fff' };
            break;
        case 'missing':
            labelStyle = { backgroundColor: '#1CACF9' };
            contentStyle = { color: '#fff' };
            break;
        case 'error':
            labelStyle = { backgroundColor: '#FF5E7D' };
            contentStyle = { color: '#fff' };
            break;
        default:
            labelStyle = { backgroundColor: '#fff' };
            contentStyle = { color: '#212121' };
            break;
    }
    return {
        labelStyle,
        contentStyle,
    };
}

function AnswerCountDown() {
    return (
        <View style={styles.selectionItem}>
            <Text style={[styles.optionText, contentStyle]}>{option?.Text}</Text>
        </View>
    );
}

const Selection = React.memo(function Option({ style, option, answer }) {
    const { selectedValue, submitValue } = useContext(QuestionContext);
    const { labelStyle, contentStyle } = useMemo(
        () => calculateStatus({ answer, selectedValue, value: option?.Value }),
        [selectedValue],
    );
    return (
        <TouchableOpacity
            style={[styles.selectionItem, style, labelStyle]}
            activeOpacity={1}
            disabled={selectedValue}
            onPress={() => submitValue(option?.Value)}>
            <Text style={[styles.optionText, contentStyle]}>{option?.Text}</Text>
        </TouchableOpacity>
    );
});

const QuestionSelection = React.memo(function Selections({ selections, answer }) {
    return selections?.map((option) => (
        <Selection key={option?.Value} option={option} style={{ marginTop: pixel(15) }} answer={answer} />
    ));
});

interface Props {
    question: any;
    style: ViewStyle;
}

export default React.memo(function Question({ question, style }: Props) {
    const animationValue = useRef(new Animated.Value(0)).current;
    const [pointerEvents, setPointerEvents] = useState('none');
    const startAnimation = useCallback((toValue) => {
        Animated.timing(animationValue, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setPointerEvents('auto');
        });
    }, []);

    const [selectedValue, setValue] = useState('');
    const submitValue = useCallback((value) => {
        setValue(value);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            startAnimation(1);
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (selectedValue) {
                startAnimation(0);
            }
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
    }, [selectedValue]);

    return (
        <Animated.View
            style={[
                {
                    opacity: animationValue,
                    transform: [
                        {
                            scale: animationValue,
                        },
                    ],
                },
                style,
            ]}>
            <QuestionContext.Provider value={{ selectedValue, submitValue }}>
                <View style={styles.questionItem} pointerEvents={pointerEvents}>
                    <Text style={styles.description}>{question?.description}</Text>
                    <QuestionSelection selections={question?.selections} answer={question?.answer} />
                </View>
            </QuestionContext.Provider>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    questionItem: {},
    description: {
        marginBottom: pixel(10),
        fontSize: pixel(16),
        lineHeight: pixel(22),
        color: 'rgba(255,255,255,0.9)',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
    },
    selectionItem: {
        minHeight: pixel(42),
        borderRadius: pixel(21),
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9,
    },
    optionText: {
        fontSize: pixel(15),
        lineHeight: pixel(20),
        color: 'rgba(255,255,255,0.9)',
    },
});
