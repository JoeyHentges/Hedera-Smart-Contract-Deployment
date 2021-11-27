import { AccountId, PrivateKey, PublicKey } from '@hashgraph/sdk';

import {
  // Account
  getAccountBalance,
  transferCryptocurrency,

  // File Service
  appendFile,
  createFile,

  // Smart Contract Service
  createSmartContract,
  smartContractCallQuery,
  smartContractExecuteTransaction,

  // Token Service
  associateTokenToAccount,
  transferToken
} from './services';

import contractJson from '../bin/contracts/TestContract.json';

const accountId = process.env.ACCOUNT_ID || '';
const publicKey = process.env.PUBLIC_KEY || '';
const privateKey = process.env.PRIVATE_KEY || '';

const main = async () => {
  let details;

  details = await createSmartContract({
    adminKey: PrivateKey.fromString(privateKey),
    proxyAccountId: accountId,
    contractByteCode: contractJson.bytecode,
    constructorParameters: [
      {
        type: 'string',
        value: 'First message'
      }
    ],
    memo: 'Test smart contract'
  });
  const contractId = details.contractId || '';

  details = await smartContractCallQuery({
    contractId,
    functionName: 'message'
  });
  console.log('contract id:', details.response.getString());
}

main();