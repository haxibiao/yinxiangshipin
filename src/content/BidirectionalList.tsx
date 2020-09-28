import React, { useRef, useState, useMemo, useCallback, ReactNode } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, ViewStyle, FlatListProps } from 'react-native';

interface Props extends FlatListProps {
    style?: ViewStyle;
    topListStyle?: ViewStyle;
    bottomListStyle?: ViewStyle;
    prevPageData: any[];
    nextPageData: any[];
    onTopReached?: () => any;
    onEndReached?: () => any;
    contentHeight: number;
    onEndReachedThreshold?: number;
}

export default function BidirectionalList({
    style,
    topListStyle,
    bottomListStyle,
    prevPageData,
    nextPageData,
    onTopReached,
    onEndReached,
    contentHeight,
    onEndReachedThreshold = 0.1,
    renderItem,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
}: Props) {
    const [containerHeight, setContainerHeight] = useState(contentHeight);
    const contentInfo = useRef({
        prevContentHeight: 0,
        contentHeight: 0,
        contentOffsetY: 0,
        isTopReached: false,
    });

    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        setContainerHeight(height);
    }, []);

    const onScrollBeginDrag = useCallback((event) => {
        contentInfo.current.contentOffsetY = event.nativeEvent.contentOffset.y;
    }, []);

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const prevOffsetY = contentInfo.current.contentOffsetY;
        const offsetThreshold = containerHeight * onEndReachedThreshold;
        const contentHeight = event?.nativeEvent?.contentSize?.height;
        const contentOffsetY = Math.ceil(event?.nativeEvent?.contentOffset?.y);
        if (prevOffsetY > contentOffsetY && contentOffsetY <= offsetThreshold) {
            onTopReached();
        } else if (
            prevOffsetY < contentOffsetY &&
            contentOffsetY >= contentHeight - containerHeight - offsetThreshold
        ) {
            onEndReached();
        }
        contentInfo.current.contentOffsetY = event?.nativeEvent?.contentOffset?.y;
    }, []);

    const onContentSizeChange = useCallback((contentWidth, contentHeight) => {
        contentInfo.current.prevContentHeight = contentInfo.current.contentHeight;
        contentInfo.current.contentHeight = contentHeight;
    }, []);
    // console.log('====================================');
    // console.log('prevPageData', prevPageData);
    // console.log('nextPageData', nextPageData);
    // console.log('====================================');
    return (
        <ScrollView
            contentContainerStyle={[styles.container, style]}
            onLayout={onLayout}
            onScrollBeginDrag={onScrollBeginDrag}
            onScroll={onScroll}
            onContentSizeChange={onContentSizeChange}>
            <FlatList
                inverted={true}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                data={prevPageData}
                contentContainerStyle={topListStyle}
                ListFooterComponent={ListHeaderComponent}
                keyExtractor={(item, index) => String(item.id || index)}
                renderItem={(params) => renderItem({ ...params, topList: true })}
            />
            <FlatList
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                data={nextPageData}
                contentContainerStyle={bottomListStyle}
                ListFooterComponent={ListFooterComponent}
                ListEmptyComponent={ListEmptyComponent}
                keyExtractor={(item, index) => String(item.id || index)}
                renderItem={(params) => renderItem({ ...params, bottomList: true })}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
});
