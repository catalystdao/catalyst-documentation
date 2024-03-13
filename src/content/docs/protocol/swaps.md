---
title: "Swaps"
sidebar:
  order: 4
---

Catalyst supports the following swap types:

- **Local swap**: swaps between tokens on the same chain e.g. ETH to USDC on Ethereum
- **Cross-chain swap**: swap between tokens on two different chains e.g. MATIC (on polygon) to BNB (on BSC)
- **Logic dependent swap**: allows developers to specify logic which has to execute on the target chain for the transaction otherwise the transaction reverts back to the sending chain. Examples:
  - buy an NFT: swap ETH (on Ethereum) to STARS (on Stargaze) to buy a Bad kid only if price of the NFT is ≤ 1000 STARS
  - perform action (e.g., governance vote)
- **Liquidity boostrapping pools (LBPs):** Liquidity Bootstrapping Pools (LBPs) are pools that allow for dynamic changes in token weighting over time. The pool owner determines the starting and end weights and times, and has the ability to pause swaps. LBPs use a weighted math model that gradually adjusts the token price until it reaches market equilibrium.
