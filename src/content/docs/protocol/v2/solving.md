---
title: "Cross Cats: Solving Liquidity x Bitcoin"
description: "Catalyst v2 will support Bitcoin swaps. This is facilitates through intent based swaps that are verified through an on-chain Bitcoin SPV client. This provides: Fast settlement, Competitive rates, and near full security."
sidebar:
  order: 7
---

Cross-cats is an intent-based cross-chain swap protocol built with flexibility in mind. The core idea is that you should be able to ask for anything that can be proven. At launch, the differentiator will be Bitcoin intents. Using a Bitcoin SPV (light client) Bitcoin transactions can be proven which can be linked to payouts on VM chains.


```d2 animateInterval=10000
style.fill: transparent
direction: right

vars: {
  default-opacity: 0.1
}

title: System Overview {
  near: top-center
  shape: text
  style: {
    font-size: 40
  }
}

Order Server: {shape: cloud}

Source Chain: {
  User: {
    shape: person
  }
  Solver: {style.fill-pattern: none}
  Reactor: {shape: page}
  Oracle: {
    style.opacity: ${default-opacity}
    shape: page
  }
  Challenger: {style.opacity: ${default-opacity}}
  SPV: {
    style.opacity: ${default-opacity}
    shape: page
  }

  Solver -> Reactor: 3. resolve() => Quote
  Solver -> Reactor: 4.1. initiate()
  User -> Reactor: 4.2. Tokens

  # Optimistic Payout
  Solver <-> Reactor: O.6.1. claimOrder() {style.opacity: ${default-opacity}}

  # Challenge Parts
  Challenger -> Reactor: C.6.1. fraud() {style.opacity: ${default-opacity}}

  # - Challenged Rejected (VM)
  Oracle -> Reactor: C.9.2. prove() {style.opacity: ${default-opacity}}
  Reactor -> Solver: C.9.3. payout tokens {style.opacity: ${default-opacity}}

  # - Challenged Rejected (Bitcoin)
  Solver -> SPV: C.7.1. validateTransaction() {style.opacity: ${default-opacity}}
  SPV -> Reactor: C.7.2. prove() {style.opacity: ${default-opacity}}
  Reactor -> Solver: C.7.3. payout tokens {style.opacity: ${default-opacity}}

  # - Challenged Accepted
  Challenger -> Reactor: C.7.1. commitFraud() {style.opacity: ${default-opacity}}
  Reactor -> Challenger: C.7.2. Reward {style.opacity: ${default-opacity}}
  Reactor -> User: C.7.3. Tokens {style.opacity: ${default-opacity}}
}

Source Chain.User -> Order Server: 1. Sign Message {style.animated: false}
Order Server -> Source Chain.Solver: 2. Signed Orders

Destination Chain: {
  Oracle: {
    style.opacity: ${default-opacity}
    shape: page
  }
  Solver
  SPV: {
    style.opacity: ${default-opacity}
    shape: page
  }
  User: {
    shape: person
  }

  # Ordinary
  Solver -> Oracle: 5.1. fill()
  Solver -> User: 5.2. Tokens

  # Challenged submit proof (VM)
  Solver -> Oracle: C.7.1. submitProof() {style.opacity: ${default-opacity}}

  # Challenged submit proof (Bitcoin)
  Solver -> SPV: C.7.1: validateTransaction() {style.opacity: ${default-opacity}}
  SPV -> Oracle: C.7.2. Send fill details {style.opacity: ${default-opacity}}
}

Bitcoin: {
  Solver: {style.opacity: ${default-opacity}}
  User: {
    shape: person
    style.opacity: ${default-opacity}
  }

  Solver -> User: 5.1 transfer {style.opacity: ${default-opacity}}
  style.opacity: ${default-opacity}
}

Bitcoin -> Destination Chain.SPV: Bitcoin Headers {
  style.opacity: ${default-opacity}
  style.stroke-dash: 4
}
Bitcoin -> Source Chain.SPV: Bitcoin Headers {
  style.opacity: ${default-opacity}
  style.stroke-dash: 4
}

Proof: {
  shape: cloud
  style.opacity: ${default-opacity}
}

Destination Chain.Oracle -> Proof: C.8.1. Collect event {style.opacity: ${default-opacity}}
Proof -> Source Chain.Oracle: C.9.1. submitProof() {style.opacity: ${default-opacity}}

scenarios: {
  optimistic resolution: {
    title.label: Optimistic Resolution
    Source Chain: {
      (Solver <-> Reactor)[0].style.opacity: 1
      (Solver <-> Reactor)[0].style.bold: true
      (Solver <-> Reactor)[0].style.stroke-width: 3
    }
  }
  challenged: {
    title.label: Challenged
    Source Chain.Challenger.style.opacity: 1
    Source Chain.(Challenger -> Reactor)[0].style.opacity: 1
    Source Chain.(Challenger -> Reactor)[0].style.bold: true

    Source Chain.(Challenger -> Reactor)[0].style.stroke-width: 3
    
    scenarios: {
      challenged uncontested: {
        title.label: Challenged Uncontested
        Source Chain.(Challenger -> Reactor)[0].style.stroke-width: 2
        Source Chain.(Challenger -> Reactor)[0].style.bold: false
        Source Chain.(Challenger -> Reactor)[1].style.opacity: 1
        Source Chain.(Challenger -> Reactor)[1].style.stroke-width: 3
        Source Chain.(Challenger -> Reactor)[1].style.bold: true
        Source Chain.(Reactor -> Challenger)[0].style.opacity: 1
        Source Chain.(Reactor -> User)[0].style.opacity: 1
        Destination Chain.style.opacity: ${default-opacity}
        Destination Chain.*.style.opacity: ${default-opacity}
        Destination Chain.(* -> *)[*].style.opacity: ${default-opacity}
      }
      order fill proven (VM): {
        title.label: Order Fill Proven (VM)
        Source Chain.(Challenger -> Reactor)[0].style.stroke-width: 2
        Source Chain.(Challenger -> Reactor)[0].style.bold: false

        Destination Chain.(Solver -> Oracle)[1].style.opacity: 1
        Destination Chain.(Solver -> Oracle)[1].style.bold: true
        Destination Chain.(Solver -> Oracle)[1].style.stroke-width: 3
        Destination Chain.Oracle.style.opacity: 1
        Proof.style.opacity: 1
        (Destination Chain.Oracle -> Proof)[0].style.opacity: 1
        (Proof -> Source Chain.oracle)[0].style.opacity: 1
        Source Chain.Oracle.style.opacity: 1
        Source Chain.(Oracle -> Reactor)[0].style.opacity: 1
        Source Chain.(Reactor -> Solver)[0].style.opacity: 1
      }
      order fill proven, (BTC): {
        Source Chain.(Challenger -> Reactor)[0].style.stroke-width: 2
        Source Chain.(Challenger -> Reactor)[0].style.bold: false
        Destination Chain.style.opacity: ${default-opacity}
        Destination Chain.*.style.opacity: ${default-opacity}
        Destination Chain.(* -> *)[*].style.opacity: ${default-opacity}
        Bitcoin.style.opacity: 1
        Bitcoin.*.style.opacity: 1
        Bitcoin.(* -> *)[*].style.opacity: 1
        
        scenarios: {
          local SPV client: {
            title.label: Local SPV Client
            (Bitcoin -> Source Chain.SPV)[0].style.opacity: 1
            Source Chain.SPV.style.opacity: 1

            Source Chain.(Solver -> SPV)[0].style.opacity: 1
            Source Chain.(Solver -> SPV)[0].style.stroke-width: 3
            Source Chain.(Solver -> SPV)[0].style.bold: true
            Source Chain.(SPV -> Reactor)[0].style.opacity: 1
            Source Chain.(Reactor -> Solver)[1].style.opacity: 1
          }
          remote SPV client: {
            title.label: Remote SPV Client
            (Bitcoin -> Destination Chain.SPV)[0].style.opacity: 1
            Destination Chain.SPV.style.opacity: 1

            Destination Chain.style.opacity: 1
            Destination Chain.Solver.style.opacity: 1
            Destination Chain.(Solver -> SPV)[0].style.opacity: 1
            Destination Chain.SPV.style.opacity: 1

            Destination Chain.Oracle.style.opacity: 1
            Destination Chain.(SPV -> Oracle)[0].style.opacity: 1
            (Destination Chain.Oracle -> Proof)[0].style.opacity: 1

            Proof.style.opacity: 1
            Source Chain.Oracle.style.opacity: 1
            (Proof -> Source Chain.Oracle)[0].style.opacity: 1
            Source Chain.(Oracle -> Reactor)[0].style.opacity: 1
            Source Chain.(Reactor -> Solver)[0].style.opacity: 1
          }
        }
      }
    }
  }
}
```
The above diagram animates between all system states. Reloading the page or opening the SVG in a separate tab may be required for the animation to show.

## System Overview

Cross-Cats is designed for cross-chain actions. Never the less, the majorty of the logic exists on the source chain. **Source Chain** here refers to the chain where the order was **Claimed** by a solver. **remote Chain** refers to the chain (or chains) where proofs are sent from.

### Initiation (order claim)

An order is initiated by the user signing an order description. An example of an order description is _My 1 Ether (Ethereum) for 3000 USD (Base)_. The signed order is a permit2 witness which allows the solver to submit the order to the Reactor and collect the **input** (1 Ether) from the user. Importantly, during this step some collateral is collected from the solver. This ensures the solver has some skin in the game and goes through with the order. The collateral is paid back when the input is released to the solver.

To improve the user and solver experience, an order server sits between the user and solver and aids with order validation, propergation, and quoting.

### Output Payment (to user)

The payment pathway depends on the order intent. For a **VM to VM** swap, the solver calls the oracle contract on the destination chain which sends & records the token payment to the user. For **VM to Bitcoin** swap, the solver makes the payment described in the order. In other words, make a Bitcoin transaction that has **a** TXO that matches the order.

### Input Payment (to solver)

Cross Cats has 3 payment release schemes to optimise the solver experience.

1. The default operation is optimistic resolution. This assumes that the resolver delivered the payment to the user. After a dispute window (configured by the user / UI), the payment will be released. If the order is disputed the operation fallbacks option 2.
2. Explicit validation. At anytime, orders can be proven. This requires that someone send the proof from the remote chains to the source chain. This is costly but is in many cases faster than optimistic resolution. Additionally, through batch verification the cost can be reduced at a slight increase in verification speed.
3. Underwriting. The last release scheme isn't a payment proof scheme as much as it is a responsibility delegration scheme. If configured, an order can be boguht by someone else at any point priorer to the release of the input (proof / fraud). This allows the initial solver to immediately get their capital back and off-hand the payment validation to a third party.


By using these 3 in conjunction with each other solvers only have to lock liquidity for a small amount of time while the security of the system can be highly secure. At the same time, speed, security, and cost can be rebalanced based on the specific needs of a user or chain conditions.

## Bitcoin & Pseudo Solving

VM to Bitcoin swaps are relatively straight forward:
1. User signs a message stating the input assets.
2. Solver claims the order, inputs assets are automatically collected.
3. Solver delivers assets
4. Solver is paid.

However this flow breaks on step 2 when the user wants to go from Bitcoin to VM. (sell Bitcoin). There is no way to pull assets from a user. To solve this issue, the user becomes a **pseudo solver** & relying on release scheme 3. Pseudo solving works by asking solvers for short-lived Bitcoin short quotes. These orders are after validation & selection signed by the solver. The user then quickly claims the order.

Say the user wants to swap 1 Bitcoin for 50000 USDC. Using the order server, they need to collect & claim a signed order of the opposite: 50000 USDC for 1 Bitcoin. Once this order is filled, they get the input (50000 USDC) which matches their desire.

Important to notice, this adds a delay between when the price risk begins for the solver (issuance of signed order) to when it resolves (0-1 block confirmations of Bitcoin TXO). These values are best migrated by the following configuration:
1. Short initiation time. Using a source chain with a low block time, the initiation time can be kept to an absolute minimum.
2. Short proof time. The user may only have 1 or 2 Blocks to get their transaction confirmed.
3. High pseudo solver collateral. By requiring a lot of collateral, the cost of hedging / non-execution can be covered.

In a future version, VM to Bitcoin swaps will upgrade to an price oracle book scheme that further minimizes time between start of price risk to end of price risk.

# Key Integration Metrics

Cross Cats has been designed to optimise integration metrics like cost of capital, speed, human, developer, cost, price risk, capital risk, and more. Below are the most notiable metrics. If any metrics that are important to you are missing reach out and the documentation will be updated.

## Locked Capital & Underwriting

There is no need to pre-lock capital into Cross Cats. Capital is only locked during the actual order flow. In the beginning orders will batch verified which will take between 2 and 4 hours (TBD). During this period there is **PRICE CERTANCY** but assets are temporarily locked.

The user will not experience any these delays.

Additionally, underwriting may be available for some routes in which case assets will be available 1-5 minutes after asset delivery.

### Price (un)Certainty

For VM to VM swaps and VM to Bitcoin swaps, the price uncertainty window is the time it takes from your system commits to the order (or when the claim transaction is initiated) to when the order claim arrives on-chain and is successfully mined. On fast chains this is at most 2-3 seconds.

For Bitcoin to VM swaps the price uncertainty window is from when the order is signed to when the user initiates the Bitcoin transaction and it gets your desired number of confirmations. This may be a long-ish period of more than 10 minutes.

## Timings

In the beginning Catalyst will rely on more conservative optimistic timings. As a result, most transactions will be explicitly verified rather than optimistically verified. This requires funds to be locked for upto 4-6 hours.

Otherwise, all numbers are configurable but here are some conservative estimates of important values:
- Time from order sign to claim (speed of solver): 1-5 minutes (limit orders), 5-15 minutes (dutch auction)
- Time from claim to delivery (delivery speed): 1-3 minutes (VM-VM), 30-60 minutes (Bitcoin-VM).
- Time from claim to challenge (fraud observation time): 2-24 hours.
- Time from challenge to proof: 2-24 hours.

Thus the following experience applies:
- Optimistic resolution after 2-24 hours.
- Fraud Accepted after 4-48 hours.
- VM deliveries can be proven in ~30 minutes
- Bitcoin delivers can be proven in ~40-50 minutes depending on block timings.

The upper end estimations are the initial order configuration estimates and over time as we get more confidence in these values they will be reduced towards the lower end.