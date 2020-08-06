import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { Carousel } from 'teaset';
import { OverlayViewer } from '@src/components';
import ImageViewer from 'react-native-image-zoom-viewer';

interface Props {
    images: {
        id: any;
        url: any;
        width: any;
        height: any;
    }[];
    style: any;
    gridStyle: any;
}

const ImageCarousel = (props: Props) => {
    const { images, style } = props;

    const showPicture = useCallback(init => {
        const overlayView = (
            <ImageViewer
                onSwipeDown={() => OverlayViewer.hide()}
                imageUrls={images}
                index={init}
                enableSwipeDown={true}
            />
        );
        OverlayViewer.show(overlayView);
    }, []);

    const imagesContent = useMemo(() => {
        return images.map((item, index) => {
            return (
                <TouchableWithoutFeedback key={item} onPress={() => showPicture(index)}>
                    <Image style={styles.imageStyle} key={item.id} source={{ uri: item.url }} />
                </TouchableWithoutFeedback>
            );
        });
    }, [images]);

    return (
        <Carousel
            style={[styles.container, style]}
            carousel={false}
            control={
                images.length > 1 && (
                    <Carousel.Control
                        style={{ alignItems: 'center' }}
                        dot={<Text style={styles.bannerDot} />}
                        activeDot={<Text style={styles.bannerActiveDot} />}
                    />
                )
            }>
            {imagesContent}
        </Carousel>
    );
};

export default ImageCarousel;

const styles = StyleSheet.create({
    container: {
        height: Device.WIDTH,
        width: Device.WIDTH,
    },
    bannerActiveDot: {
        backgroundColor: 'rgba(10, 173, 255, 1)',
        borderRadius: pixel(2.5),
        color: '#0AADFF',
        height: pixel(5),
        marginHorizontal: pixel(5),
        marginVertical: pixel(5),
        width: pixel(5),
    },
    bannerDot: {
        backgroundColor: 'rgba(216, 216, 216, 1)',
        borderRadius: pixel(10),
        color: '#D8D8D8',
        height: pixel(5),
        marginHorizontal: pixel(5),
        marginVertical: pixel(5),
        width: pixel(5),
    },
    imageStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: null,
        width: null,
        resizeMode: 'cover',
        backgroundColor: 'rgba(216, 216, 216, 1)',
    },
});
