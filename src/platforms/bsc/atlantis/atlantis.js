"use strict";

const Utils = require("../../../utils");
const TokenAbi = require("./abi/token.json");
const LendAbi = require("./abi/lend.json");
const Web3EthContract = require("web3-eth-contract");
const _ = require("lodash");
const LendBorrowPlatform = require("../../common").LendBorrowPlatform;

module.exports = class atlantis extends LendBorrowPlatform {
  async getTokens() {
    const cacheKey = `getFarmsViaHtml-v1-${this.getName()}`;

    const cache = await this.cacheManager.get(cacheKey);
    if (cache) {
      return cache;
    }

    const allMarkets = await Utils.multiCall([{
      allMarkets: new Web3EthContract(LendAbi, '0xE7E304F136c054Ee71199Efa6E26E8b0DAe242F3').methods.getAllMarkets(),
    }], this.getChain());

    const result = allMarkets[0].allMarkets.map(address => ({
      address: address,
    }))

    await this.cacheManager.set(cacheKey, Object.freeze(result), {ttl: 60 * 30});

    return Object.freeze(result);
  }

  getName() {
    return 'atlantis';
  }

  getChain() {
    return 'bsc';
  }

  getTokenAbi() {
    return TokenAbi;
  }

  getConfig() {
    return {
      exchangeRateMethod: 'exchangeRateStored',
      borrowBalanceOfMethod: 'borrowBalanceStored',
      cashMethod: 'getCash'
    }
  }

  getFarmLink(farm) {
    return 'https://atlantis.loans/app';
  }

  getFarmEarns(farm) {
    return [];
  }
}
