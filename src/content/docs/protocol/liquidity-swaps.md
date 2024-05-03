---
title: "Liquidity Swaps"
description: "Catalyst has a brand new deposit innovation called liquidity swaps that allow for an even easier cross-chain deposit experience."
sidebar:
  order: 5
---

Liquidity swaps are a brand-new innovation pioneered by Catalyst. At a high level, liquidity swaps are a macro that allows users to deposit into a Catalyst pool without having equal parts of every required asset. The rest of the assets will be swapped on Catalyst and redistributed into their respective vaults and chains accordingly — such that the users’ deposits will be distributed optimally.

## Why?

While Catalyst has the same portfolio profile as traditional CFMM (constant function market makers), Catalyst is unique in 2 ways:

1. Liquidity exists in multiple pots asyncronously
2. Liquidity is owned by independent vault tokens.

Assume you are depositing in an ETH-OP-ARB pool across Ethereum, Optimism Mainnet, and Arbitrum. If you had an equal amount of assets across all three chains, (e.g., \$100 worth each of ETH, OP and ARB tokens), you will get 3 vault tokens that represent each of the holdings in their respective vaults.
However, from a technical perspective there is nothing stopping someone from depositing only ETH and getting only 1 vault token. They may even be inclined if they only hold ETH.

Holding an uneven distribution of vault tokens is risky. Any individual vault token may get dilluted at the benefit of every other vault token. This happens when someone deposits an unequal amount of assets.
If you only hold the dilluted vault token, your portfolio will lose vault. If you hold something but the dilluted vault token, your portfolio will gain value. If you hold an exact even distribution of vault tokens you gain value.

To migrate this risk, it would require users to have \$100 worth of three assets across three separate chains — which is a high barrier that prevents many people from depositing.

## Solution

The solution is liquidity swaps. Users only need as few as one asset in a pool in order to perform a deposit. Instead of needing \$100 worth of three assets across three separate chains, the user only needs \$300 worth of one asset on one chain (e.g., \$300 worth of ETH on Ethereum). When the user deposits with liquidity swaps, three actions are effectively performed:

1. \$300 worth of ETH is deposited on Ethereum.
2. \$100 worth of ETH is withdrawn & swapped on Catalyst to get \$100 worth of OP on Optimism
3. \$100 worth of ETH is withdrawn & swapped on Catalyst to get \$100 worth of ARB on Arbitrum

The innovation behind liquidity swaps is the realisation that units represent liquidity rather than being tied to some value. As a result, there is a direct transation between liquidity and units. This eliminates to need to calculate how many assets to withdraw, in what ratio, which assets to swap to and in what ratio. Instead, liquidity is converted directly into Units, sent to the destination chain and converted directly into liquidity.
