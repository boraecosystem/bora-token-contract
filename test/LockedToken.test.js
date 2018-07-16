import assertRevert from './helpers/assertRevert';
import latestTime from './helpers/latestTime';
import { increaseTimeTo, duration } from './helpers/increaseTime';

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MintableToken = artifacts.require('MintableToken');
const BoraToken = artifacts.require('BoraToken');
const LockedToken = artifacts.require('LockedToken');

contract('LockedToken', function (accounts) {
  const amount = 100;
  const owner = accounts[0];
  const beneficiary = accounts[1];

  beforeEach(async function () {
    this.token = await MintableToken.new({ from: owner });
    this.releaseTime = latestTime() + duration.days(1);
    this.timelock = await LockedToken.new(this.token.address, owner, beneficiary, this.releaseTime, true);
    await this.token.mint(this.timelock.address, amount, { from: owner });
  });

  describe('claim and revoke', function() {
    describe('when the contract is revocable', function() {
    const amount = new BigNumber(100);
      it('claims before the release time as soon as the contract created', async function () {
        await this.timelock.claim().should.be.rejected;
      });

      it('claims before the release time', async function () {
        await increaseTimeTo(this.releaseTime - duration.seconds(3));
        await this.timelock.claim().should.be.rejected;
      });

      it('claims when the contract revoked after the release time', async function () {
        await increaseTimeTo(this.releaseTime + duration.seconds(3));
        const { logs } = await this.timelock.revoke();

        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Revoke');
        assert.equal(logs[0].args.donor, owner);

        await this.timelock.claim().should.be.rejected;
      });

      it('claims when the contract revoked before the release time', async function () {
        await increaseTimeTo(this.releaseTime - duration.seconds(3));
        await this.timelock.revoke();

        await increaseTimeTo(this.releaseTime + duration.seconds(3));
        await this.timelock.claim().should.be.rejected;
      });

      it('claims after the release time', async function () {
        await increaseTimeTo(this.releaseTime + duration.seconds(1));
        await this.timelock.claim().should.be.fulfilled;
        const balance = await this.token.balanceOf(beneficiary);
        balance.should.be.bignumber.equal(amount);
      });

      it('claims after enough time since the release time', async function () {
        await increaseTimeTo(this.releaseTime + duration.years(1));
        await this.timelock.claim().should.be.fulfilled;
        const balance = await this.token.balanceOf(beneficiary);
        balance.should.be.bignumber.equal(amount);
      });

      it('claims twice', async function () {
        await increaseTimeTo(this.releaseTime + duration.years(1));
        await this.timelock.claim().should.be.fulfilled;
        await this.timelock.claim().should.be.rejected;
        const balance = await this.token.balanceOf(beneficiary);
        balance.should.be.bignumber.equal(amount);
      });
    });
  });
});



contract('LockedToken', function (accounts) {
  const amount = 100;
  const owner = accounts[0];
  const beneficiary = accounts[1];

  beforeEach(async function () {
    this.token = await MintableToken.new({ from: owner });
    this.releaseTime = latestTime() + duration.years(1);
    this.timelock = await LockedToken.new(this.token.address, owner, beneficiary, this.releaseTime, false);
    await this.token.mint(this.timelock.address, amount, { from: owner });
  });

  describe('claim and revoke', function() {
    describe('when the contract is not revocable', function() {
    const amount = new BigNumber(100);
      it('claims before the release time when revocation attempted', async function () {
        await increaseTimeTo(this.releaseTime - duration.seconds(3));
        await assertRevert(this.timelock.revoke());

        await this.timelock.claim().should.be.rejected;
      });

      it('claims when revocation attempted after the release time', async function () {
        await increaseTimeTo(this.releaseTime + duration.seconds(1));
        await assertRevert(this.timelock.revoke());
        await this.timelock.claim().should.be.fulfilled;

        const balance = await this.token.balanceOf(beneficiary);
        balance.should.be.bignumber.equal(amount);
      });

      it('claims when revocation attempted before the release time', async function () {
        await increaseTimeTo(this.releaseTime - duration.seconds(3));
        await assertRevert(this.timelock.revoke());

        await increaseTimeTo(this.releaseTime + duration.seconds(3));

        await this.timelock.claim().should.be.fulfilled;
        const balance = await this.token.balanceOf(beneficiary);
        balance.should.be.bignumber.equal(amount);
      });

      it('claims twice when revocation attempted', async function () {
        await increaseTimeTo(this.releaseTime + duration.years(1));
        await assertRevert(this.timelock.revoke());

        await this.timelock.claim().should.be.fulfilled;
        await this.timelock.claim().should.be.rejected;

        const balance = await this.token.balanceOf(beneficiary);
        balance.should.be.bignumber.equal(amount);
      });
    });
  });
});
