import { db } from '.';
import { User } from '../models';
import { connect, disconnect } from './db';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces';


export const checkUserEmailPassword = async( email: string, password: string) => {
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) return null;

    if (!bcrypt.compareSync(password, user.password!)) return null;

    const { _id, id, name, role } = user;

    return { id, _id, name, email: email.toLocaleLowerCase(), role }
}

export const getUserByEmail = async(email: string): Promise<IUser | null> => {
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if(!user) {
        return null;
    }

    return JSON.parse(JSON.stringify(user));
}

// Esta funcion verifica el usuario de OAuth
export const oAuthToDbUser = async(oAuthEmail: string, oAuthName: string) => {
    await db.connect();
    const user = await User.findOne({ email: oAuthEmail });

    if (user) {
        await db.disconnect();
        const {_id, name, email, role} = user;
        return {_id, name, email, role};
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });
    await newUser.save()
    await db.disconnect()

    const {_id, name, email, role} = newUser;
    return {_id, name, email, role};
}