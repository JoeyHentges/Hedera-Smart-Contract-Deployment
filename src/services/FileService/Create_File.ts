import { FileCreateTransaction, KeyList, PrivateKey, Timestamp } from '@hashgraph/sdk';

import { appendFile } from './Append_File';

import { client } from '../../lib/hedera';

const byteCount = (content: string) => {
  return encodeURI(content).split(/%..|./).length - 1;
}

const chunkString = (content: string, length: number) => {
  const size = Math.ceil(content.length / length);
  const r = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    r[i] = content.substr(offset, length);
    offset += length;
  }

  return r;
}

const createFileTransaction = async ({ adminKeys, fileContent, expirationTime, memo }: CreateFile) => {
  const transaction = new FileCreateTransaction()
    .setKeys(new KeyList(adminKeys))
    .setContents(fileContent)
    .freezeWith(client);

  expirationTime && transaction.setExpirationTime(expirationTime);
  memo && transaction.setFileMemo(memo);

  const signTx = await transaction.sign(adminKeys[0]);
  const submitTx = await signTx.execute(client);
  const receipt = await submitTx.getReceipt(client);

  return {
    fileId: receipt.fileId || '',
    transactionStatus: receipt.status
  };
}

/**
 * If the file contents is too large, split up the file contents into 5.5kb or less
 * chunks and submit them one by one using the fileAppendTransaction function.
 * Submit the first chunk with fileCreateTransaction.
 */
const handleLargeFile = async ({ adminKeys, fileContent, expirationTime, memo }: CreateFile) => {
  const chunks = chunkString(fileContent, 5500);

  const details = await createFileTransaction({
    adminKeys,
    fileContent: chunks[0],
    expirationTime,
    memo,
  });

  for (let i = 1; i < chunks.length; i += 1) {
    await appendFile({ fileId: details.fileId, adminKey: adminKeys[0], fileContent: chunks[i] });
  }

  return details;
}

export interface CreateFile {
  adminKeys: PrivateKey[];
  fileContent: string;
  expirationTime?: Timestamp;
  memo?: string;
}

/**
 * A transaction that creates a new file on a Hedera network. NOTE: If the contents are over 5500 bytes, it will have to be
 * chunked into separate transaction calls using the appendFile transaction. This function does it automatically.
 * Max file size: 1024kB
 * https://docs.hedera.com/guides/docs/sdks/file-storage/create-a-file
 * Transaction Fee: ?
 * 
 * @param   {PrivateKey[]} adminKeys      The public key of the wallet allowed to make changes to the file
 * @param   {string}       fileContent    The content of the file -- when compiling contracts it's the "bytecode" of the json output
 * @param   {Timestamp}    expirationTime The instant at which this file will expire, after which its contents will no longer be available. 
 * @param   {string}       memo           Short publicly visible memo about the file.
 * @returns {*}
 */
const createFile = async ({ adminKeys, fileContent, expirationTime, memo, }: CreateFile) => {
  console.log('-- CREATE FILE --');

  const fileSize = byteCount(fileContent);

  let details;

  // file content needs to be split up into chunks
  if (fileSize > 5500) {
    details = await handleLargeFile({ adminKeys, fileContent, expirationTime, memo });
  } else {
    details = await createFileTransaction({
      adminKeys,
      fileContent,
      expirationTime,
      memo,
    });
  }

  return details;
}

export { createFile };
