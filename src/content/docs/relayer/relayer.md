---
title: "Generalised Relayer"
sidebar:
  order: 1
---

Catalyst uses [Generalised Incentives](https://github.com/catalystdao/GeneralisedIncentives) to standardise the user experience across messaging bridges. Generalised Incentives allow Catalyst to support a wide variety of bridges with an improved incentive scheme.

Generalised Incentives is an open bridge incentive abstraction scheme and other applications can be used to improve their bridge support without changing the incentive scheme. It comes with a wide variety of improvements and is sure to simplify integrating bridges.

## Generalised Relayer

Cata Labs has built a reference relayer for Generalised Incentives called [generalised-relayer](https://github.com/catalystdao/generalised-relayer). The relayer standardises a communication medium between bridge implementations and allows one app to relay for a wide variety of bridges.

Combining both a generalised incentive scheme and a generalised relayer creates a wide variety of benefits:

- One implementation that makes anyone able to run a relayer improves system security. Relaying has `1/N` security assumptions. That implies if just one honest non-censoring relayer exists, then transactions can't be censored.
- Generalised Incentives is a demand based relaying incentives. As competition goes up, prices go down. As a result, users end up paying less while getting relayed faster.
- Generalised Incentives eat a lot of the bridge-specific assumptions, the result is that cross-chain dApps can be built faster and more securely. Examples of abstracts include:
  - Condition relayer payments. Relayers are only paid for packages they execute rather than prepaying for relaying.
  - Gas based relaying payments. Applications only pay for the gas they use rather than overpaying because gas is often estimated 10-20% high.
  - Acknowledgements are sent back to tell the source application what happened at the destination.
  - Deadlines can be attached (or not) to packages and won't be executed after the deadline.
- Standardising incentives and making an open reference relayer simplifies future relayer work as new bridges can use the existing incentives and relayer implementation as scaffolding for their bridge.
