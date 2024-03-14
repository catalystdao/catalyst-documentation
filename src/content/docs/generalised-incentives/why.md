---
title: "Integration"
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
