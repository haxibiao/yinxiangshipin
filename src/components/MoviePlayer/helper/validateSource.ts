const VIDEO_FORMATS = ['mp3', 'mp4', 'avi', 'mov', 'rmvb', 'm3u8'];
function getFormatFromSource(str) {
    if (!str) return;
    let index = str.lastIndexOf('.');
    str = str.substring(index + 1, str.length);
    return String(str).toLowerCase();
}
export default function validateSource(url) {
    return VIDEO_FORMATS.includes(getFormatFromSource(url));
}
