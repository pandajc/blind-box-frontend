export const dynamic = "force-static";

export async function getMyNFTList(account: string, nftAddress: string): Promise<any[]> {
  const params = new URLSearchParams({ offset: "0", limit: "50", contract: nftAddress, sort: "DESC" , type: "erc1155"});
  const res = await fetch(`https://api.testnet.teloscan.io/v1/account/${account}/nfts?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  if (!res.ok) {
    console.error(res);
  }
  const data = await res.json();

  console.log(data.results);
  return data.results;
}

export async function getOrderList(
  nftAddr: string,
  seller: string = "",
  nftType: number = 0,
  maxCardTokenId: number = 0
) {
  const params = new URLSearchParams({
    offset: "0",
    limit: "50",
    nftAddr: nftAddr,
    seller: seller,
    nftType: nftType.toString(),
    maxCardTokenId: maxCardTokenId.toString(),
  });
  const res = await fetch(`http://127.0.0.1:8080/blindBox/orderList?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    console.error(res);
  }
  const respData = await res.json();
  if (respData["code"] != 0) {
    console.error(`response code ${respData["code"]}, msg: ${respData["msg"]}`);
    return [];
  }

  return respData.data;
}
