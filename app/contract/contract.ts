import { createPublicClient, createWalletClient, custom, http, parseAbi, parseEther, parseEventLogs } from "viem";
import { mainnet, telosTestnet } from "viem/chains";
import { nftMarketAbi } from "./nft-market-abi";
import { decodeEventLog } from "viem/utils";
import { blindBoxAbi } from "./blind-box-abi";
import { nftAbi } from "./nft-abi";

export const nftMarketContractAddress: `0x${string}` = "0xD60d331B1999824C84A0A702D07368Fde493dF94";
export const publicClient = createPublicClient({
  chain: telosTestnet,
  transport: http(),
});

export async function newWindowWalletClient() {
  if (!window.ethereum) {
    alert("no wallet");
    return null;
  }
  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const walletClient = createWalletClient({
    chain: telosTestnet,
    transport: custom(window.ethereum),
    account: account,
  });

  return walletClient;
}

export async function getOrder(orderId: number) {
  return await publicClient.readContract({
    address: nftMarketContractAddress,
    abi: nftMarketAbi,
    functionName: "get",
    args: [orderId],
  });
}

function buildNftMarketParam(functionName: string, account: `0x${string}`, value: bigint, args: Array<any>) {
  return {
    address: nftMarketContractAddress,
    abi: nftMarketAbi,
    functionName: functionName,
    account: account,
    args: args,
    value: value,
  };
}

export async function list({
  nftAddr,
  tokenId,
  price,
  amount,
}: {
  nftAddr: `0x${string}`;
  tokenId: bigint;
  price: bigint;
  amount: bigint;
}) {
  const walletClient = await newWindowWalletClient();
  if (!walletClient) {
    return;
  }
  await setApprovalTrueForAll(nftMarketContractAddress);
  const { request } = await publicClient.simulateContract(
    buildNftMarketParam("list", walletClient.account.address, 0n, [nftAddr, tokenId, price, amount])
  );
  await walletClient.writeContract(request);
}

export async function purchase(
  value: bigint,
  {
    orderId,
    amount,
  }: {
    orderId: bigint;
    amount: bigint;
  }
) {
  const walletClient = await newWindowWalletClient();
  if (!walletClient) {
    return;
  }
  const { request } = await publicClient.simulateContract(
    buildNftMarketParam("purchase", walletClient.account.address, value, [orderId, amount])
  );

  await walletClient.writeContract(request);
}

export async function revoke({ orderId }: { orderId: bigint }) {
  const walletClient = await newWindowWalletClient();
  if (!walletClient) {
    return;
  }
  const { request } = await publicClient.simulateContract(
    buildNftMarketParam("revoke", walletClient.account.address, 0n, [orderId])
  );
  await walletClient.writeContract(request);
}

export async function updatePrice({ orderId, newPrice }: { orderId: bigint; newPrice: bigint }) {
  const walletClient = await newWindowWalletClient();
  if (!walletClient) {
    return;
  }
  const { request } = await publicClient.simulateContract(
    buildNftMarketParam("updatePrice", walletClient.account.address, 0n, [orderId, newPrice])
  );
  await walletClient.writeContract(request);
}

export async function updateAmount(
  {
    orderId,
    newAmount,
  }: {
    orderId: bigint;
    newAmount: bigint;
  }
) {
  const walletClient = await newWindowWalletClient();
  if (!walletClient) {
    return;
  }
  const { request } = await publicClient.simulateContract(
    buildNftMarketParam("updateAmount", walletClient.account.address, 0n, [orderId, newAmount])
  );

  await walletClient.writeContract(request);
}

// function list(address _nftAddr, uint256 _tokenId, uint256 _price, uint256 _amount)
// function purchase(uint256 _orderId, uint256 _amount)
// function revoke(uint256 _orderId)
// function updatePrice(uint256 _orderId, uint256 _newPrice)

// function updateAmount(uint256 _orderId, uint256 _amount)

export const blindBoxContractAddress = "0x48a2b70b834085A1C76CFF1523A94a072e161fe3";

export async function openBox(
  value: bigint,
  {
    nftAddr,
    count,
  }: {
    nftAddr: `0x${string}`;
    count: bigint;
  }
): Promise<readonly bigint[]> {
  const walletClient = await newWindowWalletClient();
  if (!walletClient) {
    return [];
  }
  const { request } = await publicClient.simulateContract({
    address: blindBoxContractAddress,
    abi: blindBoxAbi,
    functionName: "openBox",
    account: walletClient.account.address,
    args: [nftAddr, count],
    value: value,
  });

  const hash = await walletClient.writeContract(request);
  const tx = await publicClient.waitForTransactionReceipt({ hash: hash });
  const event = decodeEventLog({
    abi: parseAbi(["event BoxOpend(address indexed token, address indexed owner, uint256[] tokenIds)"]),
    data: tx.logs[0].data,
    topics: tx.logs[0].topics,
  });
  return event.args.tokenIds;
}

export async function combine({ nftAddr, tokenId }: { nftAddr: `0x${string}`; tokenId: bigint }): Promise<bigint> {
  const walletClient = await newWindowWalletClient();
  if (!walletClient) {
    return 0n;
  }
  const { request } = await publicClient.simulateContract({
    address: blindBoxContractAddress,
    abi: blindBoxAbi,
    functionName: "combine",
    account: walletClient.account.address,
    args: [nftAddr, tokenId],
  });

  const hash = await walletClient.writeContract(request);

  const receipt = await publicClient.waitForTransactionReceipt({ hash: hash });

  const event = decodeEventLog({
    abi: parseAbi(["event Combined(uint256 indexed tokenId, address indexed token, address indexed owner)"]),
    data: receipt.logs[0].data,
    topics: receipt.logs[0].topics,
  });
  return event.args.tokenId;
}

export const nftAddress = "0xf3981B00662D7C43C805Ce0ed65B521893B9C3e6";

export async function isApprovedForAll(account: `0x${string}`, operator: `0x${string}`) {
  return await publicClient.readContract({
    address: nftAddress,
    abi: nftAbi,
    functionName: "isApprovedForAll",
    args: [account, operator],
  });
}

export async function setApprovalTrueForAll(operator: `0x${string}`) {
  const walletClient = await newWindowWalletClient();
  if (!walletClient) {
    return;
  }
  const approved = await isApprovedForAll(walletClient.account.address, operator);
  if (approved) {
    console.log(`already approved for ${operator}`);
    return;
  } else {
    console.log(`preparing set approval for ${operator}`);
  }
  const { request } = await publicClient.simulateContract({
    address: nftAddress,
    abi: nftAbi,
    functionName: "setApprovalForAll",
    account: walletClient.account.address,
    args: [operator, true],
  });

  const hash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: hash });
}



export async function uri(nftAddr: `0x${string}`, tokenId: bigint) {
    return await publicClient.readContract({
        address: nftAddress,
        abi: nftAbi,
        functionName: "uri",
        args: [tokenId],
      });
}

// event Combined(uint256 indexed tokenId, address indexed token, address indexed owner);
// event BoxOpend(address indexed token, address indexed owner, uint256[] tokenIds);

//   box: 0x48a2b70b834085A1C76CFF1523A94a072e161fe3
// market: 0xD60d331B1999824C84A0A702D07368Fde493dF94
// nft: 0xf3981B00662D7C43C805Ce0ed65B521893B9C3e6
// open price: 12300000000000000
