var HumanToken = artifacts.require("HumanToken.sol");
var HumanTokenAllocator = artifacts.require("HumanTokenAllocator.sol");
var HumanEvent = artifacts.require("HumanEvent.sol");
var BigNumber = require('bignumber.js');

/* 
====================================================================================================
Human event tests(cap reached)
====================================================================================================
*/

contract('Human event contract(cap reached)', function(accounts) {
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
    var eventCap = 100000000000000000000;
    var holders = [accounts[9], accounts[10], accounts[11], accounts[12], accounts[13]];
    var notHolder = accounts[14];
    var notEvent = accounts[15];

/* 
====================================================================================================
Start of testing
====================================================================================================
*/    

	it('should init token holders and add event for testing', async function(){
		HumanTokenAllocatorContract = await HumanTokenAllocator.deployed();
		var token = await HumanTokenAllocatorContract.Human.call();
        HumanTokenContract = HumanToken.at(token);
        HumanEventContract = await HumanEvent.deployed();
        await HumanTokenAllocatorContract.startFirstStage({from: allocatorOwner});
        await HumanTokenAllocatorContract.addController(controller, {from: allocatorOwner});
        var tx_Hash = 'someHash';
        for (holder of holders){
        	await HumanTokenAllocatorContract.buyForInvestor(
               holder,
               100000000000000000000,
               tx_Hash,
               {
                   from: controller
               }
        	);
        }
        await HumanTokenContract.addEvent(HumanEventContract.address, {from: eventManager});

	});

	it('shouldn\'t allow to donate to not active event', function(){
		return HumanTokenContract.donate(
			notEvent,
			100,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token was sold when when ico status is created');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	})

	it('shouldn\'t allow to vote to not active event', function(){
		return HumanTokenContract.vote(
			notEvent,
			true,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token was sold when when ico status is created');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('shouldn\'t allow to donate to event when its status is created', function(){
		return HumanTokenContract.donate(
			HumanEventContract.address,
			100,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token was sold when when ico status is created');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('shouldn\'t allow to vote to event when its status is created', function(){
		return HumanTokenContract.vote(
			HumanEventContract.address,
			true,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token holder voten when status is created');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

    it('should start fundrasing', function() {
        return HumanEventContract.startFundraising({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        })
    });


	it('shouldn\'t allow to donate to not human token address', function(){
		return HumanEventContract.contribute(
			notEvent,
			100,
			{
				from: notEvent
			}
		)
        .then(function() {
            assert(false, 'donate from random account');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	})

	it('shouldn\'t allow to vote to event when its status is fundrasing', function(){
		return HumanTokenContract.vote(
			HumanEventContract.address,
			true,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token holder voten when status is fundrasing');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('should allow to donate to event when its status is fundrasing', async function(){
		var donation = BigNumber(Math.round(eventCap/2));
		for (var i = 0; i < 3; i++) {
			await HumanTokenContract.donate(
				HumanEventContract.address,
				donation.toNumber(),
				{
					from: holders[i]
				}
			);
		}
		var balance = await HumanTokenContract.balanceOf.call(HumanEvent.address);
		assert.deepEqual(
			BigNumber(balance),
			donation.times(3),
			"donation is not correct"
			);
	});

    it('should start evaluating', function() {
        return HumanEventContract.startEvaluating({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        })
    });


	it('shouldn\'t allow to vote to event when its status is evaluating', function(){
		return HumanTokenContract.vote(
			HumanEventContract.address,
			true,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token holder voten when status is evaluating');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('shouldn\'t allow to donate to event when its status is evaluating', function(){
		return HumanTokenContract.donate(
			HumanEventContract.address,
			100,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token was sold when when ico status is created');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});


    it('should start voting', function() {
        return HumanEventContract.startVoting({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        })
    });    

	it('shouldn\'t allow to vote to not human token', function(){
		return HumanEventContract.vote(
			notEvent,
			true,
			{
				from: notEvent
			}
		)
        .then(function() {
            assert(false, 'voted from random account');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('shouldn\'t allow to donate to event when its status is voting', function(){
		return HumanTokenContract.donate(
			HumanEventContract.address,
			100,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token was sold when when ico status is created');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('shouldn\'t allow to vote for not token holder', function(){
		return HumanTokenContract.vote(
			HumanEventContract.address,
			true,
			{
				from: notHolder
			}
		)
        .then(function() {
            assert(false, 'not token holder voted');
        })
        .catch(function(e) {
        });		
	});

	it('should perform voting correctly', async function(){
		var balanceBefore = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceBefore = BigNumber(balanceBefore);
		await HumanTokenContract.vote(
			HumanEventContract.address,
			true,
			{
				from: holders[0]
			}
		);
		var balanceAfter = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceAfter = BigNumber(balanceAfter);
		var voteCost = await HumanTokenContract.voteCost.call();
		voteCost = BigNumber(voteCost);
		assert.deepEqual(
			balanceBefore.minus(balanceAfter),
			voteCost,
			"voting is not correct"
			);
	});

	it('shouldn\'t allow to vote twice', function(){
		return HumanTokenContract.vote(
			HumanEventContract.address,
			true,
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'token holder voted twice');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});


    it('should finish event', function() {
        return HumanEventContract.finish({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        }) 
    });

	it('shouldn\'t allow to claim when event successfully finished', function(){
		return HumanEventContract.claim(
			{
				from: holders[1]
			}
		)
        .then(function() {
            assert(false, 'tokens were claimed');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('should allow to claim vote token', async function(){
		var balanceBefore = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceBefore = BigNumber(balanceBefore);
		await HumanEventContract.claim(
			{
				from: holders[0]
			}
		);
		var balanceAfter = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceAfter = BigNumber(balanceAfter);
		var voteCost = await HumanTokenContract.voteCost.call();
		voteCost = BigNumber(voteCost);
		assert.deepEqual(
			balanceAfter.minus(balanceBefore),
			voteCost,
			"voting is not correct"
			);
	});

	it('shouldn\'t allow to claim twice', function(){
		return HumanEventContract.claim(
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'tokens were claimed twice');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('should allow to withdraw tokens', async function(){
		var balanceBefore = await HumanTokenContract.balanceOf.call(alternative);
		var contractBalance = await HumanTokenContract.balanceOf.call(HumanEventContract.address);
		contractBalance = BigNumber(contractBalance);
		balanceBefore = BigNumber(balanceBefore);
		await HumanEventContract.withdraw(
			{
				from: eventOwner
			}
		);
		var balanceAfter = await HumanTokenContract.balanceOf.call(alternative);
		balanceAfter = BigNumber(balanceAfter);
		assert.deepEqual(
			balanceAfter.minus(balanceBefore),
			contractBalance,
			'withdrawing is not correct'
			);
	});
});

/* 
====================================================================================================
Human event tests(cap isn't reached)
====================================================================================================
*/    

contract('Human event contract(cap is not reached)', function(accounts) {
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
    var eventCap = 100000000000000000000;
    var holders = [accounts[9], accounts[10], accounts[11], accounts[12], accounts[13]];
    var notHolder = accounts[14];
    var notEvent = accounts[15];

/* 
====================================================================================================
Start of testing
====================================================================================================
*/    

	it('should init token holders and add event for testing', async function(){
		HumanTokenAllocatorContract = await HumanTokenAllocator.deployed();
		var token = await HumanTokenAllocatorContract.Human.call();
        HumanTokenContract = HumanToken.at(token);
        HumanEventContract = await HumanEvent.deployed();
        await HumanTokenAllocatorContract.startFirstStage({from: allocatorOwner});
        await HumanTokenAllocatorContract.addController(controller, {from: allocatorOwner});
        var tx_Hash = 'someHash';
        for (holder of holders){
        	await HumanTokenAllocatorContract.buyForInvestor(
               holder,
               100000000000000000000,
               tx_Hash,
               {
                   from: controller
               }
        	);
        }
        await HumanTokenContract.addEvent(HumanEventContract.address, {from: eventManager});

	});

    it('should start fundrasing', function() {
        return HumanEventContract.startFundraising({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        })
    });


	it('should allow to donate to event when its status is fundrasing', async function(){
		var donation = BigNumber(Math.round(eventCap/3));
		for (var i = 0; i < 3; i++) {
			await HumanTokenContract.donate(
				HumanEventContract.address,
				donation.toNumber(),
				{
					from: holders[i]
				}
			);
		}
		var balance = await HumanTokenContract.balanceOf.call(HumanEvent.address);
		assert.deepEqual(
			BigNumber(balance),
			donation.times(3),
			"donation is not correct"
			);
	});

    it('should start evaluating', function() {
        return HumanEventContract.startEvaluating({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        })
    });


    it('shouldn\'t allow to start voting when cap isn\'t reached', function() {
        return HumanEventContract.startVoting({
        	from: eventOwner
        })
        .then(function() {
            assert(false, 'voting was started');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });
    });    

    it('shouldn\'t allow to withdraw when cap isn\'t reached', function() {
        return HumanEventContract.withdraw({
        	from: eventOwner
        })
        .then(function() {
            assert(false, 'tokens were withdrawed');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });
    });    
	
	it('should allow to claim tokens', async function(){
		var balanceBefore = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceBefore = BigNumber(balanceBefore);
		var contribution = await HumanEventContract.contributions.call(holders[0]);
		await HumanEventContract.claim(
			{
				from: holders[0]
			}
		);
		var balanceAfter = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceAfter = BigNumber(balanceAfter);
		contribution = BigNumber(contribution);
		assert.deepEqual(
			balanceAfter.minus(balanceBefore),
			contribution,
			"voting is not correct"
			);
	});


	it('shouldn\'t allow to claim twice', function(){
		return HumanEventContract.claim(
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'tokens were claimed twice');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});
});


/* 
====================================================================================================
Human event tests(voting failed)
====================================================================================================
*/

contract('Human event contract(voting failed)', function(accounts) {
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
    var eventCap = 100000000000000000000;
    var holders = [accounts[9], accounts[10], accounts[11], accounts[12], accounts[13]];
    var notHolder = accounts[14];
    var notEvent = accounts[15];

/* 
====================================================================================================
Start of testing
====================================================================================================
*/    

	it('should init token holders and add event for testing', async function(){
		HumanTokenAllocatorContract = await HumanTokenAllocator.deployed();
		var token = await HumanTokenAllocatorContract.Human.call();
        HumanTokenContract = HumanToken.at(token);
        HumanEventContract = await HumanEvent.deployed();
        await HumanTokenAllocatorContract.startFirstStage({from: allocatorOwner});
        await HumanTokenAllocatorContract.addController(controller, {from: allocatorOwner});
        var tx_Hash = 'someHash';
        for (holder of holders){
        	await HumanTokenAllocatorContract.buyForInvestor(
               holder,
               100000000000000000000,
               tx_Hash,
               {
                   from: controller
               }
        	);
        }
        await HumanTokenContract.addEvent(HumanEventContract.address, {from: eventManager});

	});


    it('should start fundrasing', function() {
        return HumanEventContract.startFundraising({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        })
    });


	it('should allow to donate to event when its status is fundrasing', async function(){
		var donation = BigNumber(Math.round(eventCap/2));
		for (var i = 0; i < 3; i++) {
			await HumanTokenContract.donate(
				HumanEventContract.address,
				donation.toNumber(),
				{
					from: holders[i]
				}
			);
		}
		var balance = await HumanTokenContract.balanceOf.call(HumanEvent.address);
		assert.deepEqual(
			BigNumber(balance),
			donation.times(3),
			"donation is not correct"
			);
	});

    it('should start evaluating', function() {
        return HumanEventContract.startEvaluating({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        })
    });


    it('should start voting', function() {
        return HumanEventContract.startVoting({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        })
    });    


	it('should perform voting correctly', async function(){
		var balanceBefore = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceBefore = BigNumber(balanceBefore);
		await HumanTokenContract.vote(
			HumanEventContract.address,
			false,
			{
				from: holders[0]
			}
		);
		var balanceAfter = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceAfter = BigNumber(balanceAfter);
		var voteCost = await HumanTokenContract.voteCost.call();
		voteCost = BigNumber(voteCost);
		assert.deepEqual(
			balanceBefore.minus(balanceAfter),
			voteCost,
			"voting is not correct"
			);
		await HumanTokenContract.vote(
			HumanEventContract.address,
			false,
			{
				from: holders[3]
			}
		);
	});


    it('should finish event', function() {
        return HumanEventContract.finish({
        	from: eventOwner
        })
        .then(function(tx) {
            assert(tx.receipt.status == 1, 'fundrasing was not started');
        }) 
    });

    it('shouldn\'t allow to withdraw when voting failed', function() {
        return HumanEventContract.withdraw({
        	from: eventOwner
        })
        .then(function() {
            assert(false, 'tokens were withdrawed');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });
    });    
	
	it('should allow to claim tokens', async function(){
		var balanceBefore = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceBefore = BigNumber(balanceBefore);
		var contribution = await HumanEventContract.contributions.call(holders[0]);
		await HumanEventContract.claim(
			{
				from: holders[0]
			}
		);
		var balanceAfter = await HumanTokenContract.balanceOf.call(holders[0]);
		balanceAfter = BigNumber(balanceAfter);
		contribution = BigNumber(contribution);
		var voteCost = await HumanTokenContract.voteCost.call();
		voteCost = BigNumber(voteCost);
		assert.deepEqual(
			balanceAfter.minus(balanceBefore),
			contribution.plus(voteCost),
			"voting is not correct"
			);
	});


	it('shouldn\'t allow to claim twice', function(){
		return HumanEventContract.claim(
			{
				from: holders[0]
			}
		)
        .then(function() {
            assert(false, 'tokens were claimed twice');
        })
        .catch(function(e) {
            assert(e.message == 'VM Exception while processing transaction: revert', 'wrong err message');
        });		
	});

	it('should allow to claim vote token', async function(){
		var balanceBefore = await HumanTokenContract.balanceOf.call(holders[3]);
		balanceBefore = BigNumber(balanceBefore);
		await HumanEventContract.claim(
			{
				from: holders[3]
			}
		);
		var balanceAfter = await HumanTokenContract.balanceOf.call(holders[3]);
		balanceAfter = BigNumber(balanceAfter);
		var voteCost = await HumanTokenContract.voteCost.call();
		voteCost = BigNumber(voteCost);
		assert.deepEqual(
			balanceAfter.minus(balanceBefore),
			voteCost,
			"voting is not correct"
			);
	});
});
