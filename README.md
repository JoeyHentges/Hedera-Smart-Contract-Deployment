# Hedera - Easily Deploy Smart Contracts

Easily deploy and test your Hedera smart contracts.

# Local Development

The following assumes the use of `node@>=10`.

## Install Dependencies
```bash
yarn install
```

## Run Development Environment
Make a copy of the .env.example file and rename it ".env.development". Update the environment variables to your Hedera testnet account details.

Compile your contracts using the solidity compiler.

Go to the src/index.ts file and modify the existing main function to fit your contract(s) deployment needs, and run the following command to deploy your contract(s) to the Hedera testnet:
```bash
yarn dev
```
