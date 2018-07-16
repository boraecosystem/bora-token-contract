# BORA Ecosystem Smart Contract

---

This is Smart Contract for utilizing in BORA Ecosystem. If you want to understand BORA Ecosystem, please refer to our [project official site](https://www.boraecosystem.com).

## Testing

---

If you want to verify BORA token contract using test code in this repository, you need to install truffle and ganache client for your convenience.

### Installation of Testing Tools

Running test suites require NPM (version v6.1 or later).

  
```sh
# 1. Installation
npm install -g truffle
npm install -g ganache-cli
cd PATH-TO-CODE
npm install
```

```sh
# 2. Testing
cd PATH-TO-CODE
ganache-cli
truffle compile
truffle migrate
truffle test
```


### Overview of Directories

* contracts  : Directory for Solidity Contracts.
* migrations : Directory for deployment files.
* test : Directory for test suites of the Smart Contracts.
* truffle.js : Truffle configuration file.


### Debugging

```sh
truffle debug <transaction hash>
```


### Relevant URLs for Tools

- [truffle install](http://truffleframework.com/docs/getting_started/installation)
- [testrpc install](https://www.npmjs.com/package/ganache-cli)
- [install Ganache win ver.](http://truffleframework.com/ganache/)



## License and Intellectual Property included in this Contracts

---

Code released under the [MIT License](https//github.com/boraecosystem/bora-token-contract/LICENSE).

BORA Ecosystem Token Contract and test suites include code from [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity) under the MIT license.
