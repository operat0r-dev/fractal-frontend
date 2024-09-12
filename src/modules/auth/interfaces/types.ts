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