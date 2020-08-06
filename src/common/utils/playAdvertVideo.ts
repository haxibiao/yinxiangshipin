let rewardCount = 0;
let rewardVideoCache: any;
let fullScreenVideoCache: any;

interface Props {
    callback: (a?: any) => any;
}

function startRewardVideo(props: Props) {
    const { callback } = props;
    let video = {
        video_play: false,
        ad_click: false,
        verify_status: false,
    };
}

function startFullScreenVideo(props: Props) {
    const { callback } = props;
    let video = {
        video_play: false,
        ad_click: false,
        verify_status: false,
    };
}

function loadRewardVideo(props: Props) {}

function loadFullScreenVideo(props: Props) {}

// 看激励视频
export function playRewardVideo(props: Props) {
    // 有缓存播放缓存
    if (rewardVideoCache) {
        startRewardVideo(props);
    } else {
        loadRewardVideo(props);
    }
}

//  看全屏视频
export function playFullScreenVideo(props: Props) {
    if (fullScreenVideoCache) {
        startFullScreenVideo(props);
    } else {
        loadFullScreenVideo(props);
    }
}

// 随机看激励视频 / 全屏视频
export function playAdvertVideo(props: Props) {
    rewardCount++;
    if (rewardCount % 3 === 0) {
        playFullScreenVideo(props);
    } else {
        playRewardVideo(props);
    }
}
