const { sequelize } = require('../../Database/db');
const { UserInputError } = require('apollo-server');
const PlayerBankAccount = require('../../Model/player_bank_account');
const {Op} = require('sequelize');
const Bank = require('../../Model/bank');

// mutations
const addPlayerBankAccount = async (_, {input : { id_player, id_bank, acc_name, acc_num, status }}, context) => {
    const transaction = await sequelize.transaction();

    try{
        const checkBankAccount = await PlayerBankAccount.findOne({
            where: {
                [Op.and]: [
                    { id_player: id_player },
                    { acc_name: acc_name },
                    { acc_num: acc_num }
                ]
            }
        });

        const bankLength = await Bank.findOne({
            where: {
                id: id_bank
            },
            attributes: ['bank_length']
        });

        if(!checkBankAccount){
            if(acc_num.length >= bankLength.dataValues.bank_length){
                await PlayerBankAccount.create({
                    id_player,
                    id_bank,
                    acc_name,
                    acc_num,
                    status
                });
            }else{
                throw `Account number length must ${bankLength.dataValues.bank_length}`
            }
        }else{
            throw 'Account name or number was used';
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

const updatePlayerBankAccount = async (_, {input : { id, id_bank, acc_name, acc_num, bank_type, status }}, context) => {
    const transaction = await sequelize.transaction();

    try{
        const bankLength = await Bank.findOne({
            where: {
                id: id_bank
            },
            attributes: ['bank_length']
        });

        if(acc_num.length >= bankLength.dataValues.bank_length){
            await PlayerBankAccount.update({
                id_bank,
                acc_name,
                acc_num,
                status
            },{
                where: {
                    id
                }
            });
        }else{
            throw `Account number length must ${bankLength.dataValues.bank_length}`
        }

        await transaction.commit();
        return {
            status: 'Data succesful update'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error}); 
    }
}

const deletePlayerBankAccount = async (_, { id }, context) => {
    const transaction = await sequelize.transaction();

    try{
        const checkBank = await PlayerBankAccount.findOne({
            where: {
                id
            }
        });

        if(checkBank){
            await PlayerBankAccount.destroy({
                where: {
                    id
                }
            });
        }else{
            throw 'Data not found';
        }

        await transaction.commit();
        return {
            status: 'Data succesful delete'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error}); 
    }
}

const getAllPlayerBankAccount = async (_, { id }, context) => {
    try{
        return await PlayerBankAccount.findAll({
            where: {
                id_player: id
            },
            include: [{
                model: Bank,
                as: 'Bank'
            }]
        });
    }catch(error){
        throw new UserInputError('Server is error', {errors : error}); 
    }
}

const getDetailPlayerBankAccount = async (_, { id, id_player }, context) => {

    try{
        return await PlayerBankAccount.findOne({
            where: {
                id,
                id_player
            }
        });
    }catch(error){
        throw new UserInputError('Server is error', {errors : error}); 
    }
}

module.exports = {
  Mutation: {
    addPlayerBankAccount,
    deletePlayerBankAccount,
    updatePlayerBankAccount
  },

  Query: {
    getAllPlayerBankAccount,
    getDetailPlayerBankAccount
  }
};
