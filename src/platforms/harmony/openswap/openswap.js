"use strict";

const _ = require("lodash");

module.exports = class openswap {
  constructor(masterchef1, masterchef2) {
    this.masterchef1 = masterchef1;
    this.masterchef2 = masterchef2;
  }

  async getLbAddresses() {
    return _.uniq((await Promise.all([
      this.masterchef1.getLbAddresses(),
      this.masterchef2.getLbAddresses(),
    ])).flat());
  }

  async getFarms(refresh = false) {
    return (await Promise.all([
      this.masterchef1.getFarms(refresh),
      this.masterchef2.getFarms(refresh),
    ])).flat();
  }

  async getYields(address) {
    return (await Promise.all([
      this.masterchef1.getYields(address),
      this.masterchef2.getYields(address),
    ])).flat();
  }

  async getDetails(address, id) {
    if (!id.includes('_v2_')) {
      return this.masterchef1.getDetails(address, id);
    }

    return this.masterchef2.getDetails(address, id);
  }

  getName() {
    return 'openswap';
  }

  getChain() {
    return 'harmony';
  }
};
