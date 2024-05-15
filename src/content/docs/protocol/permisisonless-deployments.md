---
title: "Permissionless Deployments"
description: "Anyone can deploy Catalyst to any chain that supports either EVM or CosmWasm."
sidebar:
  order: 6
---

Catalyst is designed with ease of deployment in mind. Catalyst can be permissionlessly deployed to any chain and connected it to the existing Catalyst network.

Currently Catalyst has 2 implementations, allowing us to support any chain that supports either:

- EVM
- CosmWasm

For new chains: any new chain built using supported modular chain tooling (e.g., Rollups-as-a-Service) will be able to use Catalyst as a "liquidity module" to automatically and permissionlessly connect liquidity from the new chain to any designated chain. More details on this later.


# EVM: Deploying Catalyst

The Catalyst Protocol is split into 2 systems: Core Catalyst and Cross-chain Interface. Core Catalyst is a native AMM that allows exchanging 2 assets locally on the same chain. It does not have support for cross-chain swaps. The Cross-chain Interface extends Core Catalyst with cross-chain swaps.

### Requirements

- Foundry. The deployment scripts use Foundry.
  Install [Foundryup](https://book.getfoundry.sh/getting-started/installation), and run `foundryup` in a terminal to install Foundry.

- Foundry uses [create2 factory](https://github.com/Arachnid/deterministic-deployment-proxy) to deploy smart contracts to deterministic addresses. This contract may already have been deployed to chains. If not, fund `0x3fAB184622Dc19b6109349B94811493BF2a45362` with `0.01` Gas Token and then do:

```bash
curl <CHAIN_RPC_URL> -X 'POST' -H 'Content-Type: application/json' --data "{\"jsonrpc\":\"2.0\", \"id\":1, \"method\": \"eth_sendRawTransaction\", \"params\": [\"0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222\"]}"`
```

## Deploying to a new chain

Catalyst deploy scripts are based on [BaseMultiChainDeployer.s.sol](https://github.com/catalystdao/GeneralisedIncentives/blob/main/script/BaseMultiChainDeployer.s.sol). Modifying this file is optional to deploy Core Catalyst but is recommended for setting channels for the Cross-chain Interface.

### Adding a chain to BaseMultiChainDeployer (optional)

To add a new chain to the deployment script, fork [GeneralisedIncentives](https://github.com/catalystdao/GeneralisedIncentives), then modify `script/BaseMultiChainDeployer.s.sol` by adding the new chain to the Chains enums:

```solidity
enum Chains {
    Sepolia,
    ...,
    <YOUR_CHAIN_HERE>
}
```

and adding an entry for the RPC keys in the constructor:

```solidity
constructor() {
  chainKey[Chains.sepolia] = "sepolia";
  chain_list.push(Chains.Sepolia);

  ...

  chainKey[Chains.<YOUR_CHAIN_HERE>] = "<your_chain_here>";
  chain_list.push(Chains.<YOUR_CHAIN_HERE>);
}
```

The line `chainKey[Chains.<YOUR_CHAIN_HERE>] = "<your_chain_here>";` sets `<your_chain_here>` as the env variable to read the chain RPC key from.

Push the modified file to a repository of your choice and create a PR on the [Generalised Incentives](https://github.com/catalystdao/catalyst/pulls) repository.

### Configuring for deployment

If you done the optional step above, please set the git submodule path to your repository by modifying `/.gitmodules`:

```yaml
[submodule "evm/lib/GeneralisedIncentives"]
	path = evm/lib/GeneralisedIncentives
	url = https://github.com/catalystdao/GeneralisedIncentives  <-- here
```

Regardless of the above, you need to modify the `.env` file. Set the following values:

```bash
CATALYST_ADDRESS=<copy from .env.example>
DEPLOYER_PK=<YOUR_PRIVATE_KEY>
<your_chain_here>=<https://your.rpc.com/maybe-a-key>
```

- **CATALYST_ADDRESS**: copy from `.env.example`. This allows the Catalyst governance to take over the deployment in the future. If set to another value, the script won't deploy as the addresses will be different.
- **DEPLOYER_PK**: The private key of the deployer. Ensure it has gas. A new wallet can be generated via `cast wallet new`
- **<your_chain_here>**: Your chain name, set to an RPC of the chain.

There should be no `<` or `>` in the env file. For Cross-chain Interface configuration, see the relevant section.

With env keys set, compile the contracts: `forge compile`. This will save the complied comtracts to `./out` ready for deployment. This takes ~15 minutes.

## Core Catalyst

Deploying Core Catalyst is permissionless and can be verified to be authentic if deployed to the pre-configred create2 addresses.

Assuming you have done the above, deploying is as simple as calling:

```bash
forge script DeployCatalyst --sig "deployAll(string[])" "[<your_chain_here>]" --broadcast
```

You may want to run the above command without `--broadcast` once to validate the output. You can get the trace of the deployment simulation by adding `-vvvv`.

You can find the contracts Catalyst has been deployed to in `script/config/config_contracts.json`.

## Cross-chain Interface

While the Cross-chain Interface can be deployed permissionlessly, the deployer is in charge of setting cross-chain connections. Specifically, the deployer has the following permissions:

1. Set **new** cross-chain connections. If not set correctly, it may lead to loss of funds. Once a connection is set, it cannot be changed. This ensures that previously correct vaults remain correct indefinitely.
2. Configure gas parameters for cross-chain swaps. This does not impact in-flight swaps but is able to disable initiation of new swaps, including selectivly censoring transactions by sandwiching. For amplified pools, this can lead to loss of some funds if the pool is particularly unbalanced.
3. They can modify underwriting duraction such that they become unmatchable, or cause excessive escrow usage resulting in cheaper DoS for the pool. This can even be exploited by the owner. This only impacts new underwrites.

As a result, while anyone can deploy a cross-chain interface there are certain trust factors that makes it more applicable for certain individuals to deploy the cross-chain interface.

### Configuring chain channels

Catalyst uses a package called [catalyst-channel-list](https://github.com/catalystdao/catalyst-channel-lists) for manging channels. This list is both used for the UI and to deploy contracts. It has to be modified to correctly set Cross-chain interface channels.

Fork [catalyst-channel-list](https://github.com/catalystdao/catalyst-channel-lists) and modify the 2 files:

- [src/config/chains.json](https://github.com/catalystdao/catalyst-channel-lists/blob/main/src/config/chains.json): Add an ID for your chain. Currently, it is assumed that this is the EVM chainid.
- [src/config/chainNameToId.json](https://github.com/catalystdao/catalyst-channel-lists/blob/main/src/config/chainNameToId.json): Add all relevant channels for your chain & supported AMBs. The structure is `MESSAGING_PROVIDER.FROM_CHAIN.TO_CHAIN`. You need to add your chain as a FROM_CHAIN, including all outgoing channels, and modify ever FROM_CHAIN where you have an incoming channel.

Push changes & create PR.

Then set set the git submodule path to your repository: `/.gitmodules`:

```yaml
[submodule "evm/lib/catalyst-channel-lists"]
	path = evm/lib/catalyst-channel-lists
	url = https://github.com/catalystdao/catalyst-channel-lists  <-- here
```

TODO: Pull new submodules down. Something like `git pull --recursive`.

### Deploying CCI

You need to execute 2 scripts to deploy the cross-chain interface.
