export function ResponseMedia(width: number, height: number, maxWidth: number) {
    const size: { width: number; height: number } = { width: 0, height: 0 };
    const ratio = width / height;
    if (ratio < 0.75) {
        size.width = maxWidth * 0.75;
        size.height = maxWidth;
    } else if (ratio > 1.3) {
        size.width = maxWidth;
        size.height = maxWidth * 0.75;
    } else {
        size.width = maxWidth;
        size.height = maxWidth / ratio;
        if (size.height > maxWidth) {
            size.width = maxWidth * 0.75;
            size.height = maxWidth;
        }
    }
    return size;
}
