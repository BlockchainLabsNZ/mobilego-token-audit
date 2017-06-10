# MobileGo Token Audit

## Preamble
This audit report was undertaken by BlockchainLabs.nz for the purpose of providing feedback to MobileGo/GameCredits. It has subsequently been shared publicly without any express or implied warranty.

Solidity contracts were provided by MobileGo throughout the audit in response to feedback. The final version of the contract is available at [/contracts/MobileGoToken.sol](https://github.com/BlockchainLabsNZ/mobilego-token-audit/blob/master/contracts/MobileGoToken.sol). The Mist version of the contract [/mist/MobileGoToken.sol](https://github.com/BlockchainLabsNZ/mobilego-token-audit/blob/master/mist/MobileGoToken.sol) is the deployed version [viewable on etherscan.io](https://etherscan.io/address/0x40395044Ac3c0C57051906dA938B54BD6557F212) as at address `0x40395044Ac3c0C57051906dA938B54BD6557F212` created in block `3819004` - we would encourage all community members and token holders to make their own assessment of the contracts.

## Scope
All Solidity code contained in [/contracts/](https://github.com/BlockchainLabsNZ/mobilego-token-audit/tree/master/contracts) was considered in scope and used as a basis for static and dynamic analysis. The tests contained in [/test/](https://github.com/BlockchainLabsNZ/mobilego-token-audit/tree/master/test) were created for the purpose of this audit and provided to MobileGo.

## Focus Areas
The audit report is focused on the following key areas - though this is *not an exhaustive list*.

#### Correctness
* No correctness defects uncovered during static analysis?
* No implemented contract violations uncovered during execution?
* No other generic incorrect behavior detected during execution?
* Adherence to adopted standards such as ERC20?

#### Testability
* Test coverage across all functions and events?
* Test cases for both expected behaviour and failure modes?
* Settings for easy testing of a range of parameters?
* No reliance on nested callback functions or console logs?
* Avoidance of test scenarios calling other test scenarios?

#### Security
* No presence of known security weaknesses?
* No funds at risk of malicious attempts to withdraw/transfer?
* No funds at risk of control fraud?
* Prevention of Integer Overflow or Underflow?

#### Best Practice
* Explicit labeling for the visibility of functions and state variables?
* Proper management of gas limits and nested execution?
* Latest version of the Solidity compiler?

## Classification

#### Defect Severity
* **Minor** - A defect that does not have a material impact on the contract execution and is likely to be subjective.
* **Moderate** - A defect that could impact the desired outcome of the contract execution in a specific scenario.
* **Major** - A defect that impacts the desired outcome of the contract execution or introduces a weakness that may be exploited.
* **Critical** - A defect that presents a significant security vulnerability or failure of the contract across a range of scenarios.

## Findings
#### Minor
* **Burn** - The implementation of the burn function should not process the burning of 0 tokens as this consumes Ether on a transaction that will not change the state of the contract.
* **Testability** - The provided tests only cover the expected behaviour of the Contract. Tests that cover failure modes should be considered important.
* **Supply values** - `_totalSupply` is declared with the explicit value of 1000000000000000, which is required later in the `amountBurned` function, therefore best practice would be to declare an `_initialSupply` variable that can be reused thus avoiding any potential typo of the large integer.
* **Compiler version** - The contract was written for an old version of the Solidity compiler (0.4.9). We recommend changing the solidity version pragma to the latest version `pragma solidity ^0.4.11;`.
* **Reserved word** - `address` is a reserved word in Solidity, the use of address in the `Burn` event was therefore not correct and should be changed to `from`.
* **Typo** - `reciever` should be `receiver` within the `transferToContract` function.
* **Repeated code** - There are two identical checks whether the transfer is viable - first in the `transfer` function and again in the `transferToAddress` or `transferToContract` function. This is a waste of gas and should occur only once.

#### Moderate
* **Overload transfer** - Overloading the `transfer` function without the data parameter is not returning true even though it was successful.
* **Function visibility** - Multiple internal functions were incorrectly declared public by default. It is important to explicitly label the visibility of functions and state variables throughout the contract.

#### Major
_No major defects were found during this audit._

#### Critical
_No critical defects were found during this audit._

## Conclusion
We were satisfied with the responsiveness of the MobileGo team in addressing defects and resolving them appropriately. The final version of the contract that was deployed passes all the tests for ERC20/223 functionality and does not exhibit any known security vulnerabilities.
