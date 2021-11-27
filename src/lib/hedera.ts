import { Client } from '@hashgraph/sdk';
import { config } from 'dotenv';

const environment = process.env.NODE_ENV;
config({ path: environment === 'development' ? './.env.development' : './.env.production' });

const accountId: string = process.env.ACCOUNT_ID || '';
const privateKey: string = process.env.PRIVATE_KEY || '';

let client: Client;

try {
  if (environment === 'development') {
    client = Client.forTestnet().setOperator(accountId, privateKey);
  } else {
    client = Client.forMainnet().setOperator(accountId, privateKey);
  }
} catch {
  throw new Error(
    "Environment variables HEDERA_NETWORK, OPERATOR_ID, and OPERATOR_KEY are required."
  );
}

export { client };
