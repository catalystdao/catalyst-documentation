---
title: "Asset Delivery Callbacks"
description: "Cross-Cats supports callbacks on both output delivery and input delivery."
sidebar:
  order: 101
---

Cross-Cats supporting making external on delivery of assets. However, there are several important implementation quirks that you need to be aware of.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/**
 * @notice Implement callback handling for Cross cats payouts, both outputs and inputs.
 * @dev Callbacks are opt-in. If you opt-in, take care to not revert.
 * Funds are likely in danger if the calls revert. Please be careful.
 *
 * If you don't need this functionality, stay away.
 * To enable for outputs, set `remoteCall` to the calldata. recipient is called.
 * To enable for inputs, use fillerData version 2. You set a hash of the data.
 * The first 20 bytes of the data is called.
 */
interface ICrossCatsCallback {
    /**
     * @notice If configured, is called when the output is filled on the destination chain.
     * @dev If the transaction reverts, 1 million gas is provided.
     * If the transaction doesn't revert, only enough gas to execute the transaction is given + a buffer of 1/63'th.
     * The recipient is called.
     * If the call reverts, funds are still delivered to the recipient.
     * Please ensure that funds are safely handled on your side.
     */
    function outputFilled(bytes32 token, uint256 amount, bytes calldata executionData) external;

    /**
     * @notice If configured, is called when the input is sent to the filler.
     * May be called for under the following conditions:
     * - The inputs is purchased by someone else (/UW)
     * - The inputs are optimistically refunded.
     * - Output delivery was proven.
     *
     * You can use this function to add custom conditions to purchasing an order / uw.
     * If you revert, your order cannot be purchased.
     * @dev If this call reverts / uses a ton of gas, the data has to be modified (modifyOrderFillerdata)
     * This function can ONLY be called by the filler itself rather than anyone.
     * If the fillerAddress is unable to call modifyOrderFillerdata, take care to ensure the function
     * never reverts as otherwise the inputs are locked.
     *
     * executionData is never explicitly provided on chain, only a hash of it is. If this is not
     * publicly known, it can act as a kind of secret and people cannot call the main functions.
     * If you lose it you will have to call modifyOrderFillerdata which only the registered filler can.
     *
     * The address to call is the first 20 bytes of the data to execute.
     *
     * @param orderKeyHash Hash of the order key. Can be used for identification.
     * @param executionData Custom data that the filler asked to be provided with the call.
     */
    function inputsFilled(bytes32 orderKeyHash, bytes calldata executionData) external;
}
```

(WIP)

## Output delivery

## Input Delivery
