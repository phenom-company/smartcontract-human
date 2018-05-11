var HumanToken = artifacts.require("HumanToken.sol");
var HumanTokenAllocator = artifacts.require("HumanTokenAllocator.sol");
var HumanEvent = artifacts.require("HumanEvent.sol");

var config = require("./config.json");

module.exports = function(deployer, network, accounts) {
	deployer.deploy(
    	HumanTokenAllocator,
    	accounts[0], //_owner
    	accounts[1], //_oracle
    	accounts[2], //_company
    	accounts[3], //_teamFund
    	accounts[4] //_eventManager
    )
    .then(function(){
    	return HumanTokenAllocator.deployed()
    })
    .then(function(Contract){
    	return Contract.Human.call()
    })
    .then(function(tokenAddress) {
    	//console.log(tokenAddress);
    	return deployer.deploy(
    		HumanEvent,
    		accounts[5], //_owner
    		100000000000000000000, //_softCap
    		accounts[6], //_alternative
    		tokenAddress //_human
    		)
    })
};
