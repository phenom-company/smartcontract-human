// var HumanToken = artifacts.require("HumanToken.sol");

// /* 
// ====================================================================================================
// HumanToken tests
// ====================================================================================================
// */

// contract('HumanToken', function(accounts) {
//     function randomInteger(min, max) {
//         var rand = min - 0.5 + Math.random() * (max - min + 1)
//         rand = Math.round(rand);
//         return rand;
//     };
//     var HumanTokenContract; 
//     // Outside addresses
//     var Owner = accounts[0];
//     var notOwner = accounts[1];
//     var investor = accounts[2];
//     var notInvestor = accounts[3];

  
//     it('should correctly init owner address and total supply', async function() {
//     	HumanTokenContract = await HumanToken.deployed();
//     	var TrueOwner = await HumanTokenContract.owner.call();
//     	var totalSupply = await HumanTokenContract.totalSupply.call();
//     	var ownerBalance = await HumanTokenContract.balanceOf.call(Owner);
//     	assert.equal(Owner, TrueOwner, 'owner was set incorrectly');
//     	assert.equal(parseFloat(totalSupply), 4.6e+25, 'total supply was set incorrectly');
//     	assert.equal(
//     		parseFloat(ownerBalance), 
//     		parseFloat(totalSupply), 
//     		'owner\'s balance was set incorrectly'
//     	)
//     });

// 	it('shouldn\'t allow to transfer tokens for someone who hasn\'t tokens', function() {
// 	    var random_int = randomInteger(100000, 1000000);
// 	    return HumanTokenContract.transfer(
// 	            	investor,
// 	            	random_int,
// 	            	{
// 	            	from: notInvestor
// 	            	}
// 	     )
// 	    .then(function() {
// 	        assert(false, 'tokens were transfered');
// 	    })
// 	    .catch(function(e) {
// 	    })
// 	});
    
	
// 	it('shouldn\'t allow send ether to contract address', function() {
// 		var etherAmout = randomInteger(1, 10);
// 		HumanTokenContract.sendTransaction({
//         	from: investor,
//         	value: web3.toWei(etherAmout, 'ether')
//         })
//         .then(function() {
//         	assert(false, 'ether was sended');
//         })
//        	.catch(function(e) {
// 	    assert.equal(e.message,'VM Exception while processing transaction: revert', 'ether was sended');
// 	    })
// 	});    

// 	it('should allow to transfer tokens', async function() {
// 	    var random_int = randomInteger(100000, 1000000);
// 	    await HumanTokenContract.transfer(
// 	    	investor,
// 	    	parseFloat(random_int + 'E18'),
// 	    	{
// 	    	from: Owner
// 	    	}
// 	    );
// 	    var balance = await HumanTokenContract.balanceOf.call(investor);
// 	    assert.equal(parseFloat(balance.toString()), parseFloat(random_int + 'E18'), 'tokens wasn\'t transfered correctly');

// 	});


// 	it('should allow to burn amount of tokens that is greater than balance', async function() {
// 		var balance = await HumanTokenContract.balanceOf.call(investor);
// 		var burned = true;
// 		try {
// 			await HumanTokenContract.burn(
// 	    	     	parseFloat(balance) * 2,
// 	    	     	{
// 	    	     	from: investor
// 	    	     	}
// 	    	);
// 	    } catch (e) {
// 	    	burned = false;
// 	    }
// 	    assert(!burned, 'were burned too many token');
// 	});


// 	it('should burn tokens correctly', async function() {
// 		var balanceBefore = await HumanTokenContract.balanceOf.call(investor);
// 		var totalSupplyBefore = await HumanTokenContract.totalSupply.call();
// 		await HumanTokenContract.burn(
// 	         	parseFloat(balanceBefore),
// 	         	{
// 	         	from: investor
// 	         	}
// 	    );
// 	    var balanceAfter = await HumanTokenContract.balanceOf.call(investor);
// 		var totalSupplyAfter = await HumanTokenContract.totalSupply.call();
// 		assert.equal(parseFloat(balanceAfter.toString()), 0 ,'tokens weren\'t burnt');
// 		assert.equal(
// 			Math.round((parseFloat(totalSupplyBefore.toString()) - parseFloat(balanceBefore.toString())) / parseFloat(totalSupplyAfter.toString())),
// 			1,
// 			'total supply wasn\'t decreased'
// 		);
// 	});	


// });