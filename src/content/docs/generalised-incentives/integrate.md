---
title: "Integrate GARP"
sidebar:
  order: 2
---

For the following tutorial we are going to assume you use Foundry. If you are using other frameworks, you may need to copy the relevant interfaces into your repository.

## Installation

To install Generalised Incentives as a dependency in your repository, run

```bash
forge install https://github.com/catalystdao/GeneralisedIncentives.git
```

This will add Generalised Incentives to your repository and you are now ready to integrate it into your contract.

## Integration

Start by adding import statements to your smart contract file. We need to import 2 files:

- [ICrossChainReceiver](https://github.com/catalystdao/GeneralisedIncentives/blob/main/src/interfaces/ICrossChainReceiver.sol): This will ensure you corretly implement the interfaces for the message callbacks
- [IIncentivizedMessageEscrow](https://github.com/catalystdao/GeneralisedIncentives/blob/main/src/interfaces/IIncentivizedMessageEscrow.sol): This will ensure you correctly call the message escrow correctly.
- [Optionally] [IMessageEscrowStructs](https://github.com/catalystdao/GeneralisedIncentives/blob/main/src/interfaces/IMessageEscrowStructs.sol): To simplify struct handling.

Adding these to your contract will look something like this:

```solidity
//SPDX-License-Identifier: <YOUR_LICENSE_HERE>
pragma solidity ^0.Y.X;

import { ICrossChainReceiver } from "GeneralisedIncentives/src/interfaces/ICrossChainReceiver.sol";
import { IIncentivizedMessageEscrow } from "GeneralisedIncentives/src/interfaces/IIncentivizedMessageEscrow.sol";
import { IMessageEscrowStructs } from "GeneralisedIncentives/src/interfaces/IMessageEscrowStructs.sol";

contract YourContract is ICrossChainReceiver, IMessageEscrowStructs {
  ...
}
```

The integration is less opinionated than other cross-chain endpoint, as we need to define some boilercode. First, lets set our escrow endpoint. Below we present 2 options

1. Set the escrow explicity. This defines a single escrow which you may interact in. This may be desired to reduce complexity but also introduces some vendor lock-in.
2. Define a list of escrow that are allowed. This allows you to pick and chose which AMB is best suited for a certain connection. This introduces some additional complexity but mitigates vendor lock-in.

```solidity
contract YourContract is ICrossChainReceiver, IMessageEscrowStructs {

  // Solution 1 sets the escrow explicitly. If you don't plan on changing
  // AMB in the future immutable save gas when read. However, you can also
  // forgo the immutable word to be able to change the escrow.
  // We recommend setting the storage or exposting it to let other people
  // know which escrow this contract is using.
  IIncentivizedMessageEscrow immutable public escrow;

  // Solution 2 sets a map between escrow addresses and booleans. This
  // is significantly more customizable as it allows for multiple AMBs
  // to be used from a single contract. With a bit further modification
  // you can also set which escrows are allowed for which chain identifiers.
  mapping(address => bool) approvedEscrows;

  constructor(address escrow) {
    // Solution 1: Set the escrow.
    escrow = IIncentivizedMessageEscrow(escrow);
    // Solution 2: Store the escrow as approved.
    approvedEscrows[escrow] = true;
  }

  // We need to validate senders. Lets define a custom error for our approval modifier.
  error NotApprovedEscrow();
  // Validating function inputs if most often done with modifiers as it reduces
  // code reuse. We will define onlyEscrow() as a check on msg.sender.
  modifer onlyEscrow() {
    // Solution 1: We can simply check explicitly if there is a match.
    // if the caller isn't the escrow, revert with NotApprovedEscrow
    if (msg.sender != address(escrow)) revert NotApprovedEscrow();
    // Solution 2: We need to make a lookup to check if the caller is approved.
    // if the caller isn't the approved, revert with NotApprovedEscrow
    if (!approvedEscrows(msg.sender)) revert NotApprovedEscrow();
  }
}
```
