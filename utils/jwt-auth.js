import jwt from 'jsonwebtoken';

export const generateToken = (data, res) => {
    try {
        console.log("data", data);
        const jwtData = jwt.sign({ data }, process.env.JWTKEY, {
            expiresIn: "10h"
        });

        res.cookie('user-auth', jwtData, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict"
        });
    } catch (error) {
        console.log("Generate Token", error);
    }
}