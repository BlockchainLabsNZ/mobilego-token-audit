## Development Environment

The project is built using [Truffle 3.2.7](http://truffleframework.com) and, to make sure that everybody involved runs tests and compiles using the same packages, we rely on [yarn](https://yarnpkg.com/en/) to handle the packages.

```
yarn install
```

To have a clean a standard version of a blockchain environment we will be using [this](https://github.com/b9lab/truffle-vagrant-env) vagrant configuration to run a brand new Virtual Machine with all required libraries for developing in solidity.
Please install [Vagrant](https://www.vagrantup.com) and make sure is working before running the following code.

```
git clone git@github.com:b9lab/truffle-vagrant-env.git
cd truffle-vagrant-env
vagrant up
```

This will download the packages necessary for a the development of DAPPS, run the VM and forward the standard ports to it.

  - HTTP Server
    - 8000
  - Ethereum client standard port
    - 8545
  - IPFS
    - 4001
    - 5001
    - 8080

It will also link the folder `~/DAPPS` of your local machine to `/home/vagrant/DAPPS`. This way it can have multiple projects running against the same environment.

All of this configuration can be changed on the `Vagrantfile`

Once the VM is up and running we need to run an Ethereum Client on it.
For development and testing purposes we recommend to use `testrpc`.

```
vagrant ssh
testrpc
```

## Testing

The Project contains multiple test scenarios dedicated to check the proper behaviour of the code in normal and edge cases.

```
yarn test
```

The scenarios so far are simple enough to be written in Javascript using the Truffle testing API which provides all of the steps to prepare, publish and interact with contracts on the blockchain while leaving the assertions of the results to the node environment.

However there are some caveats to using this approach.

  - function overloading is not supported by javascript.
  - testing for numbers over 10^15 since Javascript's big number library only ensures consistency till then.

## Deployment

There are 2 suggested ways to deploy the MobileGoToken contract to the Ethereum Network.

  1. Using the truffle command.
  2. Using the Ethereum Mist Wallet.

### Truffle

The truffle framework provides a command to deploy contracts.

```
yarn deploy
```

This command by itself will attempt to log into an Ethereum-compatible node running on http://127.0.0.1:8545. It will attempt to deploy to any network available using the first address provided by the client (this command by itself is meant to be used during development against the testrpc client).

To run the proper deploy first we need to configure the `live` network in the `truffle.js` file. The available options are:

```
live: {
  network_id: 1, // Ethereum public network
  // from - default address to use for any transaction Truffle makes during migrations
  //
  // optional config values
  // host - defaults to "localhost"
  // port - defaults to 8545
  // gas
  // gasPrice
}
```

It's important to provide the `from` parameter since the MobileGoToken will use that address as the owner of the Contract and the one address that would have all of the initial Tokens.

To proceed with the deploy the address must be unlocked for Truffle to run the migrations on the blockchain.

In this example we will be using Geth

Run the node as a console and a http server.
```
geth --rpc console
```

If it's the first time running, it will sync and download the whole blockchain (make sure there is enough space in the hard drive).

Once the node is synced, lets proceed to unlock the address that will deploy the contract.

```
// In the Geth Console
web3.personal.unlockAccount("ADDRESS", "PASSWORD", 600);
// Must return true
```

This command will unlock the address for 10 minutes (enough time to deploy the contract).

Finally in another terminal run the deploy command.

```
yarn deploy --network live
```

Once deployed, Truffle will show the contract's address. It can also be found in the compiled file `build/contracts/MobileGoToken.json`

> Truffle will deploy an initial `Migrations` contract to keep track of all the migrations run. This contract cost roughly 1/4 of the MobileGoToken contract. This cost is only a 1 off and can be reused if the project grows and needs more contracts to be deployed.

### Ethereum Mist Wallet

Open the Ethereum Mist Wallet. This will run the included Geth Node in the background. Please wait until is fully synced.

On the contract tab click on `DEPLOY NEW CONTRACT`.

Make sure that the `SOLIDITY CONTRACT SOURCE CODE` is active.

> Since the Mist Wallet doesn't support `import` statements a Mist ready contract is provided in this project. `mist/MobileGoToken.sol`

Copy the contents of `mist/MobileGoToken.sol` into the textarea. The mist wallet will compile the contract and calculate an approximate amount of gas needed. It will also ask which Contract will be the one deployed, please choose `MobileGoToken`.

Finally, click the deploy button. This will ask for the address' password to sign and deploy the transaction.
