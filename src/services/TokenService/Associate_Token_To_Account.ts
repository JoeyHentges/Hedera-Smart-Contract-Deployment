import { AccountId, TokenAssociateTransaction, PrivateKey, TokenId } from '@hashgraph/sdk';

import { client } from '../../lib/hedera';

export interface AssociateTokenToAccount {
  accountId: AccountId | string;
  accountKey: PrivateKey;
  tokenIds: TokenId[] | string[];
}

/**
 * Associates the provided Hedera account with the provided Hedera token(s). 
 * https://docs.hedera.com/guides/docs/sdks/tokens/associate-tokens-to-an-account
 * Transaction Fee: $0.05
 * 
 * @param   {AccountId | string}   accountId  The id of the account to have new association to the list of tokens
 * @param   {PrivateKey}           accountKey The private key of the account to sign the transaction
 * @param   {TokenId[] | string[]} tokenIds   The array of token ids to have association to the account
 * @returns 
 */
const associateTokenToAccount = async ({
  accountId,
  accountKey,
  tokenIds
}: AssociateTokenToAccount) => {
  console.log('-- ASSOCIATE TOKEN TO ACCOUNT --');

  const transaction = await new TokenAssociateTransaction()
    .setAccountId(accountId)
    .setTokenIds(tokenIds)
    .freezeWith(client);

  const signTx = await transaction.sign(accountKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);

  return {
    accountId,
    tokenIds,
    transactionStatus: receipt.status
  };
}

export { associateTokenToAccount };
