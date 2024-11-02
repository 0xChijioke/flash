const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(`https://soft-long-breeze.quiknode.pro/`);
const sepProvider = new ethers.JsonRpcProvider(`https://soft-long-breeze.ethereum-sepolia.quiknode.pro/`);
  

// ----------------------------------------
// Contract ABIs
// ----------------------------------------
const erc20Abi = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
];

const eventsABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "amount0",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "amount1",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint160",
        name: "sqrtPriceX96",
        type: "uint160",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "liquidity",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "tick",
        type: "int24",
      },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickLower",
        type: "int24",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickUpper",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickLower",
        type: "int24",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickUpper",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
];

const factoryAbi = ["function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)"];

const poolABI = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function factory() view returns (address)",
  "function fee() view returns (uint24)",
  "function liquidity() view returns (uint128)",
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function swap(address recipient, bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96, bytes data) nonpayable returns (int256 amount0, int256 amount1)",
  "function tickSpacing() view returns (int24)"
];

const flashVaultABI = [
  "function executeArbitrage(address _pool0, address _pool1, address _tokenOut, uint256 _amount, bool _isToken0USDC)"
];

const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48".toLowerCase();
const UNI_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const SUSHI_FACTORY = "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F";

// Using hardcoded params for testnet contract interaction.
const poolAddress0 = "0x3faC21f2d59d890BA23b82028aB2B3dA8ae5A116"; // Uniswap WBTC/USDC 0.3% pool 
const poolAddress1 = "0x4172e7C0346fEb6461b4196a40237E006d119384"; // Uniswap WBTC/USDC 1% pool
const tokenOut = "0x29f2D40B0605204364af54EC677bD022dA425d03";
const flashVault = "0x5594154D4509d251dc7A9cFC1e5E8Dd9E847a912";

const privateKey = "";
const wallet = new ethers.Wallet(privateKey, sepProvider);
const flashVaultContract = new ethers.Contract(flashVault, flashVaultABI, wallet);


// ----------------------------------------
// Main Function
// ----------------------------------------
async function main(params) {
    const filteredLogs = params;

  if (!Array.isArray(filteredLogs)) {
    return { error: "Invalid filtered receipts format.", success: false };
  }

  const res = await handleLogs(filteredLogs);

  return { message: "Logs decoded and processed.", success: res };
}

// ----------------------------------------
// Log Decoder: handleReceipt
// ----------------------------------------
async function handleLogs(filteredLogs) {

  for (const log of filteredLogs) {

    try {
      const { address: contractAddress } = log;

      const poolDetails = await getPoolDetails(contractAddress);
      const { factory, token0, token1 } = poolDetails;
      if (identifyProtocol(factory) === "Unknown" || !isUSDCInvolved(token0, token1)) {

        return false;
      }

      // const decodedLog = await parseLog(log);
      // if (decodedLog) {
        return handleSwap(poolDetails);
      // }

      
    } catch (error) {
      console.error(error);
    }
  }
}

async function getPoolDetails(poolAddress) {
  const poolContract = new ethers.Contract(poolAddress, poolABI, provider);

  const details = {
    factory: await new Promise((resolve) => {
      poolContract.factory().then(resolve).catch(() => resolve(null));
    }),
    token0: await new Promise((resolve) => {
      poolContract.token0().then(resolve).catch(() => resolve(null));
    }),
    token1: await new Promise((resolve) => {
      poolContract.token1().then(resolve).catch(() => resolve(null));
    }),
    fee: await new Promise((resolve) => {
      poolContract.fee().then(f => resolve(f.toString())).catch(() => resolve(null));
    }),
    liquidity: await new Promise((resolve) => {
      poolContract.liquidity().then(l => resolve(l.toString())).catch(() => resolve(null));
    }),
    slot0: await new Promise((resolve) => {
      poolContract.slot0().then(s => resolve(s.toString())).catch(() => resolve(null));
    }),
  };
  
  return details;
}

async function getAllPoolAddresses(factory, tokenA, tokenB) {
  const feeTiers = [500, 3000, 10000];
  const pools = [];

  for (const fee of feeTiers) {
        try {
            const poolAddress = await getPoolAddress(factory, tokenA, tokenB, fee);

            if (poolAddress) {
                const poolDetails = await getPoolDetails(poolAddress);
                pools.push({ poolAddress, ...poolDetails });
            }
        } catch (error) {
          console.error(error);
            console.log("getAllPoolAddresses issue")
          }
        }
        
        return pools;
      }
  
      async function getPoolAddress(factoryAddress, tokenA, tokenB, fee) {

        const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);
  
    const poolAddress = factoryContract.getPool(tokenA, tokenB, fee)
    .then(poolAddress => poolAddress.toString())
    .catch(error => {
      console.error(error);
    });

    if (!poolAddress) {
      return;
    }
  
    return poolAddress;
  }
  
  // ----------------------------------------
  // Swap Event Handler: handleSwap
// ----------------------------------------
async function handleSwap(poolDetails) {
  try {
    const { token0, token1 } = poolDetails;
    // Fetch all pools with the same pair (Uniswap & SushiSwap)
    const allPools = await getAllPoolsAcrossDEXes(token0, token1);

     // Fetch token metadata
    const token0Metadata = await getTokenMetadata(token0);
    const token1Metadata = await getTokenMetadata(token1);


    // Calculate prices for all pools
    function calculatePoolPriceForPool(pool) {
      return new Promise((resolve, reject) => {
        const slot0Values = pool.slot0.split(',');
        const sqrtPriceX96 = slot0Values[0];
        
        const token0Address = pool.token0;
        const fee = pool.fee;
        
        
        const token0Data = { ...token0Metadata, address: token0Address };
        
        calculatePoolPrice({
          sqrtPriceX96: sqrtPriceX96,
          token0: token0Data, 
          token1: token1Metadata,
          fee: fee
        })
        .then(price => resolve({ ...pool, price }))
        .catch(error => {
          console.error(`Error calculating price for pool: ${error.message}`);
          resolve(null);
        });
      });
    }

    async function processAllPools(allPools) {
      const poolPrices = [];
      
      for (const pool of allPools) {
        try {
          const poolWithPrice = await calculatePoolPriceForPool(pool);

          if (poolWithPrice) poolPrices.push(poolWithPrice);
        } catch (error) {
          console.error(error); 
        }
      }

      return poolPrices;
    }

    const poolPrices = await processAllPools(allPools);
    
    const arbitrage = checkForArbitrage(poolPrices);
    
    if (arbitrage) {
      const { buyPool, sellPool, tradeAmount } = arbitrage;
        const trigger = await triggerArbitrageExecution({ buyPool, sellPool, tradeAmount });
        console.log(trigger)
        return trigger;
       
    } else {
        console.log("No arbitrage opportunity found.");
      }

    } catch (error) {
      console.error(error);
  }
}

// ----------------------------------------
// Get Relivant Pools Across DEXes
// ----------------------------------------
async function getAllPoolsAcrossDEXes(tokenA, tokenB) {
  
  const uniswapPools = await getAllPoolAddresses(UNI_FACTORY, tokenA, tokenB);
  const sushiSwapPools = await getAllPoolAddresses(SUSHI_FACTORY, tokenA, tokenB);

  const allPools = [...uniswapPools, ...sushiSwapPools].filter(Boolean);
  if (allPools.length === 0) {
    console.log("No pools found for the given token pair across Uniswap and SushiSwap.");
  }
  return allPools;
}

// ----------------------------------------
// Calculate Pool Price
// ----------------------------------------
async function calculatePoolPrice({ sqrtPriceX96, token0, token1 }) {
  const isUSDC0 = token0.address.toString().toLowerCase() === USDC;
    const poolInfo = {
      sqrtX96: sqrtPriceX96,
      pair: `${token0.symbol} / ${token1.symbol}`,
      decimal0: token0.decimals,
      decimal1: token1.decimals,
      isUSDC0
    };
    
    
    return calculatePriceFromSqrtX96(poolInfo);
  }

// ----------------------------------------
// Check for Arbitrage
// ----------------------------------------
function checkForArbitrage(pools) {
  // Minimum liquidity threshold
  const minimumLiquidityThreshold = BigInt("1000"); // hardcoded placeholder (should be determined dynamically)
  
  const validPools = pools.filter(pool => BigInt(pool.liquidity) > BigInt(minimumLiquidityThreshold));

  if (validPools.length < 2) {
      console.log("Not enough valid pools with sufficient liquidity.");
      return null;
  }

  let buyPool = validPools[0];
  let sellPool = null;

  validPools.forEach(pool => {
      if (pool.price.buyPrice < buyPool.price.buyPrice ||
        (pool.price.buyPrice === buyPool.price.buyPrice && BigInt(pool.liquidity) > BigInt(buyPool.liquidity))
      ) {
        buyPool = pool;
      }
  });
  
  validPools.forEach(pool => {
      if (pool !== buyPool && (!sellPool || pool.price.sellPrice > sellPool.price.sellPrice ||
        (pool.price.sellPrice === sellPool.price.sellPrice && BigInt(pool.liquidity) > (BigInt(sellPool.liquidity)))
      )) {
          sellPool = pool;
        }
  });
  
    
  const buyPriceInUSDC = buyPool.price.buyPrice;
  const sellPriceInUSDC = 1 / sellPool.price.sellPrice;
  
  const profitMargin = (sellPriceInUSDC - buyPriceInUSDC) / buyPriceInUSDC;
  
  // Set minimum profit threshold
  const minimumProfitThreshold = 0.01; // hardcoded placeholder (should be determined dynamically)

  if (profitMargin > minimumProfitThreshold) {
    const tradeAmount = "2"; // hardcoded placeholder (should be determined dynamically)
    return { buyPool, sellPool, tradeAmount };
  }

  
  console.log("No profitable arbitrage opportunity found.");
  return null;
}

// ----------------------------------------
// Execute Arbitrage
// ----------------------------------------
async function triggerArbitrageExecution({ buyPool, sellPool, tradeAmount }) {
    try {

      const amount = ethers.parseUnits(tradeAmount, 6);

      const feeData = await provider.getFeeData();
      console.log(feeData.maxFeePerGas.toString())
      

      const tx = await flashVaultContract.executeArbitrage(
        poolAddress0,
        poolAddress1,
        tokenOut,
        amount,
        false,
        {
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        } 
      );
      
      await tx.wait();
      
      return true;
  
    } catch (error) {
      console.error(error);
      return false;
    }
  }


function calculatePriceFromSqrtX96(poolInfo) {
  const { sqrtX96, pair, decimal0, decimal1, isUSDC0 } = poolInfo;
  
  const sqrtX96Bi = BigInt(sqrtX96); 
  const sqrtPrice = sqrtX96Bi / (BigInt(2) ** BigInt(96)); 
  const price = Number(sqrtPrice ** BigInt(2));

  const adjustmentFactor = 10 ** Number(decimal1) / 10 ** Number(decimal0);

  if (price === 0 || adjustmentFactor === 0) {
    console.log(`Price or Adjustment is zero for ${pair}.`);
    return;
  }

  const buyPrice = isUSDC0 ? adjustmentFactor / price : price / adjustmentFactor;
  const sellPrice = isUSDC0 ? price / adjustmentFactor : adjustmentFactor / price;
  
  return {
    buyPrice: buyPrice,
    sellPrice: sellPrice
  };
}

// ----------------------------------------
// Utility Function: parseLog
// ----------------------------------------

async function parseLog(log) {
  try {
    const iface = new ethers.Interface(eventsABI);
    
    const eventType = getEventType(log.topics[0]);
    const decodedLog = iface.parseLog(log.data, log.topics);

    return { eventType, args: decodedLog };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ----------------------------------------
// Event Processor: processEvent
// ----------------------------------------
// Processes the handle event

function processEvent(eventType, poolDetails) {
  switch (eventType) {
    case "Swap":
      handleSwap(poolDetails);
      break;
    //     case "Mint":
    //         handleMint(args, poolDetails);
    //         break;
    //     case "Burn":
    //         handleBurn(args, poolDetails);
    //         break;
    default:
      console.log("Unknown event type.");
  }
}

// ----------------------------------------
// Helper Functions 
// ----------------------------------------

async function getTokenMetadata(tokenAddress) {
  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
  const [symbol, decimals] = await Promise.all([tokenContract.symbol(), tokenContract.decimals()]);
  return { symbol, decimals };
}


function identifyProtocol(factory) {
  if (factory === UNI_FACTORY) return "Uniswap";
  if (factory === SUSHI_FACTORY) return "Sushiswap";
  return "Unknown";
}


function isUSDCInvolved(token0, token1) {
  return String(token0).toLowerCase() === USDC || String(token1).toLowerCase() === USDC;
}

const topicToEventType = {
  "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67": "Swap",
  "0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde": "Mint",
  "0x0c396cd989a39f4459b5fa1aed6a9a8dcdbc45908acfd67e028cd568da98982c": "Burn",
};

function getEventType(topic) {
  return topicToEventType[topic] || "Unknown";
}

function calculatePremium(amount) {
  const rate = 0.05 / 100;
  return amount * rate;
}



module.exports = { main };
