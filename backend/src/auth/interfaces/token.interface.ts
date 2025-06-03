export interface RefreshTokenPayload {
    token: string;
    exp: bigint | number;
}

export interface TokensInterface {
    accessToken: string;
    refreshToken: RefreshTokenPayload;
}
