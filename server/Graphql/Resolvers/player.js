const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../../Util/validators');
const Player = require('../../Model/player');
const Wallet = require('../../Model/wallet');
const PlayerBankAccount = require('../../Model/player_bank_account');
const { isAuth } = require('../../Util/isAuth');

function generateToken(player) {
    return jwt.sign(
        {
            id: player.dataValues.id,
            player_name: player.dataValues.player_name,
            username: player.dataValues.username
        }, process.env.SECRET_KEY, { expiresIn: '8h' });
}



const loginPlayer = async (_, { username, password }) => {
    const { errors, valid } = validateLoginInput(username, password);

    if (!valid) {
        throw new UserInputError('Errors', { errors });
    }

    const player = await Player.findOne({ where: { username } });

    if (!player) {
        errors.username = 'Player not found';
        throw new UserInputError('Player not found', { "username": errors });
    }

    const match = await bcrypt.compare(password, player.password);
    if (!match) {
        errors.password = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
    }

    const token = generateToken(player);

    return {
        id: player.dataValues.id,
        player_name: player.dataValues.player_name,
        username: player.dataValues.username,
        token
    };
};

const registerPlayer = async (_,
    {
        registerInput: { username, password, player_name }
    }) => {
    // Validate user data
    const { valid, errors } = validateRegisterInput(
        username,
        password,
        player_name
    );

    if (!valid) {
        throw new UserInputError('Errors', { errors });
    }
    // TODO: Make sure user doesnt already exist
    const player = await Player.findOne({ where: { username } });
    if (player) {
        throw new UserInputError('Username is taken', {
            errors: {
                username: 'This username is taken'
            }
        });
    }
    // hash password and create an auth token
    password = await bcrypt.hash(password, 12);

    const newPlayer = new Player({
        username,
        password,
        player_name
    });


    const res = await newPlayer.save();

    // Wallet
    const newWallet = new Wallet({
        id_player: res.dataValues.id
    });
    await newWallet.save();

    // Player Bank Account

    const newPlayerBankAccount = new PlayerBankAccount({
        id_player: res.dataValues.id,
        id_bank: id_bank,
        acc_name: acc_name,
        acc_num: acc_num
    });
    await newPlayerBankAccount.save();

    const token = generateToken(res);

    return {
        id: res.dataValues.id,
        player_name: res.dataValues.player_name,
        username: res.dataValues.username,
        token
    };
}

const updatePlayer = async (_, { input: { id, player_name } }, context) => {
    try {
        await Player.update({
            player_name
        }, {
            where: {
                id
            }
        });

        return {
            status: 'Data succesful update'
        }
    } catch (error) {
        throw new UserInputError('Server is error', { errors: error });
    }
}


const setBannedPlayer = async (_, { id, status }, context) => {
    try {
        await Player.update({
            status
        }, {
            where: {
                id
            }
        });

        return {
            status: 'Data succesful update'
        }
    } catch (error) {
        throw new UserInputError('Server is error', { errors: error });
    }
}

const getAllPlayer = async (_, args, context) => {
    isAuth(context)
    try {
        return await Player.findAll();
    } catch (error) {
        throw new UserInputError('Server is error', { errors: error });
    }
}


const getDetailPlayer = async (_, { id }, context) => {
    try {
        return await Player.findOne({
            where: {
                id
            }
        });
    } catch (error) {
        throw new UserInputError('Server is error', { errors: error });
    }
}

const searchPlayer = async (_, { username }, context) => {
    try {
        return await Player.findOne({
            where: {
                username: username
            }
        });
    } catch (error) {
        throw new UserInputError('Server is error', { errors: error });
    }
}

module.exports = {
    Mutation: {
        loginPlayer,
        registerPlayer,
        setBannedPlayer,
        updatePlayer
    },
    Query: {
        getAllPlayer,
        getDetailPlayer,
        searchPlayer
    }
};