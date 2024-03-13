---
title: "Liquidity Pools"
sidebar:
  order: 3
---

Catalyst is extensible and can replicate any type of AMM pool such as Curve stableswap, UNI v2 and Balancer multi-asset pool.

Catalyst keeps liquidity on-chain in Vaults without partitions. This allows anyone to use the complete liquidity in a Catalyst vault for any pair locally (ETH to USDC) or cross-chain (Matic to BNB).

Each Vault contains 1 or more assets and can be connected to none, one or more other vaults to allow swaps between their assets. When vaults are connected, they form a pool. Within a pool, any asset can be exchanged for any other asset. Below is an example of a 6 asset pool consisting of 3 vaults.

```d2
direction: right

VaultETH: {
  ether: Ether
  wbtc: wBTC
  units: Units
  dai: DAI

  dai <-> units
  ether <-> units
  wbtc <-> units
}

VaultPolygon: {
  matic: Matic
  units: Units

  matic <-> units
}
VaultBSC: {
  bnb: BNB
  units: Units
  usdc: USDC

  units <-> usdc
  units <-> bnb
}

VaultBSC.units <-> VaultETH.units <-> VaultPolygon.units <-> VaultBSC.units
```

Any asset within the pool can be exchanged into any other asset in the pool. This is facilitated by swapping into Units as an intermediary. Units are pricing using an internal price curve which defined a constant operation space.
For local swaps within the same vaults, swap can be converted into and out of units in a single transaction allowing for full local utilisation of all liquidity contains the in vault. Using a cross-chain messaging layer, Units can be transfered to other connected vaults, where they can be converted into the desired output token.
