import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeText, HxfButton } from '@src/components';
import { playAdvertVideo, getTaskReward, getUserReward } from '@src/common';
import { useNavigation } from '@react-navigation/native';
// import { Overlay } from 'teaset';

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
                    <SafeText numberOfLines={1} style={styles.taskTitle}>
                        {task.name}
                    </SafeText>
                    <View style={styles.taskReward}>
                        <Image
                            source={require('@app/assets/images/icon_wallet_dmb.png')}
                            style={styles.taskRewardIcon}
                        />
                        <SafeText numberOfLines={1} style={styles.taskRewardGold}>
                            {task?.reward_info?.gold}
                        </SafeText>
                    </View>
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
                <Text numberOfLines={1} style={styles.taskName}>
                    {taskState.countdown > 0 ? taskState.countdown : taskState.btnName}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function useTaskState(task) {
    const navigation = useNavigation();
    const taskInterval = useRef(task?.next_reward_video_time || 0);
    const [countdown, setCountdown] = useState(taskInterval.current);

    const btnName = useMemo(() => {
        if (task.assignment_status === 2) {
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

    const gotTaskReward = useCallback(() => {
        getTaskReward(task.id);
    }, [task]);

    const gotVideoReward = useCallback(video => {
        const rewardType = video.ad_click ? 'WATCH_REWARD_VIDEO' : 'WATCH_REWARD_VIDEO';
        getUserReward(rewardType);
    }, []);

    // 做任务 跳转页面/观看激励视频
    const doTask = useCallback(() => {
        const route = taskRouteInfo[btnName];
        if (route) {
            navigation.navigate(...route);
        } else if (task.id === 7) {
            if (taskInterval.current > 0) {
                Toast.show({ content: '请稍后再试' });
            } else {
                playAdvertVideo({ callback: gotVideoReward });
            }
        } else {
            Toast.show({ content: '请前往完成任务' });
        }
    }, [btnName, task]);

    const callback = useCallback(() => {
        // 根据任务状态执行不同操作
        switch (task.assignment_status) {
            case 0:
            case 1:
                doTask();
                break;
            case 2:
                gotTaskReward();
                break;
            default:
                Toast.show({ content: '请前往完成任务' });
                break;
        }
    }, [doTask, gotTaskReward]);

    return [{ btnName, btnColor, countdown }, callback];
}

// resolve.submit_name
const taskColor = {
    新人任务: '#2FC6FC',
    每日任务: '#FF5E7D',
    自定义任务: '#12E2BB',
};

const taskRouteInfo = {
    去修改: ['EditProfile'],
    去发布: ['CreatePost'],
    去提问: ['WriteIssue'],
    写回答: ['Find', { tabLabelIndex: 3 }],
    去绑定: ['BindingAccount'],
    去好评: ['Praise'],
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
        fontSize: font(16),
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
        backgroundColor: '#fefabd',
    },
    taskRewardIcon: {
        height: pixel(14),
        width: pixel(14),
    },
    taskRewardGold: {
        color: '#ffaf00',
        fontSize: font(12),
        fontWeight: 'bold',
        paddingHorizontal: pixel(2),
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
