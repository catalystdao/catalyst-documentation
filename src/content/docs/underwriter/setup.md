---
title: "Setting Up An Underwriter"
description: "Underwriting is dependent on running a relayer. While adding the underwriting module to the relayer is technically easy, be aware of the associated risks."
sidebar:
  order: 3
---

Before setting up an underwriter, ensure that you are fully aware of the associated [risks](/underwriter/underwriting-swaps#risk-specifications) and have read the associated underwriter [README](https://github.com/catalystdao/catalyst-underwriter?tab=readme-ov-file#catalyst-underwriter).

For this guide, it is assumed that you are running a [relayer](/relayer/setup) and have gone through the associated setup and fulfill all of the requirements for running a relayer. If the relayer isn't working, getting bountes, collecting proofs, or submitting transactions you should try to fix those issues before running an underwriter.

It is assumed that the underwriter is running on the same VPS as the relayer AND the folder name of the relayer is `~/generalised-relayer`

## Installing the Underwriter Module

To install the underwrtier, pull the [catalyst-underwriter](https://github.com/catalystdao/catalyst-underwriter) repository.

```bash
git clone https://github.com/catalystdao/catalyst-underwriter.git
cd catalyst-underwriter
```

Similarly to the relayer, we need to make copies of the configuration files:

```bash
cp config.example.yaml config.production.yaml
cp .env.example .env
```

Once this has been done, we can go on to configuration.

## Configuring the Relayer

We need to edit `config.production.yaml` with the correct configuration values. Similarly to the relayer, we need to modify the privatekey (`global.privateKey`) and RPCs (`chains.[chain].rpc`).

Follow [the tutorial](/relayer/setup#private-key) for the relayer for these values.

:::danger[Loss Of Funds!]
Do not use this private key for anything else! Ensure that this key is different from the relayer.
Any interference is likely to result in lost funds.
:::

### Pools

Currently you have to specify explicitly which pools to underwrite. For testnet, leave them as the default.

## Funding the relayer

The relayer requires 2 types of funding:

1. Gas funding. We highly recommend filling it up with a slight excess. The underwriter will not get more gas as it is operating (unlike the relayer) and if it runs out of gas it will be unable to expire its underwriters if something goes wrong which may lead to loss of collateral.
2. Underwrite capital. The underwriter requires assets which it can front for underwrites. For testnet, these are the respective wrapped assets. You can get these by wrapping on the Catalyst UI and sending them to the associated address.

## Running the underwriter

In the future, the underwriter will go through a graceful shutdown to ensure that all of its underwrites are monitored to completion. This reduces chances for loss of funds.

When everything has been set, assuming you are within the underwriter folder, `~/catalyst-underwriter`, you can start the relayer by running:

```bash
docker compose up -d
```

You can access the log by running:

```bash
docker compose logs underwriter -fn 100
```

If you want to stop the underwriter you can run

```bash
docker compose stop
```
