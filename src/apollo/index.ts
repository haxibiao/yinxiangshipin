import React, { useCallback, useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';
import Config from '@src/common/config';
import { appStore } from '@src/store';

export * from './apis';
export { GQL } from './gqls';
export {
    useQuery,
    useMutation,
    useLazyQuery,
    useSubscription,
    useApolloClient,
    ApolloProvider,
} from '@apollo/react-hooks';
export { Query, Mutation } from 'react-apollo';

interface DeviceReport {
    os: string;
    build: number;
    referrer: string;
    version: string;
    appid: string;
    package: string;
    brand: string;
    deviceCountry: string;
    systemVersion: string;
    uniqueId: string;
    deviceId: string;
    ip: string;
}
const deviceHeaders: DeviceReport = {} as DeviceReport;
deviceHeaders.os = Device.OS; // 操作系统
deviceHeaders.build = Config.Build; // 手动修改的build版本号
deviceHeaders.referrer = Config.AppStore; // 应用商店来源
deviceHeaders.version = Config.Version; // 手动修改的App版本号
deviceHeaders.appid = Config.AppID; // app id
deviceHeaders.package = Config.PackageName; // 手动修改的包名
if (!DeviceInfo.isEmulator()) {
    deviceHeaders.brand = DeviceInfo.getBrand(); // 设备品牌
    deviceHeaders.deviceId = DeviceInfo.getDeviceId(); // 获取设备ID
    deviceHeaders.systemVersion = DeviceInfo.getSystemVersion(); // 系统版本
    deviceHeaders.uniqueId = DeviceInfo.getUniqueId(); // uniqueId
}

let netInfo: any;

export function useClientBuilder(userToken: string) {
    const createClient = useCallback((token) => {
        return new ApolloClient({
            uri: Config.ServerRoot + '/gql',
            request: async (operation) => {
                if (!netInfo) {
                    netInfo = await NetInfo.fetch();
                }
                operation.setContext({
                    headers: {
                        token,
                        Authorization: token ? `Bearer ${token}` : '',
                        network: netInfo.type,
                        ...deviceHeaders,
                    },
                });
            },
            onError: ({ graphQLErrors, networkError, operation, forward }) => {
                if (graphQLErrors) {
                    graphQLErrors.map((error) => {
                        // gql error
                    });
                }
                if (networkError) {
                    // checkServer
                }
            },
            cache: new InMemoryCache(),
        });
    }, []);

    const [client, setClient] = useState(() => createClient(userToken));

    useEffect(() => {
        const clientInstance: any = createClient(userToken);
        clientInstance.token = userToken;
        appStore.client = clientInstance;
        setClient(clientInstance);
    }, [userToken]);

    return client;
}
