---
title: "Integrate GARP"
description: "Add Generalised Incentives to your contract today!"
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

- [ICrossChainReceiver](https://github.com/catalystdao/GeneralisedIncentives/blob/main/src/interfaces/ICrossChainReceiver.sol): This will ensure you correctly implement the interfaces for the message callbacks
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

### Defining Structures

The integration is less opinionated than other cross-chain endpoint, as we need to define some boilercode. First, lets set our escrow endpoint. Below we present 2 options

1. Set the escrow explicitly. This defines a single escrow which you may interact in. This may be desired to reduce complexity but also introduces some vendor lock-in.
2. Define a list of escrow that are allowed. This allows you to pick and choose which AMB is best suited for a certain connection. This introduces some additional complexity but mitigates vendor lock-in.

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

  // We need to validate senders. Lets define a custom error for our modifier.
  error NotApprovedEscrow();
  // Validating function inputs if most often done with modifiers as it reduces
  // code reuse. We will define onlyEscrow() as a check on msg.sender.
  modifier onlyEscrow() {
    // Solution 1: We can simply check explicitly if there is a match.
    // if the caller isn't the escrow, revert with NotApprovedEscrow
    if (msg.sender != address(escrow)) revert NotApprovedEscrow();
    // Solution 2: We need to make a lookup to check if the caller is approved.
    // if the caller isn't the approved, revert with NotApprovedEscrow
    if (!approvedEscrows(msg.sender)) revert NotApprovedEscrow();
    _;
  }
}
```

### Callbacks

Generalised Incentives defines 2 callback functions we need to implement:

- receiveAck: Called when a message has been processed on the destination.
- receiveMessage: Called when you receive a message from the source chain.

Lets add these functions to our contract

```solidity

contract YourContract is ICrossChainReceiver, IMessageEscrowStructs {
  error AckAlreadyDelivered();

  event WowAck(
    bytes1 status,
    bytes acknowledgement,
  );

  // Generalised Incentives allows replaying acks. As a result, it is important
  // that you ensure that acks cannot be delivered multiple times.
  mapping(bytes => bool) ackSpent;

  // Remember to add your onlyEscrow modifier.
  function receiveAck(bytes32 destinationIdentifier, bytes32 messageIdentifier, bytes calldata acknowledgement) onlyEscrow() external {

    if (ackSpent[acknowledgement]) revert AckAlreadyDelivered();
    ackSpent[acknowledgement] = true;

    // Wow, much ACK!
    // IF the transaction fails, the first byte of the transaction is an error code and
    // the rest of the package is your original message. Use this to your advantage.
    emit WowAck(acknowledgement[0], acknowledgement[1:]);
  }

  // Remember to add your onlyEscrow modifier.
  function receiveMessage(bytes32 sourceIdentifierbytes, bytes32 messageIdentifier, bytes calldata fromApplication, bytes calldata message) onlyEscrow() external returns(bytes memory acknowledgement) {
    // Do some processing and then return back your ack.
    // Notice that we are sending back 00 before our message.
    // That is because if the message fails for some reason,
    // an error code is prepended to the message.
    // By always sending back hex"00", we ensure that the first byte is unused.
    // Alternatively, use this byte as our own failure code.
    return bytes.concat(
      hex"00",
      keccak(message)
    );
  }
}
```

We now implemented the reference code for Generalised incentives and is ready for processing messages sent to us.

:::danger
Ack messages can be replayed! Ensure that acks cannot be submitted to your contract twice. In the above example we check if a message has already been delivered by looking it up in a map. There are other ways to facilitate this, like checking against a piece of data in the ack.
:::

For more information, check the relevant [natspecs](https://github.com/catalystdao/GeneralisedIncentives/blob/main/src/interfaces/ICrossChainReceiver.sol).

### Sending Messages

We haven't actually sent any messages yet. Lets do that. For simplicity, this section assumes that you used solution 1.

```solidity

contract YourContract is ICrossChainReceiver, IMessageEscrowStructs {
  // If your contract didn't inherit IMessageEscrowStructs, you may have to
  // set the type of incentive to IIncentivizedMessageEscrow.IncentiveDescription.
  function sendMessage(bytes32 destinationIdentifier, bytes destinationAddress, bytes calldata message, IncentiveDescription calldata incentive, uint64 deadline) payable external {
    // Submit the message to the escrow. Remember to add associated value.
    // If you send excess, it will be sent to incentive.refundGasTo.
    escrow.submitMessage{value: msg.value}(
        destinationIdentifier,
        destinationAddress,
        message,
        incentive,
        deadline
    );
  }
}
```
