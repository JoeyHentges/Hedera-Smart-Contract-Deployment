import { AccountBalanceQuery, AccountId } from '@hashgraph/sdk';

import { client } from '../../lib/hedera';

export interface GetAccountBalance {
  accountId: AccountId | string;
}

/**
 * A query that returns the account balance for the specified account.
 * https://docs.hedera.com/guides/docs/sdks/cryptocurrency/get-account-balance
 * 
 * @param   {AccountId} accountId The account id to get the balance of
 * @returns {*}
 */
const getAccountBalance = async ({ accountId }: GetAccountBalance) => {
  console.log('-- GET ACCOUNT BALANCE --');

  const query = new AccountBalanceQuery().setAccountId(accountId);
  const response = await query.execute(client);
  return {
    accountId,
    balance: response.hbars,
    tokenBalance: response.tokens
  };
}

export { getAccountBalance };
