import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import db from '../../firebase';
import { User } from '../models/User';

const usersRef = db.collection('users');

export const handleLogin = (req: any, res: any) => {
    const { email, pwd } = req.body;
    if(!email || !pwd) {
        return res.status(400).json({message: 'Email and password are required.'});
    }
    let admin: User | undefined = undefined;
    usersRef.get()
    .then((response) => {
        response.forEach((user) => {
            admin = user.data() as User;
        });
        const isUserExist = admin!.email === email;
        if(!isUserExist) {
            return;
        }
        return bcrypt.compare(pwd, admin!.password);
    })
    .then((isPwdMached) => {       
        if(isPwdMached) {
            const accessToken = jwt.sign(
                    {
                        userInfo: {
                            email: admin!.email,
                            role: admin!.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET as Secret,
                    { expiresIn: '1h' }
                );
            const refreshToken = jwt.sign(
                    {'email': admin!.email},
                    process.env.REFRESH_TOKEN_SECRET as Secret,
                    { expiresIn: '1d' }
                );
            res.cookie('jwt', refreshToken, {httpOnly:true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
            res.status(200).json({accessToken});
        } else {
            res.sendStatus(401);
        }
    })
    .catch((error: any) => {       
        res.status(500).json({message: error.message});
    });
}

export const handleRefreshToken = (req: any, res: any) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;
    let admin: User | undefined = undefined;
    usersRef.get()
    .then((response) => {
        response.forEach((user) => {
            admin = user.data() as User;
        });
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret,
            (err: any) => {
                if(err) {               
                    return res.sendStatus(403); //Invalid token
                }
                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            email: admin!.email,
                            role: admin!.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET as Secret,
                    { expiresIn: '1h' }
                );
                res.status(200).json({accessToken});
            }
        )
    })
    .catch((error: any) => {
        res.status(500).json({message: error.message});
    });
}