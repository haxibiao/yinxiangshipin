/*
 * created by wyk made in 2019-06-21 17:39:19
 */
import AsyncStorage from '@react-native-community/async-storage';
import { RecordKeys, ItemKeys } from './storageKeys';

// keyof typeof RecordKeys
const StorageCache = {} as { -readonly [p in keyof ItemKeys]: any };

async function removeItem(key: keyof ItemKeys) {
    StorageCache[key] = undefined;
    await AsyncStorage.removeItem(key);
    return true;
}

async function setItem(key: keyof ItemKeys, value: any) {
    StorageCache[key] = value;
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return value;
}

async function getItem(key: keyof ItemKeys) {
    if (StorageCache[key]) {
        return StorageCache[key];
    }
    try {
        const results = await AsyncStorage.getItem(key);
        if (results) {
            return JSON.parse(results);
        }
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
