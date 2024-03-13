---
title: "Why?"
sidebar_position: 2
---

Generalised Incentives documentation is mainly on [Github](https://github.com/catalystdao/GeneralisedIncentives) in the form of a readme. The below is an extract.

Currently, many AMBs (arbitrary message bridges) have poor and non-standardized relayer incentives. They either miss one or many of the following features:

- Unspent gas is refunded.
  Often the gas associated with transaction calls is semi-unknown until immediately before execution. As a result the gas paid by the user often has to be overestimated by 10%, 20%, or even more.

- Payment is conditional on execution.
  Some relaying schemes require the user or protocol to trust one or a few, sometimes centralized, entities with their gas payment. In cases where these relayers fail to do their job, a new payment has to be initiated.

- Prepay for an ack message
  Some applications rely on, or use, acks for application logic, or simply to improve the user experience. If it is not possible to pay for an ack on the source chain in the source currency, the user is overly burdened with figuring out how to acquire additional gas or the application has to do gas management on all the chains they are deployed on.

and this does not mention non-standardized payments, different interfaces, payments in protocol tokens, and address formats.

### Solution

By placing a contract as an intermediary between the applications and the AMBs, it can define how relayers are paid based on the observed (and verified) messages delivered. Since the contract sits on-chain, its logic is governed by the base chain rather than off-chain logic.
This also allows the contract to surround the AMB with additional logic:

- Measuring the gas used by the application
- Reliably sending a message back to the source chain
- Paying the relayer in a standardized token
