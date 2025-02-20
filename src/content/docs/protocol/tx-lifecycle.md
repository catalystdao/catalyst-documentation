---
title: "Transaction Lifecycle"
description: "A cross-chain Catalyst transaction lifecycle is spread across multiple chains. Lets examine a user swapping a token from Chain A to Chain B."
sidebar:
  order: 1
---

A cross-chain Catalyst transaction lifecycle is spread across multiple chains. Lets examine a user swapping a token from Chain A to Chain B.

```d2
style.fill: transparent

direction: right

amb: AMB
amb.shape: cloud

Chain A: {
  user: Sender
  user.shape: person

  vault: Vault A
  cci: CCI A
  garp: GARP A

  user -> vault: Assets to units
  vault -> cci: Pack Swap
  cci -> garp: Incentives
}

Chain B: {
 user: Recipient
 user.shape: person
 vault: Vault B
 cci: CCI B
 garp: GARP B

  user <- vault: Deliver Assets
  vault <- cci: Swap Context
  cci <- garp
}

Chain A.garp -> amb: Collect Proof
Chain B.garp <- amb: Deliver Proof
```

1. **Assets to Units**. The user deposits their assets into Vault A along with the swap context. The vault converts their tokens into Units by examining the user's deposits and comparing them to the current liquidity within.
2. **Pack Swap**. The vault sends the swap context to the cross-chain interface (CCI). The CCI packs the swap context into bytes. These bytes will be compatible with any virtual machine (VM) the user may want to receive their assets on.
3. **Incentives**. Generalised Incentives (GARP) is used to both standardize AMB integration and incentivise relayers to relay Catalyst swaps. The incentive is held in escrow here until a relayer proves they correctly did their job.
4. **Collect Message** & **Deliver Proof**. Relayers collect the message emitted by the AMB so that when the AMB generates the message proof, it can be submitted to the destination.
5. **Swap Context**. After the message has been delivered, the CCI will unpack the incoming bytes to form the swap context. This tells the vault how many Units were created, which asset to buy, where to send the asset, and more.
6. **Deliver Assets**. With the swap context, the vault can convert the units into assets and withdraw them to the designated wallet.

During step 1, Liquidity providers are paid. It may seem unfair that only Vault A collects fees but that is not true. Any swap in the other direction will distribute these fees to Vault B. This can be shown to be mathematically fair.
