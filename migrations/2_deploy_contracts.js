var MobileGoToken = artifacts.require("./MobileGoToken.sol");

module.exports = function(deployer) {
  deployer.deploy(MobileGoToken);
};
