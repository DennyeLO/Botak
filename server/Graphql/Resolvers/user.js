const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { generateRefreshToken, generateToken } = require("../../Util/tokenGenerator")
const { validateRegisterInput, validateLoginInput } = require('../../Util/validators');
const User = require('../../Model/user');

module.exports = {
    Mutation: {
        async loginUser(_, { username, password }, { res }) {
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ where: { username } });

            if (!user) {
                errors.username = 'User not found';
                throw new UserInputError('User not found', { "username": errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.password = 'Wrong crendetials';
                throw new UserInputError('Wrong crendetials', { errors });
            }

            res.cookie('jid', generateRefreshToken(user), { httpOnly: true })

            const token = generateToken(user);

            return {
                id: user.dataValues.id,
                username: user.dataValues.username,
                token
            };


        },
        async registerUser(_,
            {
                registerInput: { username, password, confirmPassword }
            }) {

            // Validate user data
            const { valid, errors } = validateRegisterInput(
                username,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // TODO: Make sure user doesnt already exist
            const user = await User.findOne({ where: { username } });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                password,
                createdAt: new Date().toISOString()
            });


            const res = await newUser.save();
            const token = generateToken(res);

            return {
                id: res.dataValues.id,
                username: res.dataValues.username,
                token
            };
        }
    }
};