import bcrypt from 'bcrypt';

let users: any[] = [];
const setUsers = (data: any) => {
    users = data
}

export const handleNewUser = async (req: any, res: any) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) {
        return res.status(400).json({message: 'Username and password are required.'});
    }
    const hasDuplicate = users.includes((person: { email: any; }) => person.email === user);
    if(hasDuplicate) {
        return res.sendStatus(409); //Conflict
    }
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = { email: user, password: hashedPwd};
        setUsers([...users, newUser]);
        console.log(users);
        res.status(201).json({message: `New user ${user} created`});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}