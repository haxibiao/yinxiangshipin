import RNImageCropPicker from 'react-native-image-crop-picker';

// -- image:
// multiple: true,
// mediaType: 'photo',
// maxFiles: 9,

// -- video:
// multiple: false,
// mediaType: 'video',
export interface Options {
    cropping?: boolean;
    width?: number;
    height?: number;
    multiple?: boolean;
    path?: string;
    includeBase64?: boolean;
    cropperCircleOverlay?: boolean;
    maxFiles?: number;
    useFrontCamera?: boolean;
    mediaType?: 'photo' | 'video' | 'any';
    showsSelectedCount?: boolean;
    forceJpg?: boolean;
    sortOrder?: 'none' | 'asc' | 'desc';
    showCropGuidelines?: boolean;
    enableRotationGesture?: boolean;
}

export async function openImagePicker(props?: Options) {
    return RNImageCropPicker.openPicker({
        ...props,
    })
        .then((media: any) => {
            if (props?.mediaType === 'video') {
                media.uploadPath = media?.path?.substr(7);
            }
            return media;
        })
        .catch((e) => {
            Toast.show({
                content: '打开相册出错',
            });
        });
}

export default RNImageCropPicker;
