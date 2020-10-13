import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { ad } from 'react-native-ad';
import { userStore, appStore, adStore } from '@src/store';
import { getTaskReward, getUserReward, getNewUserReward } from '@src/apollo';
import { SafeText, HxfButton, RewardOverlay, Loading, PopOverlay } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { Overlay } from 'teaset';
import VideoTeaching from '../VideoTeaching';

let navigation = {};

export default function TaskItem({ task }) {
    const [taskState, taskHandler] = useTaskState(task);
    const optimizedCallback = __.debounce(taskHandler, 300);

    const taskIcon = useMemo(() => {
        if (task.icon) {
            return {
                uri: task.icon,
            };
        }
        return require('@app/assets/images/task_gift.png');
    }, [task]);

    // const showTaskDetail = useCallback(() => {
    //     const overlayView = (
    //         <Overlay.View animated={true}>
    //             <View style={styles.overlayInner}>
    //                 <View style={styles.overlayContent}>
    //                     <Text style={styles.overlayTitle}>{task.name}</Text>
    //                     <View style={{ marginVertical: 10 }}>
    //                         <Text style={styles.promptDetails}>{task.details}</Text>
    //                     </View>
    //                     <HxfButton
    //                         size="medium"
    //                         title="知道了"
    //                         style={styles.promptBtn}
    //                         titleStyle={styles.promptBtnTitle}
    //                         onPress={() => Overlay.hide(OverlayKey)}
    //                     />
    //                 </View>
    //             </View>
    //         </Overlay.View>
    //     );
    //     const OverlayKey = Overlay.show(overlayView);
    // }, [task]);

    return (
        <View style={styles.taskItem}>
            <Image source={taskIcon} style={styles.taskIcon} />
            <View style={styles.taskInfo}>
                <View style={styles.taskTitleWrap}>
                    <SafeText style={styles.taskTitle} numberOfLines={1}>
                        {String(task.name).slice(0, 8)}
                    </SafeText>
                    {task?.reward_info?.gold > 0 && (
                        <View style={styles.taskReward}>
                            <Image
                                source={require('@app/assets/images/wallet/icon_wallet_diamond.png')}
                                style={styles.taskRewardIcon}
                            />
                            <SafeText numberOfLines={1} style={styles.taskRewardGold}>
                                {task?.reward_info?.gold}
                            </SafeText>
                        </View>
                    )}
                    {task?.reward_info?.ticket > 0 && (
                        <View style={styles.taskReward}>
                            <Image
                                source={require('@app/assets/images/wallet/icon_wallet_giftAward.png')}
                                style={styles.taskRewardIcon}
                            />
                            <SafeText numberOfLines={1} style={styles.taskRewardGold}>
                                {task?.reward_info?.ticket}
                            </SafeText>
                        </View>
                    )}
                </View>
                <SafeText numberOfLines={1} style={styles.taskDetails}>
                    {task.details}
                </SafeText>
                {!!task.progress_details && (
                    <View style={styles.taskProgress}>
                        <View style={styles.progressBar}>
                            <View style={[styles.completedProgress, { width: `${task.assignment_progress * 100}%` }]} />
                        </View>
                        <SafeText
                            style={[styles.progressDetails, task.assignment_status === 2 && { color: '#FF5E7D' }]}>
                            {task.progress_details}
                        </SafeText>
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={[styles.taskButton, { backgroundColor: taskState.btnColor }]}
                disabled={task.assignment_status === 3}
                onPress={optimizedCallback}>
                <SafeText numberOfLines={1} style={styles.taskName}>
                    {taskState.countdown > 0 ? taskState.countdown : taskState.btnName}
                </SafeText>
            </TouchableOpacity>
        </View>
    );
}

function useTaskState(task) {
    navigation = useNavigation();
    const taskInterval = useRef(task?.next_reward_video_time || 0);
    const [countdown, setCountdown] = useState(taskInterval.current);

    const btnName = useMemo(() => {
        if (task?.resolve?.submit_name === '去好评' && task.assignment_status === 1) {
            return '审核中';
        } else if (task.assignment_status === 2) {
            return '领奖励';
        } else if (task.assignment_status === 3) {
            return '已完成';
        } else {
            return task?.resolve?.submit_name || '做任务';
        }
    }, [task]);

    const btnColor = useMemo(() => {
        if (task.assignment_status === 2) {
            return '#FFCC01';
        } else if (task.assignment_status === 3 || taskInterval.current > 0) {
            return '#bdbdbd';
        } else if (taskColor[task.group]) {
            return taskColor[task.group];
        } else {
            return '#0584FF';
        }
    }, [task, countdown]);

    // 任务间隔
    useEffect(() => {
        let interval = task?.next_reward_video_time || 0;
        const timer = setInterval(() => {
            interval -= 1;
            if (interval >= 1) {
                taskInterval.current = interval;
                setCountdown(interval);
            } else {
                taskInterval.current = 0;
                setCountdown(0);
                clearInterval(timer);
            }
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [task]);

    // 做任务 跳转页面/观看激励视频
    const doTask = useCallback(() => {
        const taskAction = taskRouteInfo[btnName];
        if (typeof taskAction === 'string') {
            navigation.navigate(taskAction);
        } else if (typeof taskAction === 'function') {
            taskAction(Object.assign({}, task, { wait: taskInterval.current }));
        } else {
            Toast.show({ content: '请前往完成任务' });
        }
    }, [btnName, task]);

    // 领取任务奖励
    const gotTaskReward = useCallback((id) => {
        Loading.show();
        getTaskReward(id)
            .then((res) => {
                Loading.hide();
                RewardOverlay.show({
                    reward: {
                        gold: res?.gold,
                        ticket: res?.ticket,
                    },
                    title: '任务奖励领取成功',
                });
            })
            .catch((err) => {
                Loading.hide();
                Toast.show({ content: err });
            });
    }, []);

    const callback = useCallback(() => {
        // 根据任务状态执行不同操作
        switch (task.assignment_status) {
            case 0:
            case 1:
                doTask();
                break;
            case 2:
                gotTaskReward(task.id);
                break;
            default:
                Toast.show({ content: '请前往完成任务' });
                break;
        }
    }, [task.assignment_status, doTask]);

    return [{ btnName, btnColor, countdown }, callback];
}

function playRewardVideo({ wait }: { wait: number }) {
    let called = false;
    if (wait > 0) {
        Toast.show({ content: '请稍后再试' });
    } else {
        let rewardVideo;
        if (userStore.me?.wallet?.total_withdraw_amount > 0) {
            rewardVideo = ad.startRewardVideo({ appid: adStore.tt_appid, codeid: adStore.codeid_reward_video });
        } else {
            rewardVideo = ad.startFullVideo({ appid: adStore.tt_appid, codeid: adStore.codeid_full_video });
        }

        rewardVideo.subscribe('onAdClose', (event) => {
            if (!called) {
                called = true;
                getUserReward('WATCH_REWARD_VIDEO')
                    .then((res) => {
                        RewardOverlay.show({
                            reward: {
                                gold: res?.gold,
                                ticket: res?.ticket,
                            },
                            title: '看视频奖励领取成功',
                        });
                    })
                    .catch((err) => {
                        Toast.show({ content: err });
                    });
            }
        });
        rewardVideo.subscribe('onAdLoaded', (event) => {
            if (!called) {
                called = true;
                getUserReward('WATCH_REWARD_VIDEO')
                    .then((res) => {
                        RewardOverlay.show({
                            reward: {
                                gold: res?.gold,
                                ticket: res?.ticket,
                            },
                            title: '看视频奖励领取成功',
                        });
                    })
                    .catch((err) => {
                        Toast.show({ content: err });
                    });
            }
        });
        rewardVideo.subscribe('onAdError', (event) => {
            Toast.show({ content: event?.message || '视频播放失败！', duration: 1500 });
        });
    }
}

function resolveVideo() {
    if (!appStore.spiderVideoTaskGuided) {
        appStore.setAppStorage('spiderVideoTaskGuided', true);
        appStore.spiderVideoTaskGuided = true;
        navigation.navigate('SpiderVideoTask');
    } else {
        //TODO 唤起抖音，scheme可能存在一旦更改无法唤起的风险
        const scheme = Device.IOS ? 'itms-apps://itunes.apple.com/app/id1142110895' : 'snssdk1128://';
        Linking.openURL(scheme)
            .then(() => null)
            .catch(() => {
                Toast.show({ content: '请打开抖音App复制视频链接' });
            });
    }
}

const showVideoTeaching = (function teaching() {
    let overlayRef;
    let isShow;
    let timer;
    let played;
    function onClose() {
        if (played) {
            overlayRef?.close();
            isShow = false;
        } else {
            PopOverlay({
                content: '确定关闭吗，观看完教学视频可领取新人奖励哦！',
                leftContent: '确定关闭',
                rightContent: '继续观看',
                leftConfirm: () => {
                    overlayRef?.close();
                    isShow = false;
                },
            });
        }
    }

    // 观看完毕，改变任务状态
    function changeTaskStatus({ duration = 10 }) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            played = true;
            getNewUserReward('VIDEO');
        }, duration * 600);
    }

    return () => {
        if (!isShow) {
            isShow = true;
            Overlay.show(
                <Overlay.PopView
                    modal={true}
                    overlayOpacity={0.7}
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                    ref={(ref) => (overlayRef = ref)}
                    onDisappearCompleted={() => (isShow = false)}>
                    <VideoTeaching onLoad={changeTaskStatus} onClose={onClose} />
                </Overlay.PopView>,
            );
        }
    };
})();

function inReview() {
    Toast.show({ content: '任务审核中，请留意奖励发放' });
}

function nationalDayTask({ collection }) {
    navigation.navigate('CollectionDetail', { collection });
}

function midAutumnFestivalTask({ collection }) {
    navigation.navigate('CollectionDetail', { collection });
}

// resolve.submit_name
const taskColor = {
    活动任务: '#2FC6FC',
    新人任务: '#12E2BB',
    每日任务: '#FF5E7D',
};
const taskRouteInfo = {
    去观看: playRewardVideo,
    去采集: resolveVideo,
    审核中: inReview,
    去了解: showVideoTeaching,
    庆国庆: nationalDayTask,
    庆中秋: midAutumnFestivalTask,
    去点赞: 'Home',
    去发布: 'CreatePost',
    去绑定: 'BindingAccount',
    去修改: 'EditProfile',
    去好评: 'Praise',
};

const styles = StyleSheet.create({
    taskItem: {
        marginHorizontal: pixel(15),
        paddingVertical: pixel(18),
        paddingHorizontal: pixel(12),
        borderRadius: pixel(6),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    taskIcon: {
        height: pixel(48),
        width: pixel(48),
        borderRadius: pixel(24),
        backgroundColor: '#f0f0f0',
    },
    taskInfo: {
        paddingHorizontal: pixel(10),
        flex: 1,
    },
    taskTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskTitle: {
        color: '#202020',
        fontSize: font(15),
        lineHeight: font(22),
        fontWeight: 'bold',
    },
    taskReward: {
        marginLeft: pixel(5),
        height: pixel(14),
        borderRadius: pixel(7),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#fefabd',
    },
    taskRewardIcon: {
        height: pixel(20),
        width: pixel(20),
    },
    taskRewardGold: {
        color: '#ffaf00',
        fontSize: font(12),
        fontWeight: 'bold',
    },
    taskDetails: {
        color: '#adadad',
        fontSize: font(13),
        lineHeight: font(18),
        marginTop: pixel(5),
    },
    taskProgress: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: pixel(8),
    },
    progressBar: {
        flex: 1,
        height: pixel(2),
        borderRadius: pixel(1),
        backgroundColor: '#f4f5f7',
        overflow: 'hidden',
    },
    completedProgress: {
        width: 0,
        height: pixel(2),
        backgroundColor: '#cff3ef',
    },
    progressDetails: {
        color: '#bdbdbd',
        fontSize: font(11),
        fontWeight: 'bold',
        marginLeft: pixel(3),
    },
    taskButton: {
        width: pixel(76),
        height: pixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: pixel(16),
        paddingHorizontal: pixel(10),
        backgroundColor: '#bdbdbd',
    },
    taskName: {
        color: '#fff',
        fontSize: font(13),
    },
    // overlayInner: {
    //     flex: 1,
    //     width: Device.WIDTH,
    //     height: Device.HEIGHT,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // overlayContent: {
    //     width: Device.WIDTH - pixel(70),
    //     paddingHorizontal: pixel(25),
    //     paddingVertical: pixel(20),
    //     borderRadius: pixel(10),
    //     backgroundColor: '#fff',
    // },
    // overlayTitle: {
    //     color: '#202020',
    //     fontSize: font(16),
    //     lineHeight: font(22),
    //     textAlign: 'center',
    // },
    // promptDetails: {
    //     color: '#464646',
    //     fontSize: font(14),
    //     lineHeight: font(20),
    //     textAlign: 'center',
    // },
    // promptBtn: {
    //     marginTop: pixel(10),
    //     height: pixel(38),
    //     borderWidth: 0,
    //     borderRadius: pixel(19),
    //     backgroundColor: '#45C3FF',
    // },
    // promptBtnTitle: {
    //     fontSize: font(15),
    //     color: '#fff',
    // },
});
