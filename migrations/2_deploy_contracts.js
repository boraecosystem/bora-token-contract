var BoraToken = artifacts.require("./BoraToken.sol")


module.exports = function(deployer) {

  const _supply = 100;  // test 100

  deployer.deploy(BoraToken,_supply);

};

