<h1 align="center">🏛️ tkngen-api</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://github.com/sntsabode/tkngen-api/actions/workflows/linux.test.yml">
    <img alt="Github Actions" src="https://github.com/sntsabode/tkngen-api/actions/workflows/linux.test.yml/badge.svg"/>
  </a>
  <a href="https://circleci.com/gh/sntsabode/tkngen-api/tree/master">
    <img alt="CircleCI" src="https://circleci.com/gh/sntsabode/tkngen-api/tree/master.svg?style=svg"/>
  </a>
  <a href='https://coveralls.io/github/sntsabode/tkngen-api'>
    <img src='https://coveralls.io/repos/github/sntsabode/tkngen-api/badge.svg' alt='Coverage Status'/>
  </a>
</p>

tkngen-api. A RESTFUL API to deploy ERC20 / BEP20 tokens.

Deployable Token Types are:

* Standard
* Mintable
* Burnable
* MintableBurnable

The only difference between these token contracts and the ones you'll find at [@OpenZeppelin](https://github.com/OpenZeppelin) are that these ones omit the `ERC20Capped` implementation.

If you wish for this behaviour, you're more than welcome to implement it in your contract before deploying by forking and building locally.

The demo production build is hosted at [`https://tkngen-api.herokuapp.com/`](https://tkngen-api.herokuapp.com/). However it is only recommended you use it for testnet deployments.

If you wish to deploy to mainnet, it's recommended you build locally and use your local instance instead of the demo production build.

## Routes

#### `https://tkngen-api.herokuapp.com/`

##### `POST`
* * *

##### `ERC20`

* `/ERC-20/Standard`: Deploys a standard ERC20 Token (no mint or burn implementations).

* `/ERC-20/Mintable`: Deploys a mintable ERC20 Token (mint implementation, no burn implementation).

* `/ERC-20/Burnable`: Deploys a burnable ERC20 Token (no mint implementation, burn implementation).

* `/ERC-20/MintableBurnable`: Deploys a mintable and burnable ERC20 Token (mint and burn implementations).

##### `BEP20`

* `/BEP-20/Standard`: Deploys a standard BEP20 Token (no mint or burn implementations).

* `/BEP-20/Mintable`: Deploys a mintable BEP20 Token (mint implementation, no burn implementation).

* `/BEP-20/Burnable`: Deploys a burnable BEP20 Token (no mint implementation, burn implementation).

* `/BEP-20/MintableBurnable`: Deploys a mintable and burnable BEP20 Token (mint and burn implementations).

<br/>

All routes conform to the same request body data structure:

```ts
export interface IRequestBody {
  tokenName: string
  tokenDecimals: number (6 | 8 | 12 | 18)
  tokenSymbol: string
  totalSupply: number
  privateKey: string
  network: SupportedNetwork
}

export type SupportedNetwork =
  | 'MAINNET'
  | 'MAINNET_FORK'
  | 'KOVAN'
  | 'BINANCESMARTCHAIN'
  | 'BINANCESMARTCHAIN_FORK'
  | 'BINANCESMARTCHAIN_TEST'
```
 
Unfortunately your private key is needed to sign and send the transaction that deploys your token, hence using this api for mainnet deployments isn't recommended. If you do however wish to deploy to mainnet, it's recommended you build locally and use your local instance instead of the demo production build.

***NB*** Please make sure the `totalSupply` parameter is not in wei (token decimals appended to amount). This is done internally by the server.

***NB*** The `totalSupply` parameter is used as the `_initialBalance` for the `Mintable`, `Burnable` and `MintableBurnable` contract implementations.

All routes respond with the same response body data structure:

```ts
interface IResponeBody {
  success: boolean
  msg: string
  data: {
    receipt: {
      transactionHash: string
      transactionIndex: number
      blockHash: string
      blockNumber: number
      from: string
      to: string | null
      gasUsed: number
      cumulativeGasUsed: number
      contractAddress: string
      logs: any[]
      status: boolean
      logsBloom: string
    }

    solc: {
      ABI: any[]
      evmBytecode: string
    }
  }
}
```

#### Example:

```js
const fetch = require('node-fetch')

const requestBody = {
  tokenName: 'TestToken',
  tokenDecimals: 8,
  tokenSymbol: 'TST',
  totalSupply: 100000,
  privateKey: 'pvtk',
  network: 'BINANCESMARTCHAIN_TEST'
}

fetch('https://tkngen-api.herokuapp.com/BEP-20/MintableBurnable', {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: { 'Content-Type': 'application/json' }
}).then(res => res.text())
  .then(body => console.log(body))
```

```sh
{
  success: true,
  msg: 'Successfully deployed your BEP20 Token!',
  data: {
    receipt: {
      transactionHash: '0xe93ffab3e2f25750f735f1876a165449c479491ff2cdf720827d1bc423afff80',
      transactionIndex: 0,
      blockHash: '0x43f8d918198598aeb4415642d1c8ab3175eacda7dc2a5b24c138a78338c6752e',
      blockNumber: 3,
      from: '0xa05d1d27eb9fbda846415d8b6ad26e43c29d02ee',
      to: null,
      gasUsed: 1840053,
      cumulativeGasUsed: 1840053,
      contractAddress: '0x97B83C32b419dc92edB4d73e95e9864927cE3592',
      logs: [Array],
      status: true,
      logsBloom: '0x0000000000000000000000000000000000000000000000000...'
    },

    solc: {
      ABI: [Array],
      evmBytecode: '608060405260006005618360201b60201c565b90508fffff...'
    }
  }
}
```

## Build locally

```sh
git clone https://github.com/sntsabode/tkngen-api
cd tkngen-api
```

```sh
yarn install
```

### Usage

```sh
yarn run start:build
```

You might want to start the ganache instances if you plan on running the dry run forknet deployments.

```sh
yarn run chain --no_fork
```

or 

```sh
yarn run chain --fork
```
if you have the `env` variables defined.

## Run tests

***(Linux)***
```sh
yarn run test
```

If you're on windows it's likely this command will fail.
However it is only a shorthand to running the `./.tesh.sh` bash script.

***(Windows (assuming git is installed [or bash files are runnable]))***

```sh
./.test.sh
```

## Author

👤 **Sihle Masebuku**

* Github: [@sntsabode](https://github.com/sntsabode)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_