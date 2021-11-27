import { ContractCallQuery, ContractFunctionResult, ContractId, Hbar } from '@hashgraph/sdk';

import { client } from '../../lib/hedera';
import { FunctionParameter, getContractFunctionParameters } from '../../helpers';

export interface SmartContractCallQuery {
  contractId: ContractId;
  functionName: string;
  functionParameters?: FunctionParameter[];
  queryPaymentAmount?: number,
  gas: number;
}

/**
 * A query that calls a function of the given smart contract instance, giving it function parameters as its inputs. 
 * https://docs.hedera.com/guides/docs/sdks/smart-contracts/call-a-smart-contract-function-1
 * Transaction Fee: $0.05
 * Transaction Fee (local call): $0.001
 * 
 * @param   {ContractId}                   contractId         The id of the contract
 * @param   {string}                       functionName       The identifier/name of the function being called
 * @param   {[{type: string, value: any}]} functionParameters The parameters being passed to the function being called
 * @param   {number}                       queryPaymentAmount Set the query payment in hbars for the node returning the request
 * @param   {number}                       gas
 * @returns {*}
 */
const smartContractCallQuery = async ({
  contractId,
  functionName,
  functionParameters,
  queryPaymentAmount = 2,
  gas = 100000000
}: SmartContractCallQuery) => {
  console.log('-- GET CALL SMART CONTRACT FUNCTION --');

  const query = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(gas)
    .setQueryPayment(new Hbar(queryPaymentAmount));

  if (functionParameters) {
    const contractFunctionParameters = getContractFunctionParameters(functionParameters);
    query.setFunction(functionName, contractFunctionParameters);
  } else {
    query.setFunction(functionName);
  }

  const contractCallResult: ContractFunctionResult = await query.execute(client);

  return {
    contractId,
    response: contractCallResult
  };
}

export { smartContractCallQuery };
