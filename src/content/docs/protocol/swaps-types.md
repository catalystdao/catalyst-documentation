---
title: "Swaps Types"
description: "Catalyst supports 4 different types of swaps: Local Swaps, Cross-Chain Swaps, Underwritten Cross-chain swaps, and Logic Dependent Swaps. This allows Catalyst to bring the forefront of cross-chain innovation anywhere."
sidebar:
  order: 4
---

Catalyst has support for a wide range of swap types to suit any user.

## Local Swaps

Local swaps are instant swaps between tokens on the same chain. An example could be Ether (ETH) to USDC on Ethereum. Local swaps are instant and can access the full liquidity of the Catalyst vault. This has the same liquidity efficiency as a traditional CFMM AMM.

## Cross-Chain Swaps

Cross-chain swaps are non-instant swaps between tokens on two different chains. An example could be MATIC (on Polygon) to BNB (on BNB Chain). These swaps take time, as we need to examine both vaults for their balances. If the price changes during the swap, you will get back the original tokens provided minus a low swap fee.

### Underwriting

Catalyst also supports underwriting. Confirmation risk of underwritten swaps is sold to underwriters and in turn cross-chain swaps becomes almost instant.

A further advantage of underwritten swaps is that their [logic dependency](#logic-dependent-swaps) has to be true. This means if at any time the swap goes above the minimum output, the swap will instantly resolve. For some chains, underwritten swaps may take less than 12 seconds from confirmation to delivery of assets on the destination chain.

Underwriters underwriting their own swaps can get sub second swaps price finality. 😲

## Logic Dependent Swaps

By only committing to a swap if a certain logic returns true, Catalyst opens up for a host of new cross-chain applications. Developers can set any condition which can be programmed into a smart contract to determine whether or not to commit to the swap. If not, the swap reverts back to the sending chains.

Examples of use cases for logic dependent swaps:

- Buy an NFT: swap ETH (on Ethereum) to STARS (on Stargaze) to buy a Bad kid only if price of the NFT is ≤ 1000 STARS
- Buy & Stake: Buy Ether and stake it into Rocketpool if and only if there is space in the deposit pool.
- Governance fee collection: Send fees from a chain and only commit to the transfer if it can be exchanged at favorable rates.
- Rebalance WBTC between AAVE deployment: Only commit to the rebalance if the rate on the destination chain is higher than the sending chain.

Underwriting is conditional on the configured dependent logic. As a result, underwriter will continuously try to underwriter swaps if the conditions may change over time.

## Liquidity bootstrapping pools (LBPs)

Liquidity Bootstrapping Pools (LBPs) are pools that allow for dynamic changes in token weighting over time. The pool owner determines the starting and end weights and times, and has the ability to pause swaps. LBPs use a weighted math model that gradually adjusts the token price until it reaches market equilibrium.
