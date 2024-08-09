---
title: "Liquidity Swaps"
description: "Catalyst has a brand new deposit innovation called liquidity swaps that allow for an even easier cross-chain deposit experience."
sidebar:
  order: 4
---

Liquidity swaps are a brand-new innovation pioneered by Catalyst. At a high level, liquidity swaps are a macro that allows users to deposit into a Catalyst pool without having equal parts of every required asset. The rest of the assets will be swapped on Catalyst and redistributed into their respective vaults and chains accordingly — such that the users’ deposits will be distributed optimally.

## Why?

While Catalyst has the same portfolio profile as traditional CFMM (constant function market makers), Catalyst is unique in 2 ways:

1. Liquidity exists in multiple pots asynchronously
2. Liquidity is owned by independent vault tokens.

Assume you are depositing in an ETH-OP-ARB pool across Ethereum Mainnet, Optimism, and Arbitrum. If you had an equal amount of assets across all three chains, (e.g., \$100 worth each of ETH, OP and ARB tokens), you will get 3 vault tokens that represent each of the holdings in their respective vaults.
However, from a technical perspective, there is nothing stopping someone from depositing only ETH and getting only 1 vault token. They may even be inclined if they only hold ETH.

Holding an uneven distribution of vault tokens is risky. Any individual vault token may get diluted at the benefit of every other vault token. This happens when someone deposits an unequal amount of assets.
If you only hold the diluted vault token, your portfolio will lose value. If you hold something but the diluted vault token, your portfolio will gain value. If you hold an exact even distribution of vault tokens you gain value.

To migrate this risk, it would require users to have \$100 worth of three assets across three separate chains — which is a high barrier that prevents many people from depositing.

## Solution

The solution is liquidity swaps. Users only need as few as one asset in a pool to perform a deposit. Instead of needing \$100 worth of three assets across three separate chains, the user only needs \$300 worth of one asset on one chain (e.g., \$300 worth of ETH on Ethereum). When the user deposits with liquidity swaps, three actions are effectively performed:

1. \$300 worth of ETH is deposited on Ethereum.
2. \$100 worth of ETH is withdrawn & swapped on Catalyst to get \$100 worth of OP on Optimism
3. \$100 worth of ETH is withdrawn & swapped on Catalyst to get \$100 worth of ARB on Arbitrum

The innovation behind liquidity swaps is the realisation that units represent liquidity rather than being tied to some value. As a result, there is a direct transaction between liquidity and units. This eliminates to need to calculate how many assets to withdraw, in what ratio, which assets to swap to and in what ratio. Instead, liquidity is converted directly into Units, sent to the destination chain and converted directly into liquidity.

## Technical Risk

The following section is highly mathematical and will explain the exact risk. If the section is too complicated, you only have to understand:

- If you deposit equal amounts of tokens, you get an even distribution, which is not subject to costs associated with dilution.
- If you deposit using liquidity swaps you suffer a small initial cost because you need to purchase other tokens but then you are not subject to costs associated with dilution.

The below section is WIP.

Assume a volatile pool of 2 vaults, each with 1 asset. Call the assets A and B. Assume that the price is constant. We have to assume an initial state:

100 A with 100 PT_a.

100 B with 100 PT_b.

Let's setup a person that holds an even value of the pool, that is: u PT_A and u PT_B. Since we locked the value to 1:1, their value is $u \cdot \frac{100}{100} + u \cdot \frac{100}{100} = 2u$ in either A or B.

Examine a deposit of 20 A, they will mint 20 pool tokens.

120 A with 120 PT_a.

100 B with 100 PT_b.

This changes the price and the pool has to get rebalanced. The easiest way to rebalance is to use the constraint and derive the equal point: $120 \cdot 100 = 12000, \sqrt(12000) = 109.54$.

The state after is

109.54 A with 120 PT_a.

109.54 B with 100 PT_b.

Let's examine the person that holds an even value of the pool again. Remember the price is locked to 1:1. Their value is $u \cdot \frac{109.54}{120} + u \cdot \frac{109.54}{100} = u \cdot (0.9128 + 1.0954) = 2.0082u$ in either A or B.

Suddenly, there is an important observation. The user we examined does not hold an even distribution. They own more B than A. The conditions for a loss now apply to them, if someone now dilutes B they will lose the value they gained ($u \cdot 0.0082$). This is repeatable but also provides a helpful reference to what the maximum loss to an uneven depositor is: They can lose value by dilution until they have an even distribution. Once they have an even distribution they are at the minimum point on the dilution curve and any uneven deposits by other users will be their gain.

You can imagine this as a U graph where the relative value is on the Y axis. An even distribution is the middle and lowest point of the U and other users deposit unevenly they move your position either left or right. This provides you relative gains.

:::caution[Do not use liquidity swaps for speculation]
You may imagine that you read the above and think: Why not use liquidity swaps to lock in some of the uneven distribution gains?

This is dangerous! First, Liquidity swaps are not free. Second, liquidity swaps rebalance what your liquidity distribution fundamentally looks like. One of the assumptions in the above section is that the price is constant. In the real world, this is unlikely to be the case. As a result, liquidity swaps should be used as sparsely as possible.
:::
