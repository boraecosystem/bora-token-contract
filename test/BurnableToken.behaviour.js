import assertRevert from './helpers/assertRevert';
import { inLogs } from './helpers/expectEvent';

const BigNumber = web3.BigNumber;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

export default function ([owner], initialBalance) {
  describe('as a basic burnable token', function () {
    describe('when the given amount is not greater than balance of the sender', function () {
      const amount = 100;

      beforeEach(async function () {
        ({ logs: this.logs } = await this.token.burn(amount, { from: owner}));
      });

      it('burns the requested amount', async function () {
        const balance = await this.token.balanceOf(owner);
        balance.should.be.bignumber.equal(initialBalance - amount);
      });

      it('emits a burn event', async function () {
        const { logs } = await this.token.burn(amount, { from: owner});
        assert.equal(logs.length, 2);
        assert.equal(logs[0].event, 'Burn');
        assert.equal(logs[0].args.to, owner);
        assert.equal(logs[0].args.amount, amount);
        assert.equal(logs[1].event, 'Transfer');
      });

      it('emits a transfer event', async function () {
        const event = await inLogs(this.logs, 'Transfer');
        event.args.from.should.eq(owner);
        event.args.to.should.eq(ZERO_ADDRESS);
        event.args.value.should.be.bignumber.equal(amount);
      });
    });

    describe('when the given amount is greater than the balance of the sender', function () {
      const amount = initialBalance + 1;

      it('reverts', async function () {
        await assertRevert(this.token.burn(amount, { from: owner}));
      });
    });
  });
};