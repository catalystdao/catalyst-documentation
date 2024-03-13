---
title: "Catalyst Differentiators"
sidebar:
  order: 3
---

The creation of the unit of liquidity enables 4 significant improvements from current solutions:

1. Most importantly, Catalyst allows for permissionless token pool creation. **To date, there is no DEX that allows for cross-chain pools to be permissionlessly created.** This allows Catalyst to support the long tail of assets that cannot be found on any other exchange.
2. **User experience.** 1-click transaction on any supported chain, where native assets are swapped. No more excessive bridging and 3+ transactions to approve a swap, and no more reliance on wrapped assets (e.g., hETH, sETH, USDCet).
3. **Scalable liquidity.** Single-sided pools per asset per chain. No fragmented liquidity from Central Executor chains or splitting liquidity to supply an intermediary bridge token.
4. **Security by design**. One bridge message is sent, so the sole attack vector is on that message—as opposed to the 4-6 attack surfaces of current solutions. This will be mitigated by only working with trust-minimized, battle-tested interoperability protocols like IBC.

Beyond the unit of liquidity, Catalyst is also innovating in other dimensions:

- **MEV redistribution**: Catalyst LPs will receive protocol-captured MEV as a sustainable return in addition to pool fees. We want to reward LPs for exposing capital to market-making risks such as impermanent loss. Our design has fundamental economic advantages because it internalizes MEV and redistributes it to LPs, making it a better foundation for providing liquidity compared to other DEXs.
- **AA relayer integration**: Catalyst UI will integrate best-in-class relayers for gas sponsorships, rules-based transaction logic, multi-call transactions, etc.
