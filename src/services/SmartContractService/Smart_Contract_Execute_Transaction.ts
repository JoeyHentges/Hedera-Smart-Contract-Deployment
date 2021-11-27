import { ContractExecuteTransaction, ContractId } from '@hashgraph/sdk';

import { client } from '../../lib/hedera';
import { FunctionParameter, getContractFunctionParameters } from '../../helpers';

export interface SmartContractExecuteTransaction {
  contractId: ContractId,
  functionName: string,
  functionParameters?: FunctionParameter[],
  gas?: number;
}

/**
 * A query that calls a function of the given smart contract instance, giving it function parameters as its inputs. 
 * https://docs.hedera.com/guides/docs/sdks/smart-contracts/call-a-smart-contract-function
 * Transaction Fee: $0.05
 * Transaction Fee (local call): $0.001
 * 
 * @param   {ContractId}                   contractId         The id of the contract
 * @param   {string}                       functionName       The identifier/name of the function being called
 * @param   {[{type: string, value: any}]} functionParameters The parameters being passed to the function being called
 * @param   {number}                       gas
 * @returns {*}
 */
const smartContractExecuteTransaction = async ({
  contractId,
  functionName,
  functionParameters,
  gas = 100000000
}: SmartContractExecuteTransaction) => {
  console.log('-- SET CALL SMART CONTRACT FUNCTION --');

  const transaction = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(gas);

  if (functionParameters) {
    const contractFunctionParameters = getContractFunctionParameters(functionParameters);
    transaction.setFunction(functionName, contractFunctionParameters);
  } else {
    transaction.setFunction(functionName);
  }

  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);

  return {
    contractId,
    functionName,
    functionParameters,
    transactionStatus: receipt.status
  };
}

export { smartContractExecuteTransaction };
