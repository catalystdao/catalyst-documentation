---
title: "How Does Catalyst Work?"
description: "Catalyst uses the Unit Of Liquidity as a liquidity abstraction and that allows Catalyst to evaluate liquidity asynchronously."
sidebar:
  order: 2
---

Catalyst is a cross-chain AMM that only needs an interoperability messaging layer to operate. This enables easy-to-use, secure, and fast cross-chain swaps. Traditional AMMs price assets based on their internal state, which means the balances of assets within the AMM. This requires the AMM to have full knowledge of all assets they use. The Catalyst innovation allows us to ease the knowledge constraint such that we can split the state of the AMM across different chains: pools of assets can be created on different chains and connected by a cross-chain messaging layer.

Catalyst works by being lightweight and extensible enough to live on any chain—irrespective of virtual machine, consensus mechanism, etc. Catalyst uses a concept called "unit of liquidity": a value abstraction that can be easily transferred between pools asynchronously to allow for universal comprehension between any Catalyst smart contract on any chain. As a result, any chain that integrates Catalyst can automatically move value to/from any other Catalyst-enabled chain.

## What is the Unit of Liquidity?

The Unit of Liquidity (UoL) is an abstract representation of asset value that can be transferred between blockchains. It acts like a receipt that individuals can use to redeem assets on another chain. In simple terms, when a user deposits assets, they receive a corresponding amount of Units in return. This unit serves as a standardized accounting mechanism, indicating the ratio of value between the deposited asset and the asset available for redemption on the other chain. It enables cross-chain swaps by providing a common measurement for asset value across different blockchain networks.

UoL allows Catalyst to scale linearly with the number of chains connected: Catalyst only requires liquidity per additional asset added, not per chain.

### High-level explanation

Imagine Alice wants to trade her Apples for Charlie's Citrons. Both Alice and Charlie have a certain number of values attached to their produce. If Alice has 1 million Apples and only 1 Citron, then 1 Citron is inherently worth more to Alice than 1 Apple, _how else will she get all of her C-vitamins?_

We imagine that Alice has some value function that she uses to evaluate if she should trade her Apples to Citrons. We call that function the marginal price function (of Alice).

This is the idea behind constant function market-makers (CFMMs) like Uniswap. Liquidity providers have given us an explicit marginal price function and if the swap benefits liquidity providers (according to their price function), then the swap goes through.

The issue is Alice (or liquidity providers) have to know both how many Apples and Citrons they have otherwise they can't accurately price them against each other. As a result, traditional CFMMs are constrained to single chains.

One idea is to introduce an intermediary value that has a known value relative to both Apples and Citrons. Many would instinctively go for a stablecoin since they argue it holds a known value. However, it may not be a known value **relative** to Apples and Citrons, since their demand and supply can change. The Catalytic idea is that it is possible to define a relative value without any external token. That relative value is the Unit of Liquidity.

#### A bit of math.

For Uniswap v2, the marginal price equation is $P(x, y) = \frac{y}{x}$ with a resulting swap equation of $y(x) = \frac{Y \cdot x}{X +x}$ where y is output, x is input, Y is the current pool balance of output and X is current pool balance of input.

Say we want to replicate the Uniswap AMM, one idea could be to split up the equation: $U_x(x) = \frac{x}{X + x}$ and $y(x) = Y \cdot U_x(x)$. This provides us with 2 independent equations that describe the relative value between assets without any intermediary asset transfer or Oracles.

You can find a deep dive into the math in our whitepaper: [whitepaper.catalyst.exchange](https://whitepaper.catalyst.exchange).
