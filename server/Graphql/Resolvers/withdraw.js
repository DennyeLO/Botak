const { sequelize } = require('../../Database/db');
const { checkAuth } = require("../../Util/check-auth");
const { UserInputError } = require('apollo-server');
const Player = require('../../Model/player');
const Withdraw = require('../../Model/withdraw');
const Wallet = require('../../Model/wallet');
const WalletUserTransaction = require('../../Model/wallet_user_transaction');

const checkPending = async (id_player) => {
    return await Withdraw.count({
        where: {
            id_player,
            status: 'pending'
        }
    })
}

const createWithdraw = async (id_player, amount) => {
    return await Withdraw.create({
        id_player,
        amount,
        status: 'pending'
    });
}

const checkWalletUserTransaction = async (id_player, id_withdraw) => {
    const player = await Player.findOne ({
        where: {
            id: id_player
        },
        include: [{
            model: Wallet,
            as: 'Wallet'
        },{
            model: Withdraw,
            as: 'Withdraw',
            where: {
                id: id_withdraw
            }
        }]
    });


    const checkWalletUserTransaction = await WalletUserTransaction.count({
        where: {
            id_wallet: player.dataValues.Wallet.dataValues.id
        }
    });

    return {
        available: checkWalletUserTransaction,
        idWallet: player.dataValues.Wallet.dataValues.id,
        amount: player.dataValues.Withdraw[0].dataValues.amount,
        status: player.dataValues.Withdraw[0].dataValues.status,
    }
}

// mutations
const addWithdrawFromAdmin = async (_, { amount,id_player }, context) => {
    const transaction = await sequelize.transaction();

    try{
        const statusPending = await checkPending(id_player);
        
        const checkTransaction = await Player.findOne({
            where: {
                id: id_player
            },
            include: [{
                model: Wallet,
                as: 'Wallet',
                include: [{
                    model: WalletUserTransaction,
                    as: 'WalletUserTransaction'
                }]
            }]
        });


        const lengthTransaction = checkTransaction.dataValues.Wallet.dataValues.WalletUserTransaction.length;
        
        if(lengthTransaction){
            const checkBalance = checkTransaction.dataValues.Wallet.dataValues.WalletUserTransaction[lengthTransaction - 1].dataValues.closing_balance;

            if(amount <= checkBalance){
                if(!statusPending){
                    await createWithdraw(id_player, amount);
                }else{
                    throw 'Withdraw still in process';
                }
            }else{
                throw 'Balance is not enough';
            }
        }else{
            throw 'You must deposit first';
        }

        await transaction.commit();
        return {
            status: 'Withdraw has been made, please wait.'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});   
    }
}

const addWithdraw = async (_, { amount }, context) => {
    const transaction = await sequelize.transaction();
    const playerAuth = checkAuth(context);

    try{
        const statusPending = await checkPending(playerAuth.id);
        
        const checkTransaction = await Player.findOne({
            where: {
                id: playerAuth.id
            },
            include: [{
                model: Wallet,
                as: 'Wallet',
                include: [{
                    model: WalletUserTransaction,
                    as: 'WalletUserTransaction'
                }]
            }]
        });


        const lengthTransaction = checkTransaction.dataValues.Wallet.dataValues.WalletUserTransaction.length;
        
        if(lengthTransaction){
            const checkBalance = checkTransaction.dataValues.Wallet.dataValues.WalletUserTransaction[lengthTransaction - 1].dataValues.closing_balance;

            if(amount <= checkBalance){
                if(!statusPending){
                    await createWithdraw(playerAuth.id, amount);
                }else{
                    throw 'Withdraw still in process';
                }
            }else{
                throw 'Balance is not enough';
            }
        }else{
            throw 'You must deposit first';
        }

        await transaction.commit();
        return {
            status: 'Withdraw has been made, please wait.'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});   
    }
}

const approveWithdraw = async (_, { id_withdraw, id_player }, context) => {
    const transaction = await sequelize.transaction();
    const userAuth = checkAuth(context);

    try{
        const checkTransaction = await checkWalletUserTransaction(id_player, id_withdraw);

        await Withdraw.update({
            status: 'approved',
            handle_by: userAuth.username
        },{
            where: {
                id: id_withdraw,
                id_player: id_player
            }
        });

        // check in table wallet_user_transaction
        const balance = checkTransaction.available ? await WalletUserTransaction.findOne({
            where: {
                id_wallet: checkTransaction.idWallet
            },
            order: [[ 'id', 'DESC' ]]
        }) : 0;

        // add if status withdraw is pending
        if(checkTransaction.status == 'pending'){
            await WalletUserTransaction.create({
                id_wallet: checkTransaction.idWallet,
                opening_balance: balance.dataValues.closing_balance,
                amount: checkTransaction.amount,
                closing_balance: balance.dataValues.closing_balance - checkTransaction.amount,
                type: 'withdraw',
            });
        }else{
            throw 'Withdraw has been processed';
        }

        await transaction.commit();
        return {
            status: 'Withdraw approved'
        }
    }catch(error){
        console.log(error);
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});   
    }
}

const rejectWithdraw = async (_, { id_withdraw, id_player }, context) => {
    const transaction = await sequelize.transaction();
    const userAuth = checkAuth(context);

    try{
        const findWithdraw = await Withdraw.findOne({
            where: {
                id: id_withdraw
            }
        });

        const checkUpdate = await Withdraw.update({
            status: 'rejected',
            handle_by: userAuth.username
        },{
            where: {
                id: id_withdraw,
                id_player
            }
        });

        if(!findWithdraw){
            throw 'Cant found the data';
        }else if(!checkUpdate[0]){
            throw 'Data already update';
        }

        await transaction.commit();
        return {
            status: 'Withdraw rejected'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});   
    }
}


const getAllWithdrawPlayer = async (_, args, context) => {
    const playerAuth = checkAuth(context);

    try{
        return await Withdraw.findAll({
            where: {
                id_player: playerAuth.id
            },
            include: [{
                model: Player,
                as: 'Player'
            }]
        });
    }catch(error){
        throw new UserInputError('Server is error', {errors : error});     
    }
}

const getWithdrawPendingPlayer = async (_, args, context) => {
    const playerAuth = checkAuth(context);

    try{
        return await Withdraw.findOne({
            where: {
                id_player: playerAuth.id,
                status: 'pending'
            },
            include: [{
                model: Player,
                as: 'Player'
            }]
        });
    }catch(error){
        throw new UserInputError('Server is error', {errors : error});     
    }
}

const getDetailWithdrawPlayer = async (_, { id }, context) => {
    const playerAuth = checkAuth(context);

    try{
        const data = await Withdraw.findOne({
            where: {
                id,
                id_player: playerAuth.id
            },
            include: [{
                model: Player,
                as: 'Player'
            }]
        });

        if(data){
            return data;
        }else{
            throw 'Data not found';
        }
    }catch(error){
        throw new UserInputError('Server is error', {errors : error});     
    }
}

const getAllWithdrawUser = async (_, args, context) => {
    try{
        return await Withdraw.findAll({
            include: [{
                model: Player,
                as: 'Player'
            }]
        });

    }catch(error){
        throw new UserInputError('Server is error', {errors : error});     
    }
}

const getAllWithdrawPendingUser = async (_, args, context) => {

    try{
        return await Withdraw.findAll({
            where: {
                status: 'pending'
            },
            include: [{
                model: Player,
                as: 'Player'
            }]
        });
    }catch(error){
        throw new UserInputError('Server is error', {errors : error});     
    }
}

const getDetailWithdrawUser = async (_, { id_player }, context) => {
    try{
        const data = await Withdraw.findOne({
            where: {
                id_player
            },
            include: [{
                model: Player,
                as: 'Player'
            }]
        });

        if(data){
            return data;
        }else{
            throw 'Data not found';
        }
    }catch(error){
        throw new UserInputError('Server is error', {errors : error});     
    }
}

const searchWithdraw = async (_, { username }, context) => {
    try{
        const data = await Withdraw.findAll({
            include: [{
                model: Player,
                as: 'Player',
                where: {
                    username
                }
            }]
        });

        if(data){
            return data;
        }else{
            throw 'Data not found';
        }
    }catch(error){
        throw new UserInputError('Server is error', {errors : error});     
    }
}

module.exports = {

  Mutation: {
    addWithdrawFromAdmin,
    addWithdraw,
    approveWithdraw,
    rejectWithdraw
  },
  Query: {
    getAllWithdrawPlayer,
    getWithdrawPendingPlayer,
    getDetailWithdrawPlayer,
    getAllWithdrawUser,
    getAllWithdrawPendingUser,
    getDetailWithdrawUser,
    searchWithdraw
  }
};
