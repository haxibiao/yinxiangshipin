// useClientApi ： 自定义数据请求hooks：使用Apollo Client发起操作，内部维护了请求状态。

import { useState, useReducer, useEffect, useCallback } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

interface QueryProps {
    query: any;
    variables: {
        [key: string]: any;
    };
    options: any;
}

interface MutationProps {
    mutation: any;
    variables: {
        [key: string]: any;
    };
    options: any;
}

type ClientProps = QueryProps | MutationProps;

type actionType = 'FETCH_INIT' | 'FETCH_SUCCESS' | 'FETCH_FAILURE';

interface Action {
    type: actionType;
    payload?: any;
}

const clientAction = function(client: any, option: ClientProps) {
    if ((option as QueryProps).query) {
        return client.query({
            ...option,
        });
    } else {
        return client.mutate({
            ...option,
        });
    }
};

const dataFetchReducer = (state: any, action: Action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                data: action.payload,
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            throw new Error();
    }
};

export function useApolloApi(option: ClientProps, initialData: any) {
    const client = useApolloClient();

    const [variables, setVariables] = useState(option.variables);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        loading: false,
        error: false,
        data: initialData,
    });

    const action = useCallback(() => {
        return clientAction(client, { ...option, variables });
    }, [client, variables]);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' });
            try {
                const result = await action();
                if (!didCancel) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
                }
            } catch (error) {
                if (!didCancel) {
                    dispatch({ type: 'FETCH_FAILURE', payload: error });
                }
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, [action]);

    return [state, setVariables];
}

export function useFetchApi(initialUrl: string, initialData: any) {
    const [url, setUrl] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        data: initialData,
    });

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' });
            try {
                const result = await fetch(url);
                if (!didCancel) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: result });
                }
            } catch (error) {
                if (!didCancel) {
                    dispatch({ type: 'FETCH_FAILURE', payload: error });
                }
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, [url]);

    return [state, setUrl];
}
