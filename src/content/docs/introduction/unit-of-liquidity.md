---
title: "Unit of Liquidity"
sidebar:
  order: 3
---

The unit of liquidity (UoL) is an abstract representation of asset value that can be transferred between blockchains. It acts like a receipt that individuals can use to redeem assets on another chain. When someone deposits an asset, they receive a UOL in return. This unit serves as a standardized accounting mechanism, indicating the ratio of value between the deposited asset and the asset available for redemption on the other chain. It enables cross-chain swaps by providing a common measurement for asset value across different blockchain networks.

UoL allows Catalyst to scale linearly with the number of chains connected: Catalyst only requires liquidity per additional asset added, not per chain.

For a deep dive on the math behind the UOL can check out the full whitepaper at [whitepaper.catalyst.exchange](https://whitepaper.catalyst.exchange)

![Transaction flow](UoL2.png)
