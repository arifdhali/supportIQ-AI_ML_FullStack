const { success } = require("../utils/response")
const bcrypt = require("bcrypt")
const {Users} = require("../models")
const jwt = require("jsonwebtoken")
 const LoginController = async (req, res, next) => {
     try {
        const { email, password } = req.body ?? {};

        let isUser = await Users.findOne({
            where: { email: email, status: 1, roles: "agent" },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
        });
        if (!isUser) {
            const error = new Error("This user does not exists");
            error.status = 401;
            throw error;
        }
        let compare_password = await bcrypt.compare(password, isUser.password);
        if (!compare_password) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }

        
        delete isUser.password;

        const payload = {
            id: isUser?.id,
            user_name: isUser?.email,
            role_type: isUser.roles,
        }
        let token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in prod
            sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
            path: "/",
        });
        return success(res, null, "Login successful", 200);

    } catch (error) {
        console.log(error)
        next(error);
    }

}

module.exports = { LoginController }