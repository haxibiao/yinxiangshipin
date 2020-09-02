interface Error {
    [key: string]: any;
}

export function errorMessage(err: string | Error, message = '请求失败') {
    let content = message;
    if (typeof err === 'string') {
        content = err.replace('GraphQL error: ', '');
    } else if (err !== null && typeof err === 'object' && typeof err.message === 'string') {
        content = err.message.replace('GraphQL error: ', '');
    }

    return content;
}
