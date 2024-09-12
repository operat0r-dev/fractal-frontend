import apiClient from "@/apiClient";
import { RegisterRequest, LoginRequest } from "./interfaces/types";

export function useAuthApi() {
    const login = async (values: LoginRequest) => {
        const response = await apiClient.post('/login', values);
        return response
    }

    const register = async (values: RegisterRequest) => {
        const formData = new FormData();
        
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("password_confirmation", values.password_confirmation);

        const response = await apiClient.post('/register',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        return response
    }

    return {
        login,
        register
    }
}