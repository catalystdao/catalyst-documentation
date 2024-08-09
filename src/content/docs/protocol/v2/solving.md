---
title: "Cross Cats: Solving Liquidity x Bitcoin"
description: "Catalyst v2 will support Bitcoin swaps. This is facilitates through intent based swaps that are verified through an on-chain Bitcoin SPV client. This provides: Fast settlement, Competitive rates, and near full security."
sidebar:
  order: 7
---

Cross-cats is an intent based cross-chain swap protocol. Users sign intents: What asset they want, how they want etc, etc. which is then claimed and delivered by solvers.

The default operation is optimistic resolution, upon claimed fraud, the system fallbacks to a strict proof of transfer. The main sources of proof of fraud are oracles, and oracles are split into 2 camps:

- Light client / Payment validation: An onchain service is maintained that can independently verify if a statement of delivery has been made. This provides very strong inclusion proofs though it is more expensive.

- Messaged Oracles: Messaging protocols reports the remote state and deliver it to the source chain. Messaged Oracles may be a front for a remote LC/PV service.

## Smart chains

Smart chains with native assets are by default verified through a messaging oracle. Smart chains allows for easy examination if a transfer happened or not. These kind of transfers are cheap to verify.

### Flow

For a smart chain to smart chain asset swap, the user starts by making a signed message of their intented transaction & type. The signed message is broadcast to a distribution network where solvers can listen for it.

A Solver sees the signed message and determines it wants to fill it. It claimed the message on the source chain and submits collateral.

The solver then delivers the assets on the destination chain. If the asset delivery is not challanged, then the solver can after some time claim the input assets.

If the delivery is challanged, the solver has prove that the delivery happened. This is done by sending a cross-chain message from the destination chain to the source. This message can then be proved.

## Bitcoin

Bitcoin settlements are verified through a Bitcoin SPV (Simplified Payment Validation) client. This is an on-chain Bitcoin light client that allows one make statements about a transaction that **has** been mined. It cannot be used to make statments about transaction that may or may not have been mined.

### Flow

The initiation flow is the same for Bitcoin as Smart Chains, except the deliver is intended on Bitcoin.

If the delivery is challanged, the solver has prove that the delivery happened. If the chain has a local SPV client, the client is used to verify that the delivery happened. Otherwise, a remote SPV client is pulled for the proof and it is delivered through a messaging oracle.

```d2 animateInterval=10000
style.fill: transparent
direction: right

title: System Overview {
  near: top-center
  shape: text
  style: {
    font-size: 40
  }
}


Source Chain: {
  Solver
  User: {
    shape: person
  }
  Reactor
  Oracle

  User -> Solver: Signed Message
  Solver -> Reactor: Claim Order
  Reactor <-> User: Collect Tokens

  Challenger
  Challenger.style.opacity: 0

  Challenger -> Reactor: Fraud

  Reactor -> Challenger: Reward
  Reactor -> User: Refund

  Oracle -> Reactor: Commit Proof

  Solver -> Reactor: Claim Tokens
  Reactor -> Solver: Pay Tokens

  (Solver -> Reactor)[0].style.opacity: 0
  (Challenger -> Reactor)[0].style.opacity: 0
  (Reactor -> Solver)[0].style.opacity: 0
  (Oracle -> Reactor)[0].style.opacity: 0
  (Reactor -> Challenger)[0].style.opacity: 0
  (Reactor -> User)[0].style.opacity: 0
}

Destination Chain: {
  Solver
  User: {
    shape: person
  }
  Reactor
  Oracle

  Solver -> Reactor: Fill Order
  Reactor -> User: Deliver Order
  Reactor -> Oracle: Submit proof
  (Reactor -> Oracle)[0].style.opacity: 0
}

Proof: {
  shape: cloud
}

Destination Chain.Oracle -> Proof -> Source Chain.Oracle

(Destination Chain.Oracle -> Proof)[0].style.opacity: 0
(Proof -> Source Chain.Oracle)[0].style.opacity: 0

scenarios: {
  resolution: {
    title.label: Optimistic Resolution
    Source Chain: {
    (Solver -> Reactor)[0].style.opacity: 1
      (Reactor -> Solver)[0].style.opacity: 1
    }
  }
  proof: {
    title.label: Challanged but proven
    Source Chain: {
      (Challenger -> Reactor)[0].style.opacity: 1
      (Reactor -> Solver)[0].style.opacity: 1
      (Oracle -> Reactor)[0].style.opacity: 1
      Challenger.style.opacity: 1
    }
    Destination Chain: {
      (Reactor -> Oracle)[0].style.opacity: 1
    }
    (Destination Chain.Oracle -> Proof)[0].style.opacity: 1
    (Proof -> Source Chain.Oracle)[0].style.opacity: 1
  }
  fraud: {
    title.label: Fraud Proven
    Source Chain: {
      (Challenger -> Reactor)[0].style.opacity: 1
      (Reactor -> Solver)[0].style.opacity: 0
      (Oracle -> Reactor)[0].style.opacity: 0
      Challenger.style.opacity: 1
      (Reactor -> Challenger)[0].style.opacity: 1
      (Reactor -> User)[0].style.opacity: 1
    }
    Destination Chain: {
      (Reactor -> Oracle)[0].style.opacity: 0
    }
    (Destination Chain.Oracle -> Proof)[0].style.opacity: 0
    (Proof -> Source Chain.Oracle)[0].style.opacity: 0
  }
}
```
