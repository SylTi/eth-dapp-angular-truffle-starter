var humanToken = artifacts.require("./libs/HumanStandardToken.sol");
var token = artifacts.require("./TokenTest.sol");

module.exports = function(deployer) {
  deployer.deploy(token, humanToken);
};
