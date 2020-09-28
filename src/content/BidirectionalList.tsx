import React, { useRef, useState, useMemo, useCallback, ReactNode, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, FlatList, ViewStyle, FlatListProps } from 'react-native';

interface Props extends FlatListProps {
    style?: ViewStyle;
    contentHeight?: number;
    data: any[];
    onTopReached?: () => any;
    onEndReached?: () => any;
}

export default React.forwardRef(
    (
        {
            style,
            data,
            onTopReached,
            onEndReached,
            contentHeight,
            onEndReachedThreshold = 0.1,
            renderItem,
            ListHeaderComponent,
            ListFooterComponent,
            ListEmptyComponent,
            ...listProps
        }: Props,
        ref,
    ) => {
        const [containerHeight, setContainerHeight] = useState(contentHeight);
        const listRef = useRef();
        const contentInfo = useRef({
            prevContentHeight: 0,
            contentHeight: 0,
            contentOffsetY: 0,
            isTopReached: false,
        });

        const setTopReached = useCallback((isTopReached: boolean) => {
            contentInfo.current.isTopReached = isTopReached;
        }, []);

        useImperativeHandle(ref, () => ({}), []);

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
                onTopReached(() => setTopReached(true));
            } else if (
                prevOffsetY < contentOffsetY &&
                contentOffsetY >= contentHeight - containerHeight - offsetThreshold
            ) {
                onEndReached(() => setTopReached(false));
            }
            contentInfo.current.contentOffsetY = event?.nativeEvent?.contentOffset?.y;
            // console.log('contentOffsetY', contentInfo.current.contentOffsetY);
        }, []);

        const onContentSizeChange = useCallback(
            (contentWidth, contentHeight) => {
                if (contentInfo.current.isTopReached) {
                    setTopReached(false);
                    const offset =
                        contentHeight - contentInfo.current.prevContentHeight + contentInfo.current.contentOffsetY;
                    listRef.current?.scrollToOffset({
                        offset,
                        animated: true,
                    });
                    // console.log('offset', offset);
                    contentInfo.current.contentOffsetY = offset;
                }
                contentInfo.current.prevContentHeight = contentHeight;
            },
            [containerHeight],
        );

        return (
            <FlatList
                ref={listRef}
                data={data}
                style={style}
                contentContainerStyle={styles.container}
                onLayout={onLayout}
                onScroll={onScroll}
                onScrollBeginDrag={onScrollBeginDrag}
                onContentSizeChange={onContentSizeChange}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                ListEmptyComponent={ListEmptyComponent}
                keyExtractor={(item, index) => String(item.id || index)}
                renderItem={renderItem}
                {...listProps}
            />
        );
    },
);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
});
