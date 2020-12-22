const rotation = [
    'M448 128a106.666667 106.666667 0 0 1 106.666667 106.666667v576a106.666667 106.666667 0 0 1-106.666667 106.666666H128a106.666667 106.666667 0 0 1-106.666667-106.666666V234.666667a106.666667 106.666667 0 0 1 106.666667-106.666667h320z m448 256a106.666667 106.666667 0 0 1 106.666667 106.666667v320a106.666667 106.666667 0 0 1-106.666667 106.666666H661.333333a42.666667 42.666667 0 1 1 0-85.333333h234.666667a21.333333 21.333333 0 0 0 21.333333-21.333333V490.666667a21.333333 21.333333 0 0 0-21.333333-21.333334H661.333333a42.666667 42.666667 0 1 1 0-85.333333z m-448-170.666667H128a21.333333 21.333333 0 0 0-21.333333 21.333334v554.666666a21.333333 21.333333 0 0 0 21.333333 21.333334h320a21.333333 21.333333 0 0 0 21.333333-21.333334V234.666667a21.333333 21.333333 0 0 0-21.333333-21.333334z m-64 458.666667a32 32 0 0 1 0 64h-170.666667a32 32 0 0 1 0-64z',
];
const paused = [
    'M309.3 130.7h-70.9c-24.3 0-44 19.7-44 44v674.5c0 24.3 19.7 44 44 44h70.9c24.3 0 44-19.7 44-44V174.7c0-24.3-19.7-44-44-44z m476.3 0h-70.9c-24.3 0-44 19.7-44 44v674.5c0 24.3 19.7 44 44 44h70.9c24.3 0 44-19.7 44-44V174.7c0-24.3-19.7-44-44-44z',
];
const nextEpisode = [
    'M721.454545 551.563636L302.545455 795.927273c-30.254545 18.618182-69.818182-4.654545-69.818182-39.563637v-488.727272c0-34.909091 39.563636-58.181818 69.818182-39.563637l418.90909 244.363637c30.254545 16.290909 30.254545 62.836364 0 79.127272z',
    'M791.272727 684.218182c0 32.581818-30.254545 60.509091-69.818182 60.509091s-69.818182-27.927273-69.818181-60.509091V339.781818c0-32.581818 30.254545-60.509091 69.818181-60.509091s69.818182 27.927273 69.818182 60.509091v344.436364z',
];
const refresh = [
    'M885.333333 512a372.864 372.864 0 0 0-165.290666-310.037333 32 32 0 1 1 35.712-53.12A436.864 436.864 0 0 1 949.333333 512c0 241.536-195.797333 437.333333-437.333333 437.333333-28.501333 0-42.794667-34.474667-22.613333-54.613333l75.989333-76.010667a32 32 0 0 1 45.248 45.248l-11.029333 11.050667C763.52 835.584 885.333333 688 885.333333 512z m-746.666666 0a372.906667 372.906667 0 0 0 167.466666 311.509333 32 32 0 0 1-35.328 53.333334A436.885333 436.885333 0 0 1 74.666667 512C74.666667 270.464 270.464 74.666667 512 74.666667c28.501333 0 42.794667 34.474667 22.613333 54.613333l-75.989333 76.010667a32 32 0 0 1-45.248-45.248l11.029333-11.050667C260.48 188.416 138.666667 336 138.666667 512z',
];
const resize = [
    'M245.76 409.6H204.8V266.24A61.44 61.44 0 0 1 266.24 204.8H409.6v40.96H266.24a20.48 20.48 0 0 0-20.48 20.48zM409.6 819.2H266.24A61.44 61.44 0 0 1 204.8 757.76V614.4h40.96v143.36a20.48 20.48 0 0 0 20.48 20.48H409.6zM757.76 819.2H614.4v-40.96h143.36a20.48 20.48 0 0 0 20.48-20.48V614.4h40.96v143.36a61.44 61.44 0 0 1-61.44 61.44zM819.2 409.6h-40.96V266.24a20.48 20.48 0 0 0-20.48-20.48H614.4V204.8h143.36A61.44 61.44 0 0 1 819.2 266.24z',
];
const zoom = [
    'M810.666667 128h-170.666667v85.333333h170.666667v170.666667h85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333m0 682.666667h-170.666667v85.333333h170.666667a85.333333 85.333333 0 0 0 85.333333-85.333333v-170.666667h-85.333333M213.333333 640H128v170.666667a85.333333 85.333333 0 0 0 85.333333 85.333333h170.666667v-85.333333H213.333333M128 213.333333v170.666667h85.333333V213.333333h170.666667V128H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333z',
];
const volume = [
    'M529.1 901.6c-2.7 0-12.1-4.1-17-9l-0.3-0.3-230.4-190.1H96.1c-8.9 0-18.3-4.6-22.7-9-4.4-4.4-9-13.8-9-22.7v-319c0-7 2.7-12.9 4.4-14.6H71l2.4-2.4c4.4-4.4 13.8-9 22.7-9h185.3l230.4-195.8 0.2-0.2c5.8-5.8 12.9-7 17.8-7 4.4 0 8.9 1 12.6 2.9l0.5 0.3 0.5 0.2c12.5 4.2 17.2 11.3 17.2 26.4v717.8c0 15.1-4.7 22.3-17.2 26.4l-1.8 0.6-1.4 1.4c-3 3-5.6 3.1-11.1 3.1z m279.1-79.7c-9.9 0-23.1-5.1-26.9-12.6-9-18-5.8-36.4 7.9-46.1 4.8-2 11.6-7.2 20.3-15.6 8.9-8.7 22.4-23.7 36.2-45.7 23-36.8 50.4-99.7 50.4-190.9s-29-154.2-53.3-191.1c-14.5-22-28.8-37-38.2-45.6-6.6-6.1-14.9-13-21-15.5-12.6-9.1-17-31.4-8.9-44.5 9.4-9.1 20.6-14.3 30.8-14.3 5.4 0 10.4 1.4 14.8 4.2 0.7 0.6 1.6 1.3 3 2.4 29.4 23.1 54.9 51.4 75.8 84.1 40.1 62.9 60.5 137 60.5 220.3 0 83.7-19.7 158.1-58.4 221.1-20.1 32.7-44.5 60.9-72.6 83.6-1.7 1.4-2.6 2.1-3.3 2.8-3.4 3.4-13.3 3.4-17.1 3.4zM688.6 696.6c-8.3 0-22.6-9.7-26.9-18.3l-0.2-0.5-0.3-0.4c-8.2-12.4 0.8-30.4 14.5-39.7 6.4-3.4 60.9-35.5 60.9-132.3 0-46.5-18-78.4-33.2-97-16.5-20.2-33.1-29.4-33.7-29.8l-0.6-0.3-0.7-0.2c-5.8-1.9-11.4-8.5-14.3-16.8-2.9-8.3-2.3-16.6 1.4-22.2l0.6-0.9 0.3-1c2.9-8.6 15.6-16.1 27.3-16.1 4.5 0 8.6 1.1 11.7 3.2l2.1 1.4h1.5c4.5 1.7 29.1 14 53.5 41.9 21.7 24.9 47.6 68.1 47.6 132.2 0 72.9-24.5 120.2-45 147.1-22.6 29.5-45.6 42.2-50.4 44.1h-2.4l-2.4 2.4c-3.2 3-5.7 3.2-11.3 3.2z',
];
const brightness = [
    'M512 0a58.514286 58.514286 0 0 1 58.514286 58.514286v73.142857a58.514286 58.514286 0 1 1-117.028572 0V58.514286a58.514286 58.514286 0 0 1 58.514286-58.514286z m0 833.828571a58.514286 58.514286 0 0 1 58.514286 58.514286v73.142857a58.514286 58.514286 0 1 1-117.028572 0v-73.142857a58.514286 58.514286 0 0 1 58.514286-58.514286z m512-321.828571a58.514286 58.514286 0 0 1-58.514286 58.514286h-73.142857a58.514286 58.514286 0 1 1 0-117.028572h73.142857a58.514286 58.514286 0 0 1 58.514286 58.514286z m-833.828571 0a58.514286 58.514286 0 0 1-58.514286 58.514286H58.514286a58.514286 58.514286 0 1 1 0-117.028572h73.142857a58.514286 58.514286 0 0 1 58.514286 58.514286z m683.871085-362.042514a58.514286 58.514286 0 0 1 0 82.753828l-51.726628 51.726629a58.514286 58.514286 0 1 1-82.753829-82.753829l51.726629-51.726628a58.514286 58.514286 0 0 1 82.753828 0zM284.437943 739.562057a58.514286 58.514286 0 0 1 0 82.753829l-51.726629 51.726628a58.514286 58.514286 0 1 1-82.753828-82.753828l51.726628-51.726629a58.514286 58.514286 0 0 1 82.753829 0z m589.604571 134.480457a58.514286 58.514286 0 0 1-82.753828 0l-51.726629-51.726628a58.514286 58.514286 0 0 1 82.753829-82.753829l51.726628 51.726629a58.514286 58.514286 0 0 1 0 82.753828zM284.437943 284.437943a58.514286 58.514286 0 0 1-82.753829 0l-51.726628-51.726629a58.514286 58.514286 0 1 1 82.753828-82.753828l51.726629 51.726628a58.514286 58.514286 0 0 1 0 82.753829zM512 731.428571c-121.183086 0-219.428571-98.245486-219.428571-219.428571 0-121.183086 98.245486-219.428571 219.428571-219.428571 121.183086 0 219.428571 98.245486 219.428571 219.428571 0 121.183086-98.245486 219.428571-219.428571 219.428571z',
];
const lock = [
    'M512 725.333333a85.333333 85.333333 0 0 0 85.333333-85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333 85.333333 85.333333 0 0 0-85.333333 85.333333 85.333333 85.333333 0 0 0 85.333333 85.333333m256-384a85.333333 85.333333 0 0 1 85.333333 85.333334v426.666666a85.333333 85.333333 0 0 1-85.333333 85.333334H256a85.333333 85.333333 0 0 1-85.333333-85.333334V426.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h42.666667V256a213.333333 213.333333 0 0 1 213.333333-213.333333 213.333333 213.333333 0 0 1 213.333333 213.333333v85.333333h42.666667m-256-213.333333a128 128 0 0 0-128 128v85.333333h256V256a128 128 0 0 0-128-128z',
];
const unlock = [
    'M768 341.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v426.666666a85.333333 85.333333 0 0 1-85.333333 85.333334H256a85.333333 85.333333 0 0 1-85.333333-85.333334V426.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h384V256a128 128 0 0 0-128-128 128 128 0 0 0-128 128H298.666667a213.333333 213.333333 0 0 1 213.333333-213.333333 213.333333 213.333333 0 0 1 213.333333 213.333333v85.333333h42.666667m-256 384a85.333333 85.333333 0 0 0 85.333333-85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333 85.333333 85.333333 0 0 0-85.333333 85.333333 85.333333 85.333333 0 0 0 85.333333 85.333333z',
];

export const SvgPath = {
    rotation,
    paused,
    nextEpisode,
    refresh,
    resize,
    zoom,
    volume,
    brightness,
    lock,
    unlock,
};
