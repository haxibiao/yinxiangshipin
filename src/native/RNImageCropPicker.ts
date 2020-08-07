import RNImageCropPicker, { openPicker, Options } from 'react-native-image-crop-picker';

// -- image:
// multiple: true,
// mediaType: 'photo',
// maxFiles: 9,

// -- video:
// multiple: false,
// mediaType: 'video',

export function openImagePicker(props?: Options) {
    openPicker({
        ...props,
    }).then((media: any) => {
        if (props?.mediaType === 'video') {
            media.uploadPath = media?.path?.substr(7);
        }
        return media;
    });
}

export default RNImageCropPicker;
