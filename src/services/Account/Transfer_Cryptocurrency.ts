import { TransferTransaction, Hbar, AccountId, PrivateKey } from '@hashgraph/sdk';

import { client } from '../../lib/hedera';

export interface TransferCryptocurrency {
  senderAccountId: AccountId | string;
  senderPrivateKey: PrivateKey;
  recipientAccountId: AccountId | string;
  transactionAmount: number;
}

/**
 * A transaction that transfers hbars between Hedera accounts.
 * https://docs.hedera.com/guides/docs/sdks/cryptocurrency/transfer-cryptocurrency
 * Transaction Fee: $0.0001
 * Transaction Fee (with custom fees): $0.002
 * 
 * @param   {AccountId}  senderAccountId    The sender account id - hbar is sent from this account. This account also pays the fees
 * @param   {PrivateKey} senderAccountId    The private key of the sender to sign the transaction
 * @param   {AccountId}  recipientAccountId The recipient of the hbars sent by the sender.
 * @param   {number}     transactionAmount  The number of hbars sent.
 * @returns {*}
 */
const transferCryptocurrency = async ({
  senderAccountId,
  senderPrivateKey,
  recipientAccountId,
  transactionAmount
}: TransferCryptocurrency) => {
  console.log('-- TRANSFER CRYPTOCURRENCY --');

  const transaction = new TransferTransaction()
    .addHbarTransfer(senderAccountId, new Hbar(-transactionAmount))
    .addHbarTransfer(recipientAccountId, new Hbar(transactionAmount))
    .freezeWith(client);

  const signTx = await transaction.sign(senderPrivateKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);

  return {
    senderAccountId,
    recipientAccountId,
    amount: new Hbar(transactionAmount),
    transactionStatus: receipt.status
  };
}

export { transferCryptocurrency };
