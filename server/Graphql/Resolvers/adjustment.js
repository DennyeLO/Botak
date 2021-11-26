const { sequelize } = require('../../Database/db');
const { UserInputError } = require('apollo-server');
const Adjustment = require('../../Model/adjustment');
const Player = require('../../Model/player');
const Wallet = require('../../Model/wallet');
const WalletUserTransaction = require('../../Model/wallet_user_transaction');


const getAllAdjustment = async (_, args, context) => {
    return await Adjustment.findAll({
        include: [{
            model: Player,
            as: 'Player'
        }]
    });
}

const addAdjustment = async (_,  {input : { id_player, type, amount, note }}, context) => {
    const transaction = await sequelize.transaction();
    
    try{
        const checkPlayerWallet = await Player.count({
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

        const balancePlayer = await Player.findOne({
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

        if(checkPlayerWallet){
            if(balancePlayer.dataValues.Wallet.dataValues.WalletUserTransaction.length){
                const lengthRow = balancePlayer.dataValues.Wallet.dataValues.WalletUserTransaction.length;
                const checkBalance = balancePlayer.dataValues.Wallet.dataValues.WalletUserTransaction[lengthRow - 1].dataValues.closing_balance;
                
                if(amount > checkBalance && type == 'deduction' && checkBalance != 0){
                    await Adjustment.create({
                        id_player,
                        type,
                        amount,
                        affect_amount: checkBalance,
                        note
                    });
    
                    await WalletUserTransaction.create({
                        id_wallet: balancePlayer.dataValues.Wallet.id,
                        opening_balance: checkBalance,
                        amount: checkBalance,
                        closing_balance: 0,
                        type: 'adjustment_' + type
                    });
                }else if(amount < checkBalance && type == 'deduction'){
                    await Adjustment.create({
                        id_player,
                        type,
                        amount,
                        affect_amount: amount,
                        note
                    });
    
                    await WalletUserTransaction.create({
                        id_wallet: balancePlayer.dataValues.Wallet.id,
                        opening_balance: checkBalance,
                        amount,
                        closing_balance: checkBalance - amount,
                        type: 'adjustment_' + type
                    });
                }else if(checkBalance == 0 && type == 'deduction'){
                    throw 'Cant adjustment, player dont have any balance';
                }else{
                    await Adjustment.create({
                        id_player,
                        type,
                        amount,
                        affect_amount: amount,
                        note
                    });
    
                    await WalletUserTransaction.create({
                        id_wallet: balancePlayer.dataValues.Wallet.id,
                        opening_balance: checkBalance,
                        amount,
                        closing_balance: checkBalance + amount,
                        type: 'adjustment_' + type
                    });
                }
            }else{
                throw 'Cant adjustment, player dont have any balance';
            }
        }else{
            throw 'Cant adjustment, player dont have any balance';
        }

        await transaction.commit();
        return {
            status: 'Data succesful add'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});
    }
}

module.exports = {
    Query: {
        getAllAdjustment
    },

    Mutation: {
        addAdjustment,
    }
};
