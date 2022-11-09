import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import db from '../../firebase';
import { CustomError } from '../models/CustomError';
import { User } from '../models/User';

const usersRef = db.collection('users');

export const handleLogin = (req: any, res: any, next: any) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            throw new CustomError('Email and password are required.', 400);
        }
    } catch (error: any) {
        return next(error);
    }
    let user: User | undefined = undefined;
    usersRef.get()
    .then((response) => {
        response.forEach((element) => {
            user = element.data() as User;
        });
        const isUserExist = user!.email === email;
        if(!isUserExist) {
            throw new CustomError('L\'email non è registrata.', 401);
        }
        return bcrypt.compare(password, user!.password);
    })
    .then((isPwdMached) => {       
        if(isPwdMached) {
            const accessToken = jwt.sign(
                    {
                        userInfo: {
                            email: user!.email,
                            role: user!.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET as Secret,
                    { expiresIn: '1h' }
                );
            const refreshToken = jwt.sign(
                    {'email': user!.email},
                    process.env.REFRESH_TOKEN_SECRET as Secret,
                    { expiresIn: '1d' }
                );
            res.cookie('jwt', refreshToken, {httpOnly:true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }) // Eliminare la flag secure quando si fa la chiamata non in Https
            res.status(200).json({data: { accessToken, user}, message: 'Login effettuato'});
        } else {
            throw new CustomError('La password è sbagliata.', 401);
        }
    })
    .catch((error) => {       
        next(error);
    });
}

export const handleRefreshToken = (req: any, res: any, next: any) => {
    const cookies = req.cookies;
    try {
        if(!cookies?.jwt) {
            throw new CustomError('Token per il refresh non presente', 401);
        }
    } catch (error: any) {
        return next(error);
    }
    const refreshToken = cookies.jwt;
    let user: User | undefined = undefined;
    usersRef.get()
    .then((response) => {
        response.forEach((element) => {
            user = element.data() as User;
        });
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret,
            (err: any) => {
                if(err) {        
                    throw new CustomError('Token non valido', 403);       
                }
                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            email: user!.email,
                            role: user!.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET as Secret,
                    { expiresIn: '1h' }
                );
                res.status(200).json({data: {accessToken}, message: 'Refresh token effettuato'});
            }
        )
    })
    .catch((error) => {       
        next(error);
    });
}