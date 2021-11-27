import { AccountId, ContractCreateTransaction, PrivateKey } from '@hashgraph/sdk';

import { client } from '../../lib/hedera';
import { createFile } from '../FileService/Create_File';
import { FunctionParameter, getContractFunctionParameters } from '../../helpers';

export interface CreateSmartContract {
  adminKey: PrivateKey;
  proxyAccountId: AccountId | string;
  contractByteCode: string;
  gas?: number;
  constructorParameters?: FunctionParameter[];
  memo?: string;
}

/**
 * A transaction that creates a new smart contract instance.
 * https://docs.hedera.com/guides/docs/sdks/smart-contracts/create-a-smart-contract
 * Transaction Fee: $1.0
 * 
 * @param   {PrivateKey}          adminKey              The public key of the wallet allowed to make changes to the smart contract
 * @param   {AccountId}           proxyAccountId        The ID of the account to which this account is proxy staked. 
 * @param   {number}              initialBalance        The initial number of hbars to put into the cryptocurrency account associated with and owned by the smart contract.
 * @param   {string}              contractByteCode      The byte code of the contract -- when compiling it's the "bytecode" of the json output
 * @param   {number}              gas                   The amount of gas used to create the contract. Unused gas returned.
 * @param   {FunctionParameter[]} constructorParameters The parameters for the contract constructor
 * @param   {string}              memo                  The memo to be associated with this contract.
 * @returns {*}
 */
const createSmartContract = async ({
  adminKey,
  proxyAccountId,
  contractByteCode,
  gas = 100000000,
  constructorParameters,
  memo
}: CreateSmartContract) => {
  console.log('-- CREATE SMART CONTRACT --');

  const fileDetails = await createFile({ adminKeys: [adminKey], fileContent: contractByteCode });
  const fileId = fileDetails.fileId;

  // Create the contract
  const contractTransaction = new ContractCreateTransaction()
    .setGas(gas)
    .setBytecodeFileId(fileId)
    .setAdminKey(adminKey)
    .setProxyAccountId(proxyAccountId);

  if (constructorParameters) {
    // create the contract constructor parameters
    const contractConstructorParameters = getContractFunctionParameters(constructorParameters);
    contractTransaction.setConstructorParameters(contractConstructorParameters);
  }

  memo && contractTransaction.setContractMemo(memo);

  const contractTransactionResponse = await contractTransaction.execute(client);
  const receipt = await contractTransactionResponse.getReceipt(client);

  return {
    adminKey,
    fileId,
    contractId: receipt.contractId,
    transactionReceipt: receipt.status
  };
}

export { createSmartContract };