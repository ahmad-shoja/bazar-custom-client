import { post } from ".";
import { GetAccessTokenResponse, GetAccessTokenResult, GetOtpResponse, GetOtpResult, VerifyOtpResponse, VerifyOtpResult } from "./types";

export const reqOtp = async (phone: string): Promise<GetOtpResult> => {
    return new Promise(async (resolve, reject) => {
        post('/GetOtpTokenRequest',
            { getOtpTokenRequest: { username: phone } }
        ).then((response: any) => {
            const typedResponse = response as GetOtpResponse;
            const { waitingSeconds, callIsEnabled } = typedResponse.singleReply.getOtpTokenReply;
            resolve({
                waitingSeconds,
                callIsEnabled
            });
        }).catch(({ message, status }) => {
            reject(`${status}: ${message}`);
        });
    });
};



export const verifyOtp = async (phone: string, otp: string): Promise<VerifyOtpResult> => {
    return new Promise(async (resolve, reject) => {
        post('/verifyOtpTokenRequest',
            { verifyOtpTokenRequest: { username: phone, token: otp } }
        ).then((response: any) => {
            const typedResponse = response as VerifyOtpResponse;
            const { accessToken, refreshToken, waitingSeconds } = typedResponse.singleReply.verifyOtpTokenReply;
            resolve({
                token: accessToken,
                refreshToken,
                waitingSeconds
            });
        }).catch(({ message, status }) => {
            reject(`${status}: ${message}`);
        });
    });
};




export const getAccessToken = async (refreshToken: string): Promise<GetAccessTokenResult> => {
    return new Promise(async (resolve, reject) => {
        post('/getAccessTokenRequest',
            { getAccessTokenRequest: { refreshToken } }
        ).then((response: any) => {
            const typedResponse = response as GetAccessTokenResponse;
            const { accessToken } = typedResponse.singleReply.getAccessTokenReply;
            resolve({ token: accessToken });
        }).catch(({ message, status }) => {
            reject(`${status}: ${message}`);
        });
    });
};





