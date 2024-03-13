---
title: "Setting up a Relayer"
sidebar:
  order: 3
---

# Relayer Setup & Configuration

To configure the relayer, we will go through the following steps:

- [Installing Dependencies](#installing-dependencies)
- [Installing the Relayer](#installing-the-relayer)
- [Configuring the Relayer](#configuring-the-relayer)

## Installing Dependencies

The only dependencies for the relayer are Docker and Docker Compose Plugin (≥v2.24.0). You can find the installation instructions here:

https://docs.docker.com/engine/install/#supported-platforms

Click on the operation system of choice. We recommend Ubuntu and follow the relevant instructions like "[Install using the apt repository](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)".

Before going further, check if you have Docker installed, run:

```bash
docker compose version
```

It should return: `Docker Compose version v2.24.7` or similar.
If it returns a version lower than `v2.24.0` or an error, you have done something wrong.

## Installing the Relayer

To install the relayer, pull the [generalised-relayer](https://github.com/catalystdao/generalised-relayer) repository.

```bash
git clone https://github.com/catalystdao/generalised-relayer.git
cd generalised-relayer
```

We also need to make two copies of the configuration files.

```bash
cp config.example.yaml config.production.yaml
cp .env.example .env
```

Once this has been done, we can go on to configuration.

## Configuring the Relayer

We need to edit `config.production.yaml` with the correct configuration values. Assuming that you initially just want to dip your toes into relaying Generalised Incentives messages, you only have to set `global.privateKey` and RPCs (`chains.[chain].rpc`).

### Private key

This is a sensitive operation. You will have to generate a private key that will hold the gas for the relayer and relaying rewards. If someone else gets access to this key, they can steal your funds!

For this tutorial we will use [Foundry](https://github.com/foundry-rs/foundry) to give us a new address, however, Metamask is also suitable. Using Foundry: `cast wallet new` will produce an output like:

```bash
Successfully created new keypair.
Address:     <YOUR_ADDRESS>
Private key: <YOUR_PRIVATE_KEY>
```

If you haven’t installed Foundry, this command will not work. Instead, use Metamask.

Remember to backup your private key. After backing up your private key add it to the config. It is line number 2:

```bash
nano config.production.yaml
```

It should look something like:

```yaml
global:
  privateKey: "<YOUR_PRIVAET_KEY>"
  logLevel: "info"
  blockDelay: 5
  ...
```

### RPCs

The relayer comes with default public RPCs, however, these are not competitive, stable, or likely to continue working. By default, the config also contains a lot of chains. You may want to disable some chains depending on your preference.

We recommend an RPC service like Alchemy. If you make an account with Alchemy, you can also get funds for a testnet deployment from their faucets: https://www.alchemy.com/faucets/ethereum-sepolia

Edit the config with your chain configuration, they can be found at the bottom.

```bash
nano config.production.yaml
```

It should look something like this:

```yaml
...
chains:
  - chainId: 11155111
    name: "Sepolia"
    rpc: "<SEPOLIA_RPC>"
    ...

  - chainId: 421614
    name: "Arbitrum Sepolia"
    rpc: "<ARB_SEPOLIA_RPC>"
    ...

  - chainId: 11155420
    name: "OP Sepolia"
    rpc: "<OP_SEPOLIA_RPC>"
    ...

  - chainId: 84532
    name: "Base Sepolia"
    rpc: "<BASE_SEPOLIA_RPC>"
    ...
```

### NODE_ENV

The relayer chooses the configuration file based on the env. variable `NODE_ENV`. So far we have worked with the configuration being named `config.production.yaml`. As a result, we need to set NODE_ENV appropriately. This is done by running:

```bash
export NODE_ENV=production
```

For simplicity, you can set `NODE_ENV` across sessions. If you use this machine for other projects don’t do this.

```bash
echo "export NODE_ENV=production" >> ~/.bashrc
```

## Running the relayer:

When everything has been set, you can start the relayer by running:

```bash
docker compose up -d
```

You can access the log by running:

```bash
docker compose logs relayer -fn 100
```

If you want to stop the relayer you can run

```bash
docker compose stop
```
