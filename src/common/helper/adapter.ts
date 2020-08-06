export function syncGetter(str: string, data: any): any {
    if (data === null || data === undefined || typeof data !== 'object') return null;
    let result: any = { ...data };
    const keys: string[] = str.split('.');
    for (const key of keys) {
        if (result[key] !== undefined && result[key] !== null) {
            result = result[key];
        } else {
            return undefined;
        }
    }
    return result;
}

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

export function gridImage(imgCount, space = 4, maxWidth = divece.width) {
    let width,
        height,
        i = 0;
    const imgSize = [];
    switch (true) {
        case imgCount === 1:
            maxWidth = (maxWidth * 2) / 3;
            width = maxWidth;
            height = maxWidth / 2;
            imgSize.push({ width, height, marginRight: space, marginTop: space });
            break;
        case imgCount === 7:
            for (; i < imgCount; i++) {
                if (i === 0) {
                    width = maxWidth;
                    height = maxWidth / 2;
                } else {
                    width = height = (maxWidth - space * 2) / 3;
                }
                imgSize.push({ width, height, marginRight: space, marginTop: space });
            }
            break;
        case imgCount === 5:
        case imgCount === 8:
            for (; i < imgCount; i++) {
                if (i === 0 || i === 1) {
                    width = height = (maxWidth - space) / 2;
                } else {
                    width = height = (maxWidth - space * 2) / 3;
                }
                imgSize.push({ width, height, marginRight: space, marginTop: space });
            }
            break;
        case imgCount === 2:
        case imgCount === 4:
            width = height = (maxWidth - space) / 2;
            for (; i < imgCount; i++) {
                imgSize.push({ width, height, marginRight: space, marginTop: space });
            }
            break;
        case imgCount === 3:
        case imgCount === 6:
        case imgCount === 9:
            width = height = (maxWidth - space * 2) / 3;
            for (; i < imgCount; i++) {
                imgSize.push({ width, height, marginRight: space, marginTop: space });
            }
            break;
    }
    return imgSize;
}
