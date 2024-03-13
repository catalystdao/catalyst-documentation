---
title: "Contract Deployments"
sidebar:
    order: 2
---

All Catalyst and associated contracts are deployed using create2. This lets anyone deploy Catalyst to any chain and lets anyone verify that a deployment is authentic by only checking the associated addresses. Some contracts have dependencies outside Catalyst and those addresses may change based on other factors and as a result addresses may not be the same across-chain.

### Generalised Incentives

Anyone can deploy Generalised Incentives. The known deployments can be found here:
https://github.com/catalystdao/GeneralisedIncentives/blob/main/script/bridge_contracts.json

### Catalyst Core

Anyone can deploy Catalyst to preconfigured contracts. You can find the pre-configured contracts here:
https://github.com/catalystdao/catalyst/blob/main/evm/script/config/config_contracts.json


#### Cross-Chain Interfaces

Cross-chain interfaces changes between deployments but will still deploy only to a specific address and anyone can deploy new cross-chain interfaces to new chains. You can find the existing deployments here:
https://github.com/catalystdao/catalyst/blob/main/evm/script/config/config_chain.json