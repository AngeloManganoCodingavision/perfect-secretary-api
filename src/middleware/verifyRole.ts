const verifyRole = (...allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
        if(!req?.role) {
            return res.sendStatus(401);
        }
        const rolesArray = [...allowedRoles];
        if(!rolesArray.includes(req.role)) {
            return res.sendStatus(401);   
        }
        next();
    }
}

export default verifyRole;