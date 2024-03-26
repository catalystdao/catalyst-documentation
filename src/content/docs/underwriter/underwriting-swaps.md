---
title: "Fast Swaps"
description: "Catalyst supports fast swaps. Fast swaps are price and execution settled in roughly 30 seconds to 1 minute. This is done by selling the finality risk to an Underwriter."
sidebar:
  order: 1
---

Catalyst supports fast swaps also called underwritten swaps. Fast swaps are price and execution settled before the messaging bridge has confirmed the swap. Normal full finality swaps take around 15-30 minutes (some even longer) where fast swaps takes between 30 seconds and 1 minute.

## How?

Fast swaps works by selling the finality risk to an Underwriter. When an Underwriter determines a swap is _final_ they execute the equivalent swap. TheUunderwriter truely **executes** the swap, as the incoming Units will be swapped to the designated output asset. These assets will be escrowed and the underwrite will match the amount + a small amount of collateral. This scheme ensures that the Underwriter does not take on any price risk and can fully focus on the finality risk. The assets prvoided by the Underwriter sent to the designated output, the associated logic is executed, and the price finalised the Underwriter now waits for the messaging bridge to confirm full finality and then gets a refund of their provided tokens from the escrow.

To facilitate this, the Underwriter has to monitor newly created Catalyst swaps and relevant messaging bridge packages. The Underwriter needs to collect the relevant information: Swap context and the AMB package itself and then call: [`underwrite(...)`](https://github.com/catalystdao/catalyst/blob/e975abcf82cdd5a0b1dc7ac768e15d4511967a11/evm/src/CatalystChainInterface.sol#L698) on the associated Cross-Chain Interface.

There are a lot of security checks that needs to pass before underwriting to ensure that everything has been parsed correctly. If some information was incorrectly parsed, the `underwrite` call will **NOT** revert but instead execute and the settlement from the messaging bridge will **NOT** hit the underwrite. As a result, the Underwriter will not be able to recover the associated fronted assets for the underwrite. It may be able to recover some of the collateral.

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
   - If the underwriter evaluator is unable to correctly asses the profitability of underwrites, it could underwrite swaps such that it is not truely profitable.
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

(7.) which is very easiy to audit for and no issues has EVER been found with the escrow implementation.
