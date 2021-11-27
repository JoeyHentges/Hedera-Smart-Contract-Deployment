import { FileAppendTransaction, FileId, PrivateKey } from '@hashgraph/sdk';

import { client } from '../../lib/hedera';

export interface AppendFile {
  fileId: FileId | string;
  adminKey: PrivateKey;
  fileContent: string;
}

/**
 * A transaction that appends new file content to the end of an existing file.
 * https://docs.hedera.com/guides/docs/sdks/file-storage/append-to-a-file
 * Transaction Fee: ?
 * 
 * @param   {FileId}     fileId      The id of the file to append
 * @param   {PrivateKey} adminKey    The public key of the wallet allowed to make changes to the file
 * @param   {string}     fileContent The content of the file -- when compiling contracts it's the "bytecode" of the json output
 * @returns {*}
 */
const appendFile = async ({ fileId, adminKey, fileContent }: AppendFile) => {
  console.log('-- APPEND FILE --');

  const transaction = new FileAppendTransaction()
    .setFileId(fileId)
    .setContents(fileContent)
    .freezeWith(client);

  const signTx = await transaction.sign(adminKey);
  const submitTx = await signTx.execute(client);
  const receipt = await submitTx.getReceipt(client);

  return {
    fileId: receipt.fileId,
    transactionStatus: receipt.status
  };
}

export { appendFile };
