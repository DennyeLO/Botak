const { sequelize } = require('../../Database/db');
const { checkAuth } = require("../../Util/check-auth");
const { UserInputError } = require('apollo-server');
const Player = require('../../Model/player');
const Deposit = require('../../Model/deposit');
const Wallet = require('../../Model/wallet');
const WalletUserTransaction = require('../../Model/wallet_user_transaction');

const checkPending = async (id_player) => {
    return await Deposit.count({
        where: {
            id_player,
            status: 'pending'
        }
    })
}

const createDeposit = async (id_player, amount) => {
    return await Deposit.create({
        id_player,
        amount,
        status: 'pending'
    });
}

const checkWalletUserTransaction = async (id_player, id_deposit) => {
    const player = await Player.findOne ({
        where: {
            id: id_player
        },
        include: [{
            model: Wallet,
            as: 'Wallet'
        },{
            model: Deposit,
            as: 'Deposit',
            where: {
                id: id_deposit
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
        amount: player.dataValues.Deposit[0].dataValues.amount,
        status: player.dataValues.Deposit[0].dataValues.status,
    }
}

// mutations

const addDepositFromAdmin = async (_, { amount, id_player }, context) => {
    const transaction = await sequelize.transaction();

    try{
        const statusPending = await checkPending(id_player);
        
        if(!statusPending){
            await createDeposit(id_player, amount);
        }else{
            throw 'Deposit still in process';
        }

        await transaction.commit();
        return {
            status: 'Deposit has been made, please wait.'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});   
    }
}

const addDeposit = async (_, { amount }, context) => {
    const transaction = await sequelize.transaction();
    const playerAuth = checkAuth(context);

    try{
        const statusPending = await checkPending(playerAuth.id);
        
        if(!statusPending){
            await createDeposit(playerAuth.id, amount);
        }else{
            throw 'Deposit still in process';
        }

        await transaction.commit();
        return {
            status: 'Deposit has been made, please wait.'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});   
    }
}

const approveDeposit = async (_, { id_deposit, id_player }, context) => {
    const transaction = await sequelize.transaction();
    const userAuth = checkAuth(context);

    try{
        const checkTransaction = await checkWalletUserTransaction(id_player, id_deposit);

        await Deposit.update({
            status: 'approved',
            handle_by: userAuth.username
        },{
            where: {
                id: id_deposit,
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

        // add if status deposit is pending
        if(checkTransaction.status == 'pending'){
            await WalletUserTransaction.create({
                id_wallet: checkTransaction.idWallet,
                opening_balance: balance ? balance.dataValues.closing_balance : 0,
                amount: checkTransaction.amount,
                closing_balance: balance ? balance.dataValues.closing_balance + checkTransaction.amount : checkTransaction.amount,
                type: 'deposit',
            });
        }else{
            throw 'Deposit has been processed';
        }

        await transaction.commit();
        return {
            status: 'Deposit approved'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});   
    }
}

const rejectDeposit = async (_, { id_deposit, id_player }, context) => {
    const transaction = await sequelize.transaction();
    const userAuth = checkAuth(context);

    try{
        const findDeposit = await Deposit.findOne({
            where: {
                id: id_deposit
            }
        });

        const checkUpdate = await Deposit.update({
            status: 'rejected',
            handle_by: userAuth.username
        },{
            where: {
                id: id_deposit,
                id_player: id_player
            }
        });

        if(!findDeposit){
            throw 'Cant found the data';
        }else if(!checkUpdate[0]){
            throw 'Data already update';
        }

        await transaction.commit();
        return {
            status: 'Deposit rejected'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});   
    }
}


const getAllDepositPlayer = async (_, args, context) => {
    const playerAuth = checkAuth(context);

    try{
        return await Deposit.findAll({
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

const getAllDepositPendingPlayer = async (_, args, context) => {
    const playerAuth = checkAuth(context);

    try{
        return await Deposit.findOne({
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

const getDetailDepositPlayer = async (_, { id }, context) => {
    const playerAuth = checkAuth(context);

    try{
        const data = await Deposit.findOne({
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

const getAllDepositUser = async (_, args, context) => {
    try{
        return await Deposit.findAll({
            include: [{
                model: Player,
                as: 'Player'
            }]
        });

    }catch(error){
        throw new UserInputError('Server is error', {errors : error});     
    }
}

const getAllDepositPendingUser = async (_, args, context) => {

    try{
        return await Deposit.findAll({
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

const getDetailDepositUser = async (_, { id_player }, context) => {
    try{
        const data = await Deposit.findOne({
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

const searchDeposit = async (_, { username }, context) => {
    try{
        const data = await Deposit.findAll({
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
    addDepositFromAdmin,
    addDeposit,
    approveDeposit,
    rejectDeposit
  },
  Query: {
    getAllDepositPlayer,
    getAllDepositPendingPlayer,
    getDetailDepositPlayer,
    getAllDepositUser,
    getAllDepositPendingUser,
    getDetailDepositUser,
    searchDeposit
  }
};
