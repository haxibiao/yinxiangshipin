import React, { useEffect, useState } from 'react';
import * as ART from '@react-native-community/art';
import { ViewStyle, View, Text, FlatList, SafeAreaView, ScrollView } from 'react-native';

export function SvgIcon(props: {
    name: string[];
    size?: number;
    color?: string;
    scale?: number;
    __debugBG?: string;
    offset?: {
        x?: number;
        y?: number;
    };
    shadowColor?: string;
    shadowRadius?: number;
    ShadowOffsetX?: number;
    ShadowOffsetY?: number;
    style?: ViewStyle;
}) {
    let n = props.name;
    let size = props.size ?? 28;
    let color = props.color ?? '#222';
    let scale = props.scale ?? size * 0.001;
    let debugBG = props.__debugBG ?? 'transparent';
    let x = props.offset?.x ?? 0;
    let y = props.offset?.y ?? 0;
    let shadowColor = props?.shadowColor ?? 'transparent';
    let shadowRadius = props?.shadowRadius ?? 0;
    let ShadowOffsetX = props?.ShadowOffsetX ?? 0;
    let ShadowOffsetY = props?.ShadowOffsetY ?? 0;

    return (
        <ART.Surface
            height={size}
            width={size}
            style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor: debugBG }, props.style]}>
            <ART.Group>
                {n.map((item: string, index: number) => {
                    if (shadowRadius == 0) {
                        return (
                            <ART.Shape
                                key={index.toString()}
                                d={item}
                                fill={color}
                                stroke={color}
                                height={size}
                                scale={scale}
                                x={x}
                                y={y}
                            />
                        );
                    }
                    return (
                        <ART.Shape
                            key={index.toString()}
                            d={item}
                            fill={color}
                            stroke={color}
                            height={size}
                            scale={scale}
                            x={x}
                            y={y}
                            shadowColor={shadowColor}
                            shadowRadius={shadowRadius}
                            shadowOffset={{ x: ShadowOffsetX, y: ShadowOffsetY }}
                        />
                    );
                })}
            </ART.Group>
        </ART.Surface>
    );
}

export const IconsPreview = () => {
    const [data, setdata]: any[] = useState([]);
    useEffect(() => {
        let _data: any[] = [];
        let keys = Object.keys(Icons);
        for (let i of keys) {
            _data.push({ title: i, value: Icons[i] });
        }
        setdata(_data);
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView>
                <ScrollView contentContainerStyle={{ paddingTop: sh * 0.05, paddingBottom: sh * 0.05 }}>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {data.map((item, index) => {
                            return (
                                <View style={{ marginHorizontal: 12, marginVertical: 10, alignItems: 'center' }}>
                                    <SvgIcon key={index} name={item.value} size={25} color={'#000'} style={{}} />
                                    <Text>{item.title}</Text>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};
