const { sequelize } = require('../../Database/db');
const { UserInputError } = require('apollo-server');
const BankAccount = require('../../Model/bank_account');
const {Op} = require('sequelize');
const Bank = require('../../Model/bank');

// mutations
const addBankAccount = async (_, {input : { id_bank, acc_name, acc_num, bank_type, status }}, context) => {
    const transaction = await sequelize.transaction();

    try{
        const checkBankAccount = await BankAccount.findOne({
            where: {
                [Op.or]: [
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
                await BankAccount.create({
                    id_bank,
                    acc_name,
                    acc_num,
                    bank_type,
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
        console.log(error);
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error}); 
    }
}

const updateBankAccount = async (_, {input : { id, id_bank, acc_name, acc_num, bank_type, status }}, context) => {
    const transaction = await sequelize.transaction();

    try{

        const bankLength = await Bank.findOne({
            where: {
                id: id_bank
            },
            attributes: ['bank_length']
        });

        if(acc_num.length >= bankLength.dataValues.bank_length){
            await BankAccount.update({
                id_bank,
                acc_name,
                acc_num,
                bank_type,
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

const deleteBankAccount = async (_, { id }, context) => {
    const transaction = await sequelize.transaction();

    try{
        const checkBank = await BankAccount.findOne({
            where: {
                id
            }
        });

        if(checkBank){
            await BankAccount.destroy({
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



// query
const getAllBankAccountDeposit = async (_, args, context) => {
    try{
        return await BankAccount.findAll({
            where: {
                bank_type: 'deposit'
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

const getAllBankAccountWithdraw = async (_, args, context) => {
    try{
        return await BankAccount.findAll({
            where: {
                bank_type: 'withdraw'
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

const getAllBankAccount = async (_, args, context) => {
    try{
        return await BankAccount.findAll({
            include: [{
                model: Bank,
                as: 'Bank'
            }]
        });
    }catch(error){
        throw new UserInputError('Server is error', {errors : error});
    }
}

const getDetailBankAccount = async (_, { id }, context) => {
    try{
        const data = await BankAccount.findOne({
            where: {
                id
            },
            include: [{
                model: Bank,
                as: 'Bank'
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
    addBankAccount,
    deleteBankAccount,
    updateBankAccount
  },
  Query: {
    getAllBankAccountDeposit,
    getAllBankAccountWithdraw,
    getAllBankAccount,
    getDetailBankAccount
  }
};
