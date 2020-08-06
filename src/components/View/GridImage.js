/*
 * @flow
 * created by wyk made in 2018-12-13 11:38:24
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Text } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Row from '../Basic/Row';
import TouchFeedback from '../Basic/TouchFeedback';
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
    static defaultProps = {
        gap: 6,
    };

    state = {
        gridWidth: 0,
    };

    _onLayout = e => {
        const { width } = e.nativeEvent.layout;
        this.setState({ gridWidth: width });
    };

    imagesLayout() {
        let { images, gap, style, gridStyle } = this.props;
        const { gridWidth } = this.state;
        if (images.length === 1) {
            const { width, height } = images[0];
            const style = Helper.ResponseMedia(width, height, gridWidth);
            gridStyle = {
                borderRadius: 4,
                ...style,
                ...gridStyle,
            };
            return (
                <TouchFeedback
                    activeOpacity={1}
                    onPress={() => this.showPicture(0)}
                    style={{ alignSelf: 'flex-start' }}>
                    <PlaceholderImage style={gridStyle} source={{ uri: images[0].url }} />
                </TouchFeedback>
            );
        } else {
            const size = (gridWidth - gap * 2) / 3;
            gridStyle = {
                width: size,
                height: size,
                marginRight: gap,
                marginTop: gap,
                borderRadius: 4,
                ...gridStyle,
            };
            if (images.length === 4) {
                return (
                    <View style={{ marginTop: -gap }}>
                        <Row>
                            <TouchFeedback activeOpacity={1} onPress={() => this.showPicture(0)}>
                                <PlaceholderImage style={gridStyle} source={{ uri: images[0].url }} />
                            </TouchFeedback>
                            <TouchFeedback activeOpacity={1} onPress={() => this.showPicture(1)}>
                                <PlaceholderImage style={gridStyle} source={{ uri: images[1].url }} />
                            </TouchFeedback>
                        </Row>
                        <Row>
                            <TouchFeedback activeOpacity={1} onPress={() => this.showPicture(2)}>
                                <PlaceholderImage style={gridStyle} source={{ uri: images[2].url }} />
                            </TouchFeedback>
                            <TouchFeedback activeOpacity={1} onPress={() => this.showPicture(3)}>
                                <PlaceholderImage style={gridStyle} source={{ uri: images[3].url }} />
                            </TouchFeedback>
                        </Row>
                    </View>
                );
            } else {
                images.length > 9 && images.splice(9);
                return (
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginTop: -gap,
                            marginRight: -gap,
                            overflow: 'hidden',
                        }}>
                        {images.map((elem, index) => {
                            return (
                                <TouchFeedback activeOpacity={1} onPress={() => this.showPicture(index)} key={index}>
                                    <PlaceholderImage style={gridStyle} source={{ uri: elem.url }} />
                                </TouchFeedback>
                            );
                        })}
                    </View>
                );
            }
        }
    }

    showPicture = initIndex => {
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
        const { gap } = this.props;
        return <View onLayout={this._onLayout}>{this.imagesLayout()}</View>;
    }
}

const styles = StyleSheet.create({});

export default GridImage;
