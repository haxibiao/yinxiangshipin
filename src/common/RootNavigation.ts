import * as React from 'react';
const privateRoutes = {
    Wallet: true,
    CommentNotification: true,
    FollowNotification: true,
    BeLikedNotification: true,
    systemRemindNotification: true,
    EditUserData: true,
    Chat: true,
    喜欢: true,
    找回密码: true,
    获取验证码: true,
    Feedback: true,
};

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.navigate(name, params);
    } else {
        // You can decide what to do if the app hasn't mounted
        // You can ignore this, or add these actions to a queue you can call later
    }
}

export const authNavigate = (name: string, params?: object) => {
    if (privateRoutes[name] && !TOKEN) {
        navigate(name, params);
    } else {
        navigate('Login');
    }
};
