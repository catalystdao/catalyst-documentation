---
title: "Transaction Lifecycle"
sidebar:
  order: 1
---

Here's a high-level overview of how Catalyst's components work together to facilitate cross-chain swaps:

1. A user deposits assets into Catalyst in the origin chain.
2. Catalyst calculates the units of liquidity from the deposit.
3. Message containing the units of liquidity is sent from origin chain to destination chain, leveraging an interoperability protocol and its relayer ecosystem like IBC.
4. Catalyst on the destination chain receives the cross-chain message and calculates how many assets to withdraw from the vault and send to the user.
5. User receives assets on their designated wallet.
6. Liquidity providers who contributed to the pool used in the transaction earn fees.
