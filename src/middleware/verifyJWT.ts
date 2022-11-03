import jwt, { Secret } from 'jsonwebtoken'

const verifyJWT = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as Secret,
        (err: any, decoded: any) => {
            if(err) {               
                return res.sendStatus(403); //Invalid token
            }
            req.email = decoded.userInfo.email;
            req.role = decoded.userInfo.role
            next();
        }
    )
}

export default verifyJWT;