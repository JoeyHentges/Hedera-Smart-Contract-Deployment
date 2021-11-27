import { AccountId, TransferTransaction, PrivateKey, TokenId } from '@hashgraph/sdk';

import { client } from '../../lib/hedera';

export interface TransferToken {
  senderAccountId: AccountId | string;
  senderPrivateKey: PrivateKey;
  recipientAccountId: AccountId | string;
  tokenId: TokenId | string;
  transactionAmount: number;
}

/**
 * A transaction that transfers tokens between Hedera accounts.
 * https://docs.hedera.com/guides/docs/sdks/tokens/transfer-tokens
 * Transaction Fee: $0.0001
 * Transaction Fee (with custom fees): $0.002
 * 
 * @param   {AccountId | string} senderAccountId    The account id sending the tokens
 * @param   {PrivateKey}         senderPrivateKey   The private key of the sender of the tokens
 * @param   {AccountId | string} recipientAccountId The account id receiving the tokens
 * @param   {TokenId | string}   tokenId            The ID of the token being transfered
 * @param   {number}             transactionAmount  The number of tokens being transfered
 * @returns {*} 
 */
const transferToken = async ({
  senderAccountId,
  senderPrivateKey,
  recipientAccountId,
  tokenId,
  transactionAmount
}: TransferToken) => {
  console.log('-- TRANSFER TOKEN --');

  //Create the transfer transaction
  const transaction = await new TransferTransaction()
    .addTokenTransfer(tokenId, senderAccountId, -transactionAmount)
    .addTokenTransfer(tokenId, recipientAccountId, transactionAmount)
    .freezeWith(client);

  const signTx = await transaction.sign(senderPrivateKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);

  const details = {
    tokenId,
    tokenAmount: transactionAmount,
    transactionStatus: receipt.status
  };

  return details;
}

export { transferToken };
