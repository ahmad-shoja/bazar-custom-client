import axios from 'axios';
import { API_URL } from '../constants/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const post = async (url: string, body: any) => {
    const response = await api.post(url, {
        "singleRequest": body
    });
    return response.data;
};

