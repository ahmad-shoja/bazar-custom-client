import { post } from ".";

export const reqOtp = async (phone: string) => {
    const response = await post('/GetOtpTokenRequest',
        { getOtpTokenRequest: { username: phone } }
    );
    return response.data;
};



