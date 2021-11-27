import { ContractFunctionParameters } from '@hashgraph/sdk';

export type FunctionParameter = {
  type: string;
  value: any;
}

/**
 * Create functions parameters object with an array of contract parameters.
 * @param   {FunctionParameter[]}        parameters Parameters of the function
 * @returns {ContractFunctionParameters}            The function parameters object
 */
const getContractFunctionParameters = (parameters: FunctionParameter[]) => {
  const functionParameters = new ContractFunctionParameters();
  parameters.forEach((item: FunctionParameter) => {
    const { type, value } = item;
    switch (type) {
      case 'address':
        functionParameters.addAddress(value);
        break;
      case 'addressArray':
        functionParameters.addAddressArray(value);
        break;
      case 'bool':
        functionParameters.addBool(value);
        break;
      case 'bytes':
        functionParameters.addBytes(value);
        break;
      case 'bytes32':
        functionParameters.addBytes32(value);
        break;
      case 'bytes32Array':
        functionParameters.addBytes32Array(value);
        break;
      case 'bytesArray':
        functionParameters.addBytesArray(value);
        break;
      case 'int256':
        functionParameters.addInt256(value);
        break;
      case 'int256Array':
        functionParameters.addInt256Array(value);
        break;
      case 'int32':
        functionParameters.addInt32(value);
        break;
      case 'int32Array':
        functionParameters.addInt32Array(value);
        break;
      case 'int64':
        functionParameters.addInt64(value);
        break;
      case 'int64Array':
        functionParameters.addInt64Array(value);
        break;
      case 'int8':
        functionParameters.addInt8(value);
        break;
      case 'int8Array':
        functionParameters.addInt8Array(value);
        break;
      case 'string':
        functionParameters.addString(value);
        break;
      case 'stringArray':
        functionParameters.addStringArray(value);
        break;
      case 'uint256':
        functionParameters.addUint256(value);
        break;
      case 'uint256Array':
        functionParameters.addUint256Array(value);
        break;
      case 'uint32':
        functionParameters.addUint32(value);
        break;
      case 'uint32Array':
        functionParameters.addUint32Array(value);
        break;
      case 'uint64':
        functionParameters.addUint64(value);
        break;
      case 'uint64Array':
        functionParameters.addUint64Array(value);
        break;
      case 'uint8':
        functionParameters.addUint8(value);
        break;
      case 'uint8Array':
        functionParameters.addUint8Array(value);
        break;
      default:
        throw Error('WRONG TYPE');
    }
  });
  return functionParameters;
}

export { getContractFunctionParameters };
