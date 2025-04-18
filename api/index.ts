import axios from 'axios';
import { API_URL } from '../constants/api';
import { ErrorResponse } from './types';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const post = async (url: string, body: any) => {
    return new Promise<any>((resolve, reject: (error: ErrorResponse) => void) => {
        api.post(url, {
            "singleRequest": body
        }).then((response) => {
            resolve(response.data);
        }).catch((e) => {
            console.log(JSON.stringify(e));
            reject({
                message: e.response.data.properties.errorMessage,
                status: e.response.data.properties.statusCode
            });
        });
    });
};
