---
title: "Liquidity Pools"
description: "Catalyst liquidity pools can replicate any type of AMM pool such as Curve stableswap, UNI v2, and Balancer all while being natively cross-chain."
sidebar:
  order: 3
---

Catalyst is extensible and can replicate any type of AMM pool such as Curve stableswap, UNI v2, and Balancer multi-asset pool.

Catalyst keeps liquidity on-chain in Vaults without partitions. This allows anyone to use the complete liquidity in a Catalyst vault for any pair locally (ETH to USDC) or cross-chain (MATIC to BNB).

Each Vault contains 1 or more assets and can be connected to none, one or more other vaults to allow swaps between their assets. When vaults are connected, they form a pool. Within a pool, any asset can be exchanged for any other asset. Below is an example of a 6 asset pool consisting of 3 vaults.

```d2 animateInterval=2500
style.fill: transparent
direction: right

title: All Available Routes {
  near: top-center
  shape: text
  style: {
    font-size: 40
  }
}

Vault ETH: {
  ether: Ether
  wbtc: wBTC
  units: Units
  dai: DAI

  dai -> units
  dai <- units
  ether -> units
  ether <- units
  wbtc -> units
  wbtc <- units
}

Vault Polygon: {
  matic: Matic
  units: Units

  matic -> units
  matic <- units
}

Vault BSC: {
  bnb: BNB
  units: Units
  usdc: USDC

  units -> bnb
  units <- bnb
  units -> usdc
  units <- usdc
}

Vault ETH.units -- Vault Polygon.units -- Vault BSC.units
Vault ETH.units -- Vault BSC.units

scenarios: {
  localswap: {
    title.label: Ether to wBTC
    Vault ETH: {
      (dai -> units)[0]: {
        style.opacity: 0.2
      }
      (dai <- units)[0]: {
        style.opacity: 0.2
      }
      (wbtc -> units)[0]: {
        style.opacity: 0.2
      }
      (wbtc <- units)[0]: {
        style.animated: true
      }
      (ether -> units)[0]: {
        style.animated: true
      }
      (ether <- units)[0]: {
        style.opacity: 0.2
      }
    }
    Vault Polygon: {
      (matic -> units)[0]: {
        style.opacity: 0.2
      }
      (matic <- units)[0]: {
        style.opacity: 0.2
      }
    }

    Vault BSC: {
      (units -> bnb)[0]: {
        style.opacity: 0.2
      }
      (units <- bnb)[0]: {
        style.opacity: 0.2
      }
      (units -> usdc)[0]: {
        style.opacity: 0.2
      }
      (units <- usdc)[0]: {
        style.opacity: 0.2
      }
    }

    (Vault ETH.units -- Vault Polygon.units)[0]: {
      style.opacity: 0.2
    }
    (Vault Polygon.units -- Vault BSC.units)[0]: {
      style.opacity: 0.2
    }
    (Vault ETH.units -- Vault BSC.units)[0]: {
      style.opacity: 0.2
    }
  }
  crossswap: {
    title.label: DAI to USDC
    Vault ETH: {
      (dai -> units)[0]: {
        style.animated: true
      }
      (dai <- units)[0]: {
        style.opacity: 0.2
      }
      (wbtc -> units)[0]: {
        style.opacity: 0.2
      }
      (wbtc <- units)[0]: {
        style.opacity: 0.2
      }
      (ether -> units)[0]: {
        style.opacity: 0.2
      }
      (ether <- units)[0]: {
        style.opacity: 0.2
      }
    }
    Vault Polygon: {
      (matic -> units)[0]: {
        style.opacity: 0.2
      }
      (matic <- units)[0]: {
        style.opacity: 0.2
      }
    }

    Vault BSC: {
      (units -> bnb)[0]: {
        style.opacity: 0.2
      }
      (units <- bnb)[0]: {
        style.opacity: 0.2
      }
      (units -> usdc)[0]: {
        style.animated: true
      }
      (units <- usdc)[0]: {
        style.opacity: 0.2
      }
    }

    (Vault ETH.units -- Vault Polygon.units)[0]: {
      style.opacity: 0.2
    }
    (Vault Polygon.units -- Vault BSC.units)[0]: {
      style.opacity: 0.2
    }
  }
}
```

Any asset within the pool can be exchanged into any other asset in the pool. This is facilitated by swapping into Units as an intermediary. Units are pricing using an internal price curve which defined a constant operation space.
For local swaps within the same vaults, swap can be converted into and out of units in a single transaction allowing for full local utilisation of all liquidity contains the in vault. Using a cross-chain messaging layer, Units can be transferred to other connected vaults, where they can be converted into the desired output token.
