# Flash

## Overview

FlashVault is a decentralized protocol that automates cross-DEX arbitrage opportunities, specifically targeting price differences between Uniswap V3 and Sushiswap pools. The protocol allows users to deposit USDC into a tokenized vault and earn yields generated from automated arbitrage trading.
By using real-time monitoring and price execution triggers, FlashVault provides users with automated, reliable, and secure arbitrage-driven yield generation.




## Key Features

### User-Focused
- **PTransparent & Accessible**: Open participation via USDC deposits with traceable vault performance via on-chain data.
- **Automated Yields**: Benefit from profitable arbitrage without active management.
- **Seamless Withdrawals**: Withdraw funds anytime using vault shares.

### Protocol Mechanics
- **Real-Time Monitoring**: Real-time DEX price and liquidity tracking through QuickNode, which feeds data into our detection engine.
- **Gas Optimization**: Efficient execution logic to maximize net profits by reducing transaction costs.
- **Risk Management**: Built-in profit thresholds and liquidity validation to minimize exposure.
- **Flash Loan Integration**: Supports capital-efficient trading by using flash loans for larger arbitrage opportunities.




## Arbitrage Strategy
FlashVault focuses on a single, strategic approach: **Buy Low, Sell High** between USDC pairs on Uniswap V3 and SushiSwap.

1. **Price Monitoring**  
   - QuickNode streams capture DEX events and market fluctuations.
   - Validates liquidity to ensure trade viability.

2. **Trade Execution**  
   - Detects when an asset is undervalued on one DEX and overvalued on another.
   - Runs profit calculations, considering fees and gas costs.
   - Executes a buy from the lower-priced DEX and a simultaneous sell on the higher-priced DEX, optimizing for profit.

3. **Capital Efficiency**  
   - Uses flash loans for larger trades when advantageous, eliminating the need for collateral.
   - Ensures instant repayment post-trade to manage loan exposure.




## Architecture

### Protocol Workflow

1. **Real-Time Monitoring**
   - Leveraging **QuickNode Streams** for constant DEX event monitoring.
   - Tracks price movements, liquidity changes, and swap events to capture arbitrage triggers.

2. **Event Decoding & Price Calculation**
   - **QuickNode Functions** process events and calculate potential price discrepancies.
   - Ensures accuracy and optimizes execution timing by detecting when asset prices diverge across DEXs.

3. **Execution Trigger**
   - Executes trades once profit conditions are met, minimizing transaction time.
   - Uses the **executeArbitrage** function to initiate the arbitrage, with profit threshold and liquidity checks in place.

4. **Profit Distribution**
   - Net profits are distributed to vault shareholders.



```mermaid
flowchart TB
    subgraph UserActions["User Interface Layer"]
        direction LR
        Deposit["Deposit USDC"] --> |"Mint"| Shares["Receive Vault Shares"]
        Shares --> |"Burn"| Withdraw["Withdraw USDC + Profits"]
        Dashboard["Dashboard\n(Activity Monitor)"] -.-> |"View"| VaultMetrics["Vault Metrics\n& Performance"]
    end

    subgraph AutomatedSystem["Automated Arbitrage System"]
        direction TB
        subgraph Detection["Detection Engine"]
            QN["QuickNode"] --> |"Stream"| Events["Event Monitor/Stream"]
            Events --> |"Filter"| ValidPools["Valid USDC Pools"]
            ValidPools --> |"Compare"| PriceCheck["Price Analysis"]
            PriceCheck --> |"Identify"| Opportunity["Arbitrage Opportunity"]
        end

        subgraph Execution["Execution Engine"]
            Opportunity --> |"Trigger"| Contract["Smart Contract function: executeArbitrage"]
            Contract --> |"Check"| LiquidityCheck{"Sufficient\nVault Liquidity?"}
            LiquidityCheck -->|"Yes"| DirectSwap["Execute Direct Swaps"]
            LiquidityCheck -->|"No"| FlashLoan["Take Flash Loan"]
            FlashLoan --> Swaps["Execute Swaps"]
            DirectSwap --> |"Complete"| Profit["Pocket Profit"]
            Swaps --> |"Repay loan"| Profit
        end
    end

    Profit --> |"Increases"| VaultValue["Vault Value"]
    VaultValue --> |"Reflects in"| Shares

    classDef primary fill:#4CAF50,stroke:#333,stroke-width:2px,color:white
    classDef secondary fill:#2196F3,stroke:#333,stroke-width:2px,color:white
    classDef action fill:#FF9800,stroke:#333,stroke-width:2px,color:white
    classDef monitor fill:#9C27B0,stroke:#333,stroke-width:2px,color:white
    
    class Deposit,Withdraw primary
    class Events,PriceCheck,Opportunity secondary
    class Contract,DirectSwap,FlashLoan action
    class Dashboard,VaultMetrics monitor
```




## Technical Architecture


### Smart Contract Overview


Key Components

**Smart Contract Layer*
- ERC4626 Tokenized Vault

    
#### Backend Architecture

**Monitoring Layer**
- Arbitrage Detection Engine  
  - **Log Decoder**: Decodes incoming event data.
  - **Price Calculator**: Real-time asset price calculation.
  - **Arbitrage Checker**: Validates if price differences are profitable.
  - **Execution Trigger**: Initiates arbitrage in smart contract if conditions are met.







The FlashVault contract is built on the following standards, libraries and protocols:

- **ERC4626**: Ensures compatibility and standardization for yield-bearing vaults.
- **OpenZeppelin**: Trusted libraries provide secure token management and reentrancy protection.
- **Aave**: Supports instant, collateral-free borrowing to enable quick execution of profitable trades.

### Key Functions

- **Deposit**: Users can deposit USDC and receive shares in return.
  ```solidity
  function userDeposit(uint256 assets) external returns (uint256 shares);
  ```

- **Withdraw**: Users can withdraw their assets based on their shares.
  ```solidity
  function userWithdraw(uint256 shares) external returns (uint256 assets);
  ```
  ```solidity
  function executeArbitrage(
		address _pool0,
		address _pool1,
		address _tokenOut,
		uint256 _amount,
     	bool _isToken0USDC
	) external onlyFlashFunction ;
  ```


  ```solidity
  function _executeTrade(
		address pool0,
		address pool1,
		address tokenOut,
		uint256 amount,
     	bool isToken0USDC
	) internal;
  ```


## Future Roadmap

FlashVault’s roadmap includes expanding trading strategies, enhancing risk management, optimizing performance, and improving accessibility. Planned enhancements include:

1. **Additional Trading Strategies**  
   - **Multi-Hop Arbitrage**: Leverages multi-step trades across different assets.
   - **Cross-Chain Arbitrage**: Expands arbitrage to include cross-chain opportunities and liquidity utilization.

2. **Technical Enhancements**  
   - **Advanced Risk Management**: Adaptive thresholds, slippage controls, and dynamic position sizing.
   - **Performance Optimization**: MEV protection, parallel execution, and gas cost reductions.
   - **Infrastructure Improvements**: Integration of decentralized oracles, enhanced monitoring, and analytics.

3. **Protocol Expansion**  
   - **Additional DEX Integrations**: Supports more DEX protocols for increased reach and flexibility.
   - **Yield Optimization**: Idle fund utilization through yield farming and compounding strategies.











## Getting Started

### Requirements

- Node.js (>= v18.18)
- Yarn
- Git

### Quickstart

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/0xChijioke/flash.git
   cd flash
   yarn install
   ```

2. Run a local Ethereum network:
   ```bash
   yarn chain
   ```

3. Deploy the smart contract:
   ```bash
   yarn deploy
   ```



---

⚠️ **Disclaimer: This application is a prototype for demonstration and testing only. It is not production-ready.**