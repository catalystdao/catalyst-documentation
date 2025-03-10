---
title: "Input Settlement"
slug: "architecture/input"
description: "Built with resource locks in mind, Catalyst supports a variety of input settlement schemes. TheCompact and Rhinestone both allow for first-fill flows and sponsored transactions, assuming the user has existing deposits."
sidebar:
  order: 1
---

Catalyst currently implements two input settlement schemes:
1. [TheCompact](https://github.com/Uniswap/the-compact) through `CompactSettlerWithDeposit.sol`
2. [Rhinestone](https://www.rhinestone.wtf) through `CompactSettler.sol`

Both TheCompact and Rhinestone are resource locks and thus support first-fill flows. However, Catalyst also supports ordinary flows.

Catalyst provides a base implementation for settlement schemes via `BaseSettler.sol`. Alternatively, if possible, `CompactSettler.sol` can be forked with less effort.

#### Default Output
The default output for settlement schemes is the `OutputDescription`:
```solidity
struct OutputDescription {
    bytes32 remoteOracle;
    bytes32 remoteFiller;
    uint256 chainId;
    bytes32 token;
    uint256 amount;
    bytes32 recipient;
    bytes remoteCall;
    bytes fulfillmentContext;
}
```
To check if the encoded output description has been validated, the hashed encoded payload should be sent to the appropriate local oracle using the Validation Layer Interface along with relevant resolution details, such as who the solver was.

## CompactSettler (TheCompact & Rhinestone)
Both Rhinestone and TheCompact work through `CompactSettler.sol`. Being able to solve for one allows you to solve the other, except that signature and lock validation differ slightly.

The Compact Settler uses the `CatalystCompactOrder`:
```solidity
struct CatalystCompactOrder {
    address user;
    uint256 nonce;
    uint256 originChainId;
    uint32 fillDeadline;
    address localOracle;
    uint256[2][] inputs;
    OutputDescription[] outputs;
}
```
Notice that the `fillDeadline` is also used as the expiry for the timelock. As a result, when filling outputs of `CatalystCompactOrder`, ensure there is sufficient time for validation as well.

The CompactSettler supports five ways to resolve locks once the outputs have been made available for verification by the validation layer:

```solidity
function finaliseSelf(CatalystCompactOrder calldata order, bytes calldata signatures, uint32[] calldata timestamps, bytes32 solver) external;

function finaliseTo(CatalystCompactOrder calldata order, bytes calldata signatures, uint32[] calldata timestamps, bytes32 solver, address destination, bytes calldata call) external;

function finaliseFor(
    CatalystCompactOrder calldata order,
    bytes calldata signatures,
    uint32[] calldata timestamps,
    bytes32 solver,
    address destination,
    bytes calldata call,
    bytes calldata orderOwnerSignature
) external;

// -- Fallback Finalise Functions -- //

function finaliseTo(CatalystCompactOrder calldata order, bytes calldata signatures, uint32[] calldata timestamps, bytes32[] calldata solvers, address destination, bytes calldata call) external;

function finaliseFor(
    CatalystCompactOrder calldata order,
    bytes calldata signatures,
    uint32[] calldata timestamps,
    bytes32[] calldata solvers,
    address destination,
    bytes calldata call,
    bytes calldata orderOwnerSignature
) external;
```

Notice that the fallback functions exist to fix orders that have been solved by multiple solvers. This is required because we need to hydrate the `OutputDescription` with the solver to check if the output has been filled on the Validation Layer.

There are three ways to finalize an intent:
1. Self-serve, called by the solver with the tokens paid to the solver. `finaliseSelf`
2. Self-serve, custom delivery. Called by the solver with the tokens paid to a specific address. `finaliseTo`
3. External finalization with a signed message by the solver designating where assets are to be delivered. `finaliseFor`

To use external finalization, the struct `AllowOpen` must be EIP712 signed:
```solidity
struct AllowOpen {
    bytes32 orderId;
    address originSettler;
    address destination;
    bytes call;
}
```

### Registering Intents

For how to register intents with Rhinestone, please refer to their documentation.

For TheCompact, `CompactSettler.sol` supports the `BatchClaimWithWitness` claim type. The witness should be the encoded `CatalystCompactOrder`. For further integration assistance, refer to `TestCatalyst.t.sol::test_entire_flow`.

#### With Deposit

When integrating CompactSettler, if the settler uses the `withDeposit` extension, you may use the associated deposit function. This allows you to deposit and register an intent at the same time, reducing the number of user interactions by one.

```solidity
function depositFor(CatalystCompactOrder calldata order, ResetPeriod resetPeriod) external;
```

When this function is called, the `Deposit` event will be emitted for permissionless discovery.
```solidity
event Deposited(bytes32 orderId, CatalystCompactOrder order);
```

:::note
Nonces cannot be reused and should be unique.
:::