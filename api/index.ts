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

export const post = async <T = any>(url: string, body: any, token?: string, headers?: Record<string, string>): Promise<T> => {
    return new Promise<T>((resolve, reject: (error: ErrorResponse) => void) => {
        api.post(url, {
            "singleRequest": body
        }, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : undefined,
                ...headers,
            }
        }).then((response) => {
            resolve(response.data);
        }).catch((e) => {
            reject({
                message: e.response.data.properties.errorMessage,
                status: e.response.data.properties.statusCode
            });
        });
    });
};
