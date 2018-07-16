import shouldBehaveLikeBurnableToken from './BurnableToken.behaviour';
const BoraToken = artifacts.require('BoraToken');

contract('BurnableToken', function (accounts) {
  const initialBalance = 1000;
  const owner = accounts[0];

  beforeEach(async function () {
    this.token = await BoraToken.new(initialBalance);
  });

  shouldBehaveLikeBurnableToken([owner], initialBalance);
});