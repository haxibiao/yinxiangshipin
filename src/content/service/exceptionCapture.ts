import { errorMessage } from './errorMessage';

export async function exceptionCapture(asyncFunc: (p?: any) => Promise<any>) {
    try {
        const res = await asyncFunc();
        return [null, res];
    } catch (err) {
        return [{ message: errorMessage(err) }, null];
    }
}
