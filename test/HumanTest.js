var HumanToken = artifacts.require("HumanToken.sol");
var HumanTokenAllocator = artifacts.require("HumanTokenAllocator.sol");
var HumanEvent = artifacts.require("HumanEvent.sol");
var BigNumber = require('bignumber.js');

const increaseTime = function(duration) {
    const id = Date.now()
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            params: [duration],
            id: id,
        }, err1 => {
        if (err1) return reject(err1)
            web3.currentProvider.sendAsync({
            jsonrpc: '2.0',
            method: 'evm_mine',
            id: id+1,
        }, (err2, res) => {
            return err2 ? reject(err2) : resolve(res)
            })
        })
    })
}

/* 
====================================================================================================
Human contracts tests
====================================================================================================
*/

contract('Human token allocator', function(accounts) {
    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    };
    var HumanTokenContract; 
    var HumanTokenAllocatorContract;
    var HumanEventContract;
    // Outside addresses
    var allocatorOwner = accounts[0];
    var oracle = accounts[1];
    var company = accounts[2];
    var teamFund = accounts[3];
    var eventManager = accounts[4];
    var eventOwner = accounts[5];
    var alternative = accounts[6];
    var controller = accounts[7];
    var notController = accounts[8];
    var holders = [accounts[9], accounts[10], accounts[11], accounts[12]];



/* 
====================================================================================================
Start of testing
====================================================================================================
*/    


    it('should set rate correctly', function() {
        var random_int = randomInteger(1, 1000);
        return HumanTokenAllocator.deployed()
        .then(function(instance) {
                var Contract = instance;
                HumanTokenAllocatorContract = Contract;
                return HumanTokenAllocatorContract.setRate(random_int, {
                	from: oracle
                })
        })
        .then(function() {
            return HumanTokenAllocatorContract.rateEth.call();
        })
        .then(function(rate) {
            assert.equal(rate.toNumber(), random_int, 'rateEth is not correct');
        })
    });

    it('should not sell tokens for ETH when status is created', function() {
        var etherAmount = web3.toWei(1, 'ether');
            return HumanTokenAllocatorContract.sendTransaction({
                from: holders[0],
                value: etherAmount
            })
            .then(function() {
                assert(false, 'token was sold when when ico status is created');
            })
            .catch(function(e) {
                assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
            });
    });    

    it('should start startFirstStage', async function() {
        await HumanTokenAllocatorContract.startFirstStage({
        	from: allocatorOwner
        });
        var token = await HumanTokenAllocatorContract.Human.call();
        HumanTokenContract = HumanToken.at(token);
        var balance = await HumanTokenContract.balanceOf.call(teamFund);
        assert.deepEqual(
        	BigNumber(balance),
        	BigNumber(7*Math.pow(10,18)*Math.pow(10,6)),
        	'balance is not correct'
        	);
	});

    it('should not allow to invoke buyForInvestor for not controller', function() {
        var randomInt = randomInteger(10000, 100000);
        var tx_Hash = 'someHash';
        return HumanTokenAllocatorContract.buyForInvestor(
                holders[0],
                randomInt,
                tx_Hash,
                {
                    from: notController
                }
        )
        .then(function() {
            assert(false, 'buyForInvestor from not controller');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        })
    });

    it('should not sell tokens for ETH when public allocation disabled', function() {
        var etherAmount = web3.toWei(1, 'ether');
            return HumanTokenAllocatorContract.sendTransaction({
                from: holders[0],
                value: etherAmount
            })
            .then(function() {
                assert(false, 'token was sold when when ico status is created');
            })
            .catch(function(e) {
                assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
            });
    });	

    it('enable public allocation', function() {
        return HumanTokenAllocatorContract.enable({
        	from: allocatorOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'public allocation was not enable');
        })
    });

    it('should set rate equals 1', function() {
        var random_int = 1;
        return HumanTokenAllocator.deployed()
        .then(function(instance) {
                var Contract = instance;
                HumanTokenAllocatorContract = Contract;
                return HumanTokenAllocatorContract.setRate(random_int, {
                	from: oracle
                })
        })
        .then(function() {
            return HumanTokenAllocatorContract.rateEth.call();
        })
        .then(function(rate) {
            assert.equal(rate.toNumber(), random_int, 'rateEth is not correct');
        })
    });

    it('should sell tokens for ETH when status is first stage', async function() {
        var balanceBefore = await HumanTokenContract.balanceOf.call(holders[0]);
        balanceBefore = BigNumber(balanceBefore);
        var etherAmount = randomInteger(1000000, 100000000000); 
        await web3.eth.sendTransaction(
            {
                from: holders[0], 
                to: HumanTokenAllocatorContract.address, 
                value: etherAmount,
                gas: 200000
            }
        );
        var balanceAfter = await HumanTokenContract.balanceOf.call(holders[0]);
        balanceAfter = BigNumber(balanceAfter);
        assert.deepEqual(
        	balanceAfter.minus(balanceBefore),
        	BigNumber(etherAmount), 
        	'tokens was not sold correctly');
    });

    it('should allow to add controllers', async function() {
        await HumanTokenAllocatorContract.addController(
            controller,
            {
                from: allocatorOwner
            }
            );
        assert.equal(
            await HumanTokenAllocatorContract.isController.call(controller),
            true,
            'controller was\'t added to managers list'
            );
    });

    it('should sell tokens for other cryptocurriencies when status is first stage', async function() {
        var balanceBefore = await HumanTokenContract.balanceOf.call(holders[1]);
        balanceBefore = BigNumber(balanceBefore);
        var tokensAmount = randomInteger(100000, 10000000); 
        var tx_Hash = 'someHash';
        await HumanTokenAllocatorContract.buyForInvestor(
                holders[1],
                tokensAmount,
                tx_Hash,
                {
                    from: controller
                }
        );
        var balanceAfter = await HumanTokenContract.balanceOf.call(holders[1]);
        balanceAfter = BigNumber(balanceAfter);
        assert.deepEqual(
        	balanceAfter.minus(balanceBefore),
        	BigNumber(tokensAmount), 
        	'tokens was not sold correctly');    
    });

    it('disable public allocation', function() {
        return HumanTokenAllocatorContract.disable({
        	from: allocatorOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'public allocation was not disabled');
        })
    });

    it('should not sell tokens for ETH when public allocation disabled', function() {
        var etherAmount = web3.toWei(1, 'ether');
            return HumanTokenAllocatorContract.sendTransaction({
                from: holders[0],
                value: etherAmount
            })
            .then(function() {
                assert(false, 'token was sold when when ico status is created');
            })
            .catch(function(e) {
                assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
            });
    });

    it('enable public allocation again', function() {
        return HumanTokenAllocatorContract.enable({
        	from: allocatorOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'public allocation was not enable');
        })
    });    

    it('shouldn\'t allow to exceed first stage cap', function() {
        var tx_Hash = 'someHash';
        return HumanTokenAllocatorContract.buyForInvestor(
               holders[0],
               7*Math.pow(10,18)*Math.pow(10,6),
               tx_Hash,
               {
                   from: controller
               }
        )
        .then(function() {
            assert(false, 'first stage cap was exceeded');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });
    });  

    it('should start start the second stage', function() {
        return HumanTokenAllocatorContract.startSecondStage({
        	from: allocatorOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'startSecondStage was not started');
        })
    });

    it('should set rate equals 10000', function() {
        var random_int = 10000;
        return HumanTokenAllocator.deployed()
        .then(function(instance) {
                var Contract = instance;
                HumanTokenAllocatorContract = Contract;
                return HumanTokenAllocatorContract.setRate(random_int, {
                	from: oracle
                })
        })
        .then(function() {
            return HumanTokenAllocatorContract.rateEth.call();
        })
        .then(function(rate) {
            assert.equal(rate.toNumber(), random_int, 'rateEth is not correct');
        })
    });

    it('should sell tokens for ETH when status is second stage', async function() {
        var balanceBefore = await HumanTokenContract.balanceOf.call(holders[0]);
        balanceBefore = BigNumber(balanceBefore);
        var etherAmount = web3.toWei(6, 'ether');
        await web3.eth.sendTransaction(
            {
                from: holders[0], 
                to: HumanTokenAllocatorContract.address, 
                value: etherAmount,
                gas: 200000
            }
        );
        var balanceAfter = await HumanTokenContract.balanceOf.call(holders[0]);
        balanceAfter = BigNumber(balanceAfter);
        assert.deepEqual(
        	balanceAfter.minus(balanceBefore),
        	BigNumber(etherAmount*10000), 
        	'tokens was not sold correctly');
    });

    it('should sell tokens for other cryptocurriencies when status is first stage', async function() {
        var balanceBefore = await HumanTokenContract.balanceOf.call(holders[1]);
        balanceBefore = BigNumber(balanceBefore);
        var tokensAmount = randomInteger(100000, 10000000); 
        var tx_Hash = 'someHash';
        await HumanTokenAllocatorContract.buyForInvestor(
                holders[1],
                tokensAmount,
                tx_Hash,
                {
                    from: controller
                }
        );
        var balanceAfter = await HumanTokenContract.balanceOf.call(holders[1]);
        balanceAfter = BigNumber(balanceAfter);
        assert.deepEqual(
        	balanceAfter.minus(balanceBefore),
        	BigNumber(tokensAmount), 
        	'tokens was not sold correctly');    
    });

    it('should not allow to buy less then 50 000 Human on second stage', function() {
        var etherAmount = web3.toWei(4.9, 'ether');
            return HumanTokenAllocatorContract.sendTransaction({
                from: holders[0],
                value: etherAmount
            })
            .then(function() {
                assert(false, 'less than 50 000 was sold on second stage');
            })
            .catch(function(e) {
                assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
            });
    });	

    it('shouldn\'t allow to exceed second stage cap', function() {
        var tx_Hash = 'someHash';
        return HumanTokenAllocatorContract.buyForInvestor(
               holders[0],
               32*Math.pow(10,18)*Math.pow(10,6),
               tx_Hash,
               {
                   from: controller
               }
        )
        .then(function() {
            assert(false, 'second stage cap was exceeded');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });
    });

    it('should set token price correctly', async function() {
    	await HumanTokenAllocatorContract.setPrice(1000, 25, {from: oracle});
        await HumanTokenAllocatorContract.sendTransaction({
            from: holders[2],
            value: web3.toWei(1, 'ether')
        });
        var balance = await HumanTokenContract.balanceOf.call(holders[2]);
        balance = BigNumber(balance);
        assert.deepEqual(
        	balance,
        	BigNumber(400000*Math.pow(10,18)), 
        	'tokens was not sold correctly');
    });


     it('should allow to withdraw ether', async function() {
     	var balanceContract = await web3.eth.getBalance(HumanTokenAllocatorContract.address);
     	balanceContract = BigNumber(balanceContract);
     	var companyBalance = await web3.eth.getBalance(company);
     	companyBalance = BigNumber(companyBalance);
     	await HumanTokenAllocatorContract.withdraw({from: allocatorOwner});
     	var companyBalanceAfter = await web3.eth.getBalance(company);
     	companyBalanceAfter = BigNumber(companyBalanceAfter);
     	assert.deepEqual(
         	balanceContract,
         	companyBalanceAfter.minus(companyBalance), 
         	'ether wasn\'t withdrawed'
         );
	});

	it('should allow to transfer human tokens', async function(){
		await HumanTokenContract.transfer(
                holders[3],
                100000, 
                {
                    from: holders[0]
                }
        );
        var balance = await HumanTokenContract.balanceOf.call(holders[3]);
    	assert.equal(
        	balance.toNumber(),
        	100000, 
        	'token wasn\'t transfered'
        );
	});

    it('should finsh token allocation', function() {
        return HumanTokenAllocatorContract.finish({
        	from: allocatorOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'token allocation was not finshed');
        })
    });

    it('should not allow to start first stage after finish', function() {
		return HumanTokenAllocatorContract.startFirstStage({
        	from: allocatorOwner
        })
        .then(function() {
            assert(false, 'first stage was started after finish');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });
    });
    
    it('should not sell tokens for ETH when allocation finshed', function() {
        var etherAmount = web3.toWei(1, 'ether');
            return HumanTokenAllocatorContract.sendTransaction({
                from: holders[0],
                value: etherAmount
            })
            .then(function() {
                assert(false, 'token was sold when when allocation finshed');
            })
            .catch(function(e) {
                assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
            });
    });

    it('should not sell tokens for other cryptocurriencies when allocation finshed', function() {
        var tokensAmount = randomInteger(100000, 10000000); 
        var tx_Hash = 'someHash';
        return HumanTokenAllocatorContract.buyForInvestor(
               holders[0],
               tokensAmount,
               tx_Hash,
               {
                   from: controller
               }
        )
        .then(function() {
            assert(false, 'token was sold when when allocation finshed');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });
    });


    it('should allow to add a new event', async function() {
        return HumanEvent.deployed()
        .then(function(instance) {
                var Contract = instance;
                HumanEventContract = Contract;
                return HumanTokenContract.addEvent(HumanEventContract.address, {
                	from: eventManager
                })
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'event was not added');
        })
    })
});

