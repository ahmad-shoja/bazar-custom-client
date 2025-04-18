import AsyncStorage from '@react-native-async-storage/async-storage';



export const saveUserPreferences = async (key: string, preferences: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(preferences);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('Error saving user preferences:', error);
        throw error;
    }
};

export const getUserPreferences = async (key: string): Promise<any> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error reading user preferences:', error);
        return null;
    }
};

export const removeUserPreferences = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing user preferences:', error);
        throw error;
    }
};


