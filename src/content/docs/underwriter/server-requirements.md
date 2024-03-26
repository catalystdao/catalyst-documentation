---
title: "Server Requirements"
description: "Underwriting is dependent on running a relayer and requires slighly higher specifications."
sidebar:
  order: 2
---

Underwriting requres running a relayer:

1. The relayer acts as a data engine for the Underwriter. It collects everything related to relaying. It has both packages needed to get relevant underwrite infromation and the bounty which helps with evaluating if underwriting is worth it.
2. The underwriter is very reliant on the underwritten swaps getting relayed. As a result, it needs to be able to force some packages to be relayed.

We recommend running the underwriter on the same VPS as the relayer. Underwriting requires a high degree of stability and as a result, the requirements are slightly higher:

| Requirements | Minimum                | Recommended            |
| ------------ | ---------------------- | ---------------------- |
| Processors   | 1 fast vCPU or 2 vCPUs | 2 vCPU or 3 slow vCPUs |
| Memory       | 2 GB                   | 2 GB                   |
