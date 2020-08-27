/*
 * @flow
 * created by wyk made in 2018-12-13 11:38:24
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Row from '../Basic/Row';
import PlaceholderImage from '../Basic/PlaceholderImage';
import OverlayViewer from '../Popup/OverlayViewer';

type Props = {
    images: Array<{
        id: any,
        url: any,
        width: any,
        height: any,
    }>,
    gap?: number,
    style: any,
    gridStyle: any,
};

class GridImage extends Component<Props> {
    state = {
        gridWidth: 0,
    };

    _onLayout = (e) => {
        const { width } = e.nativeEvent.layout;
        this.setState({ gridWidth: Math.floor(width) });
    };

    imagesLayout() {
        const { gridWidth } = this.state;
        const { images, style, gridStyle, gap = pixel(5) } = this.props;
        const imagesData = images?.slice(0, 9) || [];
        const imageSize = Math.ceil((gridWidth - gap * 2) / 3);
        const defaultImageStyle = { width: imageSize, height: imageSize, ...gridStyle };

        if (imagesData.length === 1) {
            const { width, height } = imagesData[0];
            const responseSize = Helper.ResponseMedia(width, height, gridWidth);
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.showPicture(0)}
                    style={{ alignSelf: 'flex-start' }}>
                    <PlaceholderImage
                        style={{
                            borderRadius: pixel(4),
                            ...responseSize,
                            ...gridStyle,
                        }}
                        source={{ uri: imagesData[0].url }}
                    />
                </TouchableOpacity>
            );
        } else if (imagesData.length > 1) {
            return (
                <View
                    style={[
                        styles.imageContainer,
                        {
                            marginTop: -gap,
                            marginRight: -gap * 2,
                        },
                    ]}>
                    {imagesData.map((elem, index) => {
                        return (
                            <TouchableOpacity
                                style={{ marginTop: gap, marginRight: gap }}
                                key={index}
                                activeOpacity={1}
                                onPress={() => this.showPicture(index)}>
                                <PlaceholderImage
                                    style={{
                                        ...defaultImageStyle,
                                        ...imageStyle({
                                            index,
                                            count: imagesData.length,
                                            radius: pixel(4),
                                            gap,
                                        }),
                                    }}
                                    source={{ uri: elem.url }}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        }
    }

    showPicture = (initIndex) => {
        const overlayView = (
            <ImageViewer
                onSwipeDown={() => OverlayViewer.hide()}
                imageUrls={this.props.images}
                index={initIndex}
                enableSwipeDown
            />
        );
        OverlayViewer.show(overlayView);
    };

    render() {
        return <View onLayout={this._onLayout}>{this.imagesLayout()}</View>;
    }
}

function imageStyle({ count, index, radius, gap }) {
    let style;

    if (count === 1) {
        style = {
            borderRadius: radius,
        };
    } else if (count > 1 && count < 4) {
        if (index === 0) {
            style = {
                borderTopLeftRadius: radius,
                borderBottomLeftRadius: radius,
            };
        } else if (index === count - 1) {
            style = {
                borderTopRightRadius: radius,
                borderBottomRightRadius: radius,
            };
        }
    } else if (count === 4) {
        if (index === 0) {
            style = {
                borderTopLeftRadius: radius,
            };
        } else if (index === 1) {
            style = {
                borderTopRightRadius: radius,
                marginRight: gap,
            };
        } else if (index === 2) {
            style = {
                borderBottomLeftRadius: radius,
            };
        } else if (index === 3) {
            style = {
                borderBottomRightRadius: radius,
            };
        }
    } else if (count > 4) {
        if (index === 0) {
            style = {
                borderTopLeftRadius: radius,
            };
        } else if (index === 2) {
            style = {
                borderTopRightRadius: radius,
            };
        } else if (index === (count / 3 > 2 ? 6 : 3)) {
            // index = 3 6
            style = {
                borderBottomLeftRadius: radius,
            };
        } else if (index === count - 1 && Math.ceil(count % 3) === 0) {
            // index = 5 8
            style = {
                borderBottomRightRadius: radius,
            };
        }
    }
    return style;
}

const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
});

export default GridImage;
