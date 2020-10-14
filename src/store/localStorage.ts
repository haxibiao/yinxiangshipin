/*
 * @flow
 * created by wyk made in 2019-06-21 17:39:19
 */
import AsyncStorage from '@react-native-community/async-storage';

export interface ItemKeys {
    me: string;
    taskGuide: string;
    appVersion: string;
    notFirstInstall: string;
    viewedVersion: string | number;
    createPostGuidance: string;
    agreeCreatePostAgreement: string;
    showSplash: string;
    searchRecord: string;
    spiderVideoTaskGuided: string;
    isLocalSpiderVideo: string;
    detectedQRCodeRecord: string;
    bindAccountRemind: string;
    disabledBindAccount: string;
}

export const Keys = {
    me: 'me',
    taskGuide: 'taskGuide',
    appVersion: 'appVersion',
    notFirstInstall: 'notFirstInstall',
    viewedVersion: 'viewedVersion',
    createPostGuidance: 'createPostGuidance',
    agreeCreatePostAgreement: 'agreeCreatePostAgreement',
    showSplash: 'showSplash',
    searchRecord: 'searchRecord',
    spiderVideoTaskGuided: 'spiderVideoTaskGuided',
    isLocalSpiderVideo: 'isLocalSpiderVideo',
    detectedQRCodeRecord: 'detectedQRCodeRecord',
    bindAccountRemind: 'bindAccountRemind',
    disabledBindAccount: 'disabledBindAccount',
} as const;

async function removeItem(key: keyof ItemKeys) {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`It was removed ${key} successfully`);
        return true;
    } catch (error) {
        console.log(`It was removed ${key} failure`);
    }
}

async function setItem(key: keyof ItemKeys, value: any) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        console.log(`It was saved ${key} successfully`);
        return value;
    } catch (error) {
        console.log(`It was saved ${key} failure`);
    }
}

async function getItem(key: keyof ItemKeys) {
    let results: any;
    try {
        results = await AsyncStorage.getItem(key);
        return JSON.parse(results);
    } catch (error) {
        return null;
    }
}

async function clearAll() {
    return AsyncStorage.clear();
}

export const Storage = {
    removeItem,
    getItem,
    setItem,
    clearAll,
};
