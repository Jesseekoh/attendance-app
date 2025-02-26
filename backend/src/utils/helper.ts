import jwt from 'jsonwebtoken';
export function generateAccessToken({
    email,
    id,
}: {
    email: string;
    id: string;
}) {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        throw new Error('Access JWT secret is not defined');
    }
    return jwt.sign({ email, id }, secret, { expiresIn: '15m' });
}

export function generateRefreshToken({
    email,
    id,
}: {
    email: string;
    id: string;
}) {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
        throw new Error('Refresh JWT secret is not defined');
    }
    return jwt.sign({ email, id }, secret);
}
