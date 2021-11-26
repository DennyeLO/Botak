const { sequelize } = require('../../Database/db');
const { checkAuth } = require("../../Util/check-auth");
const { UserInputError } = require('apollo-server');
const Bank = require('../../Model/bank');


// mutations
const addBank = async (_, {input : { name_bank, description, bank_length }}, context) => {
    const transaction = await sequelize.transaction();

    try{
        const checkBank = await Bank.findOne({
            where: {
                name_bank
            }
        });

        if(!checkBank){
            await Bank.create({
                name_bank,
                description,
                bank_length
            });
        }else{
            throw 'Bank has already';
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

const updateBank = async (_, {input : { id, name_bank, bank_length, description }}, context) => {
    const transaction = await sequelize.transaction();

    try{
        await Bank.update({
            name_bank,
            description,
            bank_length
        },{
            where: {
                id
            }
        });

        await transaction.commit();
        return {
            status: 'Data succesful update'
        }
    }catch(error){
        await transaction.rollback();
        throw new UserInputError('Server is error', {errors : error});     
    }
}

const deleteBank = async (_, { id }, context) => {
    const transaction = await sequelize.transaction();

    try{
        const checkBank = await Bank.findOne({
            where: {
                id
            }
        });

        if(checkBank){
            await Bank.destroy({
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

const getAllBank = async (_, args, context) => {
    try{
        return await Bank.findAll();
    }catch(error){
        throw new UserInputError('Server is error', {errors : error});
    }
}

const getDetailBank = async (_, { id }, context) => {
    try{
        const data = await Bank.findOne({
            where: {
                id
            }
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
    addBank,
    deleteBank,
    updateBank
  },
  Query: {
    getAllBank,
    getDetailBank
  }
};
