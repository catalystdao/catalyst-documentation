---
title: "Changelog and Migration"
description: "Changelog and steps to migrate to the latest Underwriter version."
sidebar:
  order: 4
---

## Installing a new Underwriter version
From within the Underwriter's directory:
- Pull down the Underwriter if it is running.
    ```bash
    docker compose down
    ```
- Get the codebase changes:
    ```bash
    git fetch && git checkout main
    ```
- Pull the corresponding docker image:
    ```bash
    docker pull ghcr.io/catalystdao/catalyst-underwriter:latest
    ```
- Perform any migration steps as described on all relevant changelogs.
- Start the Underwriter.
    ```bash
    docker compose up -d
    ```
  :::tip
  To install a specific Underwriter version, replace `main` and `latest` on the commands above with the desired version tag.
  :::

## v0.1.0
---
Release: [GitHub](https://github.com/catalystdao/catalyst-underwriter/releases/tag/v0.1.0)
#### Changelog
- Complete overhaul of how the Underwriter determines whether to execute underwrites. Any swap that goes to a vault that has been created with an approved *vault template*, within a whitelisted *endpoint* is now allowed to be underwritten (allowed vault addresses had to be hardcoded before on the Underwriter's configuration). This means that the Underwriter now supports newly created vaults on the fly.
- The Underwriter now 'syncs' with the Relayer's `monitor` service.
  - **The `blockDelay` option of the Underwriter now configures an *additional* block delay to that of the Relayer.**
- A new `minMaxGasDelivery` configuration prevents the Underwriter from executing underwrites of cross-chain packets with a too low `maxGasDelivery` that would cause the packet from never arriving at the destination chain.
  - **This configuration must be defined for ALL chains individually.**
- A new `minRelayDeadlineDuration` configuration prevents an Underwriter from underwriting a cross-chain swap with a delivery deadline that is too short.
- A new `minUnderwriteDuration` configuration on the `expirer` prevents the Underwriter from auto expiring underwrites as a result of invalid configuration.
- Block reorgs are detected using the `blockDelay` configuration.
- Improve handling of l1 and l2 block numbers for chains like Arbitrum.
- Full [changelog](https://github.com/catalystdao/catalyst-underwriter/commit/03ba7a539f22cb78439ae2d9889bd705852fa454).

### Migration steps:
- Update the Underwriter configuration:
    :::caution
    It is highly recommended to rewrite the Underwriter configuration from scratch using the example configuration file provided (`config.example.yaml`).
    :::
    - The `pool` configuration has been removed.
    - New `endpoint` configuration (see `config.example.yaml`):
      - Every endpoint defines a whitelisted Catalyst *factory* + *interface* + *incentives* address combination, together with the approved *vault template* addresses and *cross-chain channels* configuration.
    - `blockDelay` has been moved to the `monitor` configuration.
    - `underwriteBlocksMargin` has been renamed renamed to `maxUnderwriteDelay` and is now time-based.
    - Optional `resolver` configuration for each chain
      - `resolver: 'arbitrum'` is now **required** for Arbitrum.
    - See `config.types.ts` for further advanced configuration options added that are not present on `config.example.yaml`.
