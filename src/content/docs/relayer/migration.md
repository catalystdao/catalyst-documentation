---
title: "Changelog and Migration"
description: "Changelog and steps to migrate to the latest Relayer version."
sidebar:
  order: 4
---

## v0.1.0
---
Release: [GitHub](https://github.com/catalystdao/generalised-relayer/releases/tag/v0.1.0)
#### Changelog
- Implemented a `monitor` service to follow the latest chain blocks and keep all other services within the relayer in sync.
- Implemented a `wallet` service for transaction handling (same as the underwriter's `wallet` service).
- Recovery of past AMB messages/proofs on Wormhole.
- Improve handling of l1 and l2 block numbers for chains like Arbitrum.
- More efficient rpc queries (including `ethers` 6 upgrade).
- Fixed error logging.
- Large refactors to increase code clarity and efficiency.
- Full [changelog](https://github.com/catalystdao/generalised-relayer/commit/e7d63265b7ddfcf5b3210ae74f71659c01681f5f).

### Migration steps:
From within the Relayer's directory:
- Pull down the Relayer if it is running.
    ```bash
    docker compose down
    ```
    :::caution
    Pull down the Underwriter first if it is running in tandem with the Relayer.
    :::
- Get the latest changes from the repo's `v0.1.0` release:
    ```bash
    git fetch && git checkout v0.1.0
    ```
- Pull the corresponding docker image:
    ```bash
    docker pull ghcr.io/catalystdao/generalised-relayer:0.1
    ```
- Update the Relayer configuration:
    :::caution
    It is highly recommended to rewrite the Relayer configuration from scratch using the example configuration file provided (`config.example.yaml`).
    :::
    - New `monitor` configuration (within `global` and within each chain on `chains`).
        - `blockDelay` moved from `global`/`chains` to here.
        - `interval` moved from `getter` to here.
    - New `wallet` configuration (within `global` and within each chain on `chains`).
        - Configurations moved from the `submitter` section: `confirmations`, `confirmationTimeout`, `lowGasBalanceWarning` (renamed from `lowBalanceWarning`), `gasBalanceUpdateInterval` (renamed from `balanceUpdateInterval`), `maxFeePerGas`, `maxAllowedPriorityFeePerGas`, `MaxPriorityFeeAdjustmentFactor`, `maxAllowedGasPrice`, `gasPriceAdjustmentFactor`, `priorityAdjustmentFactor`.
    - Optional `resolver` configuration for each chain.
        - `resolver: 'arbitrum'` is now **required** for Arbitrum.
    - See `config.types.ts` for further advanced configuration options added that are not present on `config.example.yaml`.
- Start the Relayer.
    ```bash
    docker compose up -d
    ```