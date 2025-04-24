import axios from 'axios';
import { API_URL } from '../constants/api';
import { ErrorResponse } from './types';
import { properties } from './constants';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const post = async (url: string, body: any, token?: string) => {
    return new Promise<any>((resolve, reject: (error: ErrorResponse) => void) => {
        api.post(url, {
            properties,
            "singleRequest": body
        }, {
            headers: token ? {
                'Authorization': `Bearer ${token}`
            } : {}
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
