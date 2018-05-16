# Human Contract

## Code

#### HumanTokenAllocator

The contract that issues Human Tokens

**Contstructor**
```cs
function HumanTokenAllocator(
        address _owner,
        address _oracle,
        address _company,
        address _teamFund,
        address _eventManager
    )
```

**Fallback function**
```cs
function() external payable
```

**setRate**
```cs
function setRate(uint _rateEth) external onlyOracle
```
Function to set rate of ETH

**setPrice**
```cs
function setPrice(uint _numerator, uint _denominator) external onlyOracle
```
Function to current token price

**buyForInvestor**
```cs
function buyForInvestor(
        address _holder, 
        uint _humanValue, 
        string _txHash
    ) 
        external 
        onlyControllers
```
Function to issue tokens for the investors who made purchases in other cryptocurrencies

**buy**
```cs
function buy(address _holder, uint _humanValue) internal
```
Function to issue tokens for investors who paid in ether

**addController**
```cs
function addController(address _controller) onlyOwner external
```
Function to add an address tot the controllers

**startFirstStage**
```cs
function startFirstStage() public onlyOwner
```
Function to start the first stage of human token allocation

**startSecondStage**
```cs
function startSecondStage() public onlyOwner
```
Function to start the second stage of human token allocation

**finish**
```cs
function finish() public onlyOwner
```
Function to finish human token allocation

**enable**
```cs
function enable() public onlyOwner
```
Function to enable token allocation

**disable**
```cs
function disable() public onlyOwner
```
Function to disable token allocation

**withdraw**
```cs
function withdraw() external onlyOwner
```
Function to withdraw ether

**transferAnyTokens**
```cs
function transferAnyTokens(address tokenAddress, uint tokens) 
        public
        onlyOwner
        returns (bool success)
```
Allows owner to transfer out any accidentally sent ERC20 tokens

#### Human Token Contract

Human Token smart-contract itself.

**HumanToken**
```cs
function HumanToken(address _owner, address _eventManager) public
``` 
Contract constructor sets owner address

**addEvent**
```cs
function  addEvent(address _event) external onlyEventManager
```
Function to add a new event from TheHuman team

**setVoteCost**
```cs
function setVoteCost(uint _voteCost) external onlyEventManager
```
Function to change vote cost, by default vote cost equals 1 Human token

**donate**
```cs
function donate(address _event, uint _amount) public onlyActive(_event)
```
Function to donate for event

**vote**
```cs
function vote(address _event, bool _proposal) public onlyActive(_event)
```
Function voting for the success of the event

```mintTokens**
```cs
function mintTokens(address _holder, uint _value) external onlyOwner
```
Function to mint tokens

**balanceOf**
```cs
function balanceOf(address _holder) constant returns (uint)
```
Get balance of tokens holder

**transfer**
```cs
function transfer(address _to, uint _amount) public returns (bool)
```
Send coins throws on any error rather than return a false flag to minimize user errors

**transferFrom**
```cs
function transferFrom(address _from, address _to, uint _amount) public returns (bool)
```
An account/contract attempts to get the coins. Throws on any error rather than return a false flag to minimize user errors

**approve**
```cs
function approve(address _spender, uint _amount) public returns (bool)
```
Allows another account/contract to spend some tokens on its behalf throws on any error rather than return a false flag to minimize user errors also, to minimize the risk of the approve/transferFrom attack vector approve has to be called twice in 2 separate transactions - once to
change the allowance to 0 and secondly to change it to the new allowance value

**allowance**
```cs
function allowance(address _owner, address _spender) constant returns (uint)
```
Function to check the number of tokens that an owner allowed to a spender.

**transferAnyTokens**
```cs
function transferAnyTokens(address tokenAddress, uint tokens) 
        public
        onlyOwner 
        returns (bool success)
```
Allows owner to transfer out any accidentally sent ERC20 tokens

#### HumanEvent Contract

**HumanEvent**
```cs
function HumanEvent(
        address _owner, 
        uint _softCap,
        address _alternative,
        address _human
    ) public
```
HumanEvent constructor function, sets owner, soft cap, alternative.

**startFundraising**
```cs
function startFundraising() public onlyOwner
```
Function that starts fundraising.

**startEvaluating**
```cs
function startEvaluating() public onlyOwner
```
The function that sets the status of the contract to "Evaluating" if the soft cap is raised or failed otherwise.

**startVoting**
```cs
function startVoting() public onlyOwner
```
Function that starts voting if contract status is "Evaluating"

**finish**
```cs
function finish() public onlyOwner
```
The function that finishes voting and sets contract status to: "Finished", if voting was successful or "Failed" otherwise.

**claim**
```cs
function claim() public
```
The function that allows claiming tokens back.

**vote**
```cs
function vote(address _voter, bool _proposal) external onlyHuman returns (bool)
```
Function for voting.

**contribute**
```cs
function contribute(address _contributor, uint _amount) external onlyHuman returns(bool)
```
Function to donate for event.

**withdraw**
```cs
function  withdraw() external onlyOwner
```
Function for the owner to withdraw raised funds from the event.


## Prerequisites
1. nodejs, and make sure it's version above 8.0.0
2. npm
3. truffle
4. testrpc

## Run tests
1. run `testrpc -a 20 -l 8000000` in terminal
2. run `truffle test` in another terminal to execute tests.

