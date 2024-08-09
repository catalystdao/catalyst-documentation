---
title: "Fast Swaps"
description: "Catalyst supports fast swaps. Fast swaps are price and execution settled in roughly 30 seconds to 1 minute. This is done by selling the finality risk to an Underwriter."
sidebar:
  order: 1
---

Catalyst supports fast swaps also called underwritten swaps. Fast swaps are price and execution settled before the messaging bridge has confirmed the swap. Normal full finality swaps take around 15-30 minutes (some even longer, depending on the source chain finality) where fast swaps takes between 30 seconds and 1 minute.

## How?

Fast swaps work by selling the finality risk to an Underwriter. When an Underwriter determines a swap is _final_ they execute the equivalent swap. The Underwriter truly **executes** the swap, as the incoming Units will be swapped to the designated output asset. Instead of sending the newly bought assets to the user, they are escrowed and instead the underwrite will front the bought assets + a small amount of collateral. Once the swap is finalised by the messaging bridge, the Underwrite's assets is refunded along with a small incentive.

This scheme ensures that the Underwriter does not take on any price risk and can fully focus on optimising for the finality risk. It also significantly reduces the cost, as the Underwriter does not have to manage price risks.

### Incentive

When underwriting, the Underwriter does not have to provide the associated underwriting incentive instead they provide `computedOutput · (1 - UW incentive)`. Once the swap finalises they get sent the full `computedOutput`. This encorages Underwriters to underwrite swaps as they get a portion of the swap as set by the user.

## Risk Specifications

The bought finality risk is the following:

1. The Underwriter is underwriting the **exact** message which has been sent. If a transaction is **MOVED** since a block (reorg, double spend, or likewise) then there is a very significant chance that the message is not exact anymore. While the message does not contain any ordering information it contains an unit quote. This quote will change if the order of swaps changes within a block changes.
   - If this happens the underwriter loses 100% of their fronted tokens.
   - The underwriter can recover part of their collateral if they expire their own underwrite.
2. The underwriter malfunctions and underwrites invalid swaps to invalid users.
   - If this happens the underwriter loses 100% of their fronted tokens.
   - The underwriter can recover part of their collateral if they expire their own underwrite.
3. The underwriter also pays gas to execute the logic associated with the user’s swap. To underwrite a swap is conditional on executing the logic. There is not an associated gas payment included in the underwrite incentive and it will have to also cover the gas cost.
   - If the underwriter evaluator is unable to correctly asses the profitability of underwrites, it could underwrite swaps such that it is not truly profitable.
4. The messaging bridge finalises the swap within the configured max time. If the message is not relayed within the configured max time, the underwrite may be expired.
   - If this happens the underwriter loses 100% of their fronted tokens.
   - The underwriter can recover part of their collateral if they expire their own underwrite.

### Derived Risks

Using the above list, we can list the risk factors in order of likelihood:

1. The transaction is moved after the swap has been underwritten.
   - ⇒ The result is the messaging bridge not verifying the message that was underwritten.
2. High network usage makes it impossible to relay swaps.
   - ⇒ Relayers cannot submit the AMB message and someone could expire the underwrite. The swap may arrive and not match the underwrite.
3. The relayer crashes and no other relayer is relaying the AMB message
   - ⇒ Someone could expire the underwrite.
4. The underwriter is incorrectly constructed such that it underwrites invalid messages.
   - ⇒ The underwriter could risk its entire capital.
5. The associated messaging bridge crashes and doesn’t wake before the underwrite expires.
   - ⇒ Someone could expire the underwrite.
6. The source chain crashes before a desired number of confirmations is reached. The chain does not wake before the underwrite expires.
   - ⇒ Someone could expire the underwrite.
7. There is a smart contract risk in the vaults which results in the vaults capital being drainable.
   - ⇒ The underwritten escrow is in the vault and could be drained.
8. The destination chain (where the underwriter underwrote the swap) crashes.
   - ⇒ The underwrite cannot be expired as the underwrite is set in blocks. However, long-term instability could cause it to produce empty or fast(?) blocks which would increase the block counter and risk the underwrite expiring.

- Ordinary meaning: RPC is working, blocks are being produced, and the associated AMB is working. For many (non-signing) AMBs the former implies the latter.

Some of these risk factors can easily be migrated like

(1.) can be migrated against by waiting longer before underwriting the swap. This can be configured in our underwriter but will make the underwriter less competitive or

(7.) which is very easy to audit for and no issues has EVER been found with the escrow implementation.

## Designing an Underwriter

To underwrite swaps, at least 3 jobs have to be performed to underwrite swaps:

1. Monitor newly initiated Catalyst swaps
2. Collect relevant messaging bridge packages.

With these information, it can both validate swaps by cross-examining the package with the swap event and construct the underwriter call.

3. Commit underwrites by calling [`underwrite(...)`](https://github.com/catalystdao/catalyst/blob/e975abcf82cdd5a0b1dc7ac768e15d4511967a11/evm/src/CatalystChainInterface.sol#L698) on the associated Cross-Chain Interface.

:::danger[Validate!]
`underwrite(...)` is very unlikely to revert. It will generally accept any information and _underwrite_ whatever swap is proposed. But if there is not a messaging bridge hit on the underwrite the fronted tokens will not be refunded.

It is important to thoroughly verify that swaps before underwriting to ensure the fronted underwrite capital is refunded otherwise there may be a loss of funds.
:::

### Risk Migration implementations

The [reference underwriter](/underwriter/setup/) has built-in risk migrations. Below is a list of the currently implemented risk management features:

- The underwriter processes the chains' events with a configurable _block delay_ to minimize the likelihood of acting on transactions that eventually become part of a block reorg.
- Underwrites are only performed within an acceptable 'block count margin' after the block at which the swap is observed. If the _underwrite_ transaction takes too long to be submitted to the RPC (e.g. too many transactions to be processed by the underwriter), the transaction is dropped altogether.
- Underwrites executed by itself are expired **before** the expiry deadline, to make sure that at least the associated collateral is recovered.
- Stuck 'pending' transactions are automatically repriced/cancelled to make sure a stuck transaction does not stall all other transactions of the signing account.
