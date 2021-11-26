const { checkAuth } = require("../../Util/check-auth");
const Wallet = require('../../Model/wallet');
const WalletUserTransaction = require('../../Model/wallet_user_transaction');


const getBalance = async (_, args, context) => {
    const player = checkAuth(context);
    
    var total = 0;
    const closing = await Wallet.findOne({
      where : {
        id_player : player.id
      },
      include: [{
        model: WalletUserTransaction,
        as: 'WalletUserTransaction'
      }],
    });

    if(closing.dataValues.WalletUserTransaction.length){
        const lengthRow = closing.dataValues.WalletUserTransaction.length
        total = closing.dataValues.WalletUserTransaction[lengthRow - 1].dataValues.closing_balance;
    }

    return {
        total
    }
}

module.exports = {
    Query: {
        getBalance
    }
};
