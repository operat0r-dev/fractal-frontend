export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string
}

export type LoginRequest = {
    email: string;
    password: string;
}

export type JWTTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
}