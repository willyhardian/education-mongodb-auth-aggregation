const database = require("../config/mongo");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class User {
    static getDatabase() {
        return database.collection("users");
    }

    static async register(email, password, createdAt, updatedAt) {
        const emailExist = await this.getDatabase().findOne({ email });
        if (emailExist) {
            const message = "Email already registered";
            throw new GraphQLError(message, {
                extensions: {
                    code: "BAD_REQUEST",
                    http: {
                        status: 400,
                    },
                },
            });
        }
        const passwordHashed = hashPassword(password);

        const user = await this.getDatabase().insertOne({
            email,
            password: passwordHashed,
            createdAt,
            updatedAt,
        });
        return user;
    }

    static async login(email, password) {
        const user = await this.getDatabase().findOne({ email });
        if (!user) {
            const message = "Email not registered";
            throw new GraphQLError(message, {
                extensions: {
                    code: "BAD_REQUEST",
                    http: {
                        status: 400,
                    },
                },
            });
        }
        const compare = comparePassword(password, user.password);
        if (!compare) {
            const message = "Invalid password";
            throw new GraphQLError(message, {
                extensions: {
                    code: "BAD_REQUEST",
                    http: {
                        status: 400,
                    },
                },
            });
        }
        const payload = { id: user._id, email: user.email };
        const token = signToken(payload);

        return {
            access_token: token,
        };
    }
}

module.exports = User;
