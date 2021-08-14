<h1 align="center">🪙 tkngen-api 🪙</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://github.com/sntsabode/tkngen-api/actions/workflows/linux.test.yml">
    <img alt="Github Actions" src="https://github.com/sntsabode/tkngen-api/actions/workflows/linux.test.yml/badge.svg"/>
  </a>
</p>

> tkngen-api. A RESTFUL API to deploy ERC20 / BEP20 tokens.
>
> Deployable Token Types are:
>
> * Standard
> * Mintable
> * Burnable
> * MintableBurnable
>
> The only difference between these token contracts and the ones you'll find at [@OpenZeppelin]() are that these ones omit the `ERC20Capped` implementation.
>
> If you wish for this behaviour, you're more than welcome to implement it in your contract before deploying by forking and building locally.
>
> The demo production build is hosted at [`https://tkngen-api.herokuapp.com/`](https://tkngen-api.herokuapp.com/). However it is only recommended you use it for testnet deployments.
>
> If you wish to deploy to mainnet, it's recommended you build locally and use your local instance instead of the demo production build.

## Routes

#### `https://tkngen-api.herokuapp.com/`

<br/>

##### `POST`

> ##### `ERC20`
>
> * `/ERC-20/Standard`: Deploys a standard ERC20 Token (no mint or burn implementations).
>
> * `/ERC-20/Mintable`: Deploys a mintable ERC20 Token (mint implementation, no burn implementation).
>
> * `/ERC-20/Burnable`: Deploys a burnable ERC20 Token (no mint implementation, burn implementation).
>
> * `/ERC-20/MintableBurnable`: Deploys a mintable and burnable ERC20 Token (mint and burn implementations).
>
>
> ##### `BEP20`
>
> * `/BEP-20/Standard`: Deploys a standard BEP20 Token (no mint or burn implementations).
>
> * `/BEP-20/Mintable`: Deploys a mintable BEP20 Token (mint implementation, no burn implementation).
>
> * `/BEP-20/Burnable`: Deploys a burnable BEP20 Token (no mint implementation, burn implementation).
>
> * `/BEP-20/MintableBurnable`: Deploys a mintable and burnable BEP20 Token (mint and burn implementations).
>
> <br/>
>
> All routes conform to the same request body data structure:
>
> ```ts
> export interface IRequestBody {
>   tokenName: string
>   tokenDecimals: number
>   tokenSymbol: string
>   totalSupply: number
>   privateKey: string
>   network: SupportedNetwork
> }
> ```
> 
> <br/>
> 
> Unfortunately your private key is needed to sign and send the transaction that deploys your token, hence using this api for mainnet deployments isn't recommended. If you do however wish to deploy to mainnet, it's recommended you build locally and use your local instance instead of the demo production build.
>
> ***NB*** The `totalSupply` parameter is used as the `_initialBalance` for the `Mintable`, `Burnable` and `MintableBurnable` contract implementations.
> 
> <br/>

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