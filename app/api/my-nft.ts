export const dynamic = 'force-static'
 
export async function getMyNFTList(account :string, nftAddress: string) {
  
  const params = new URLSearchParams({offset: '0', limit: '50', contract: nftAddress, sort: 'DESC'});
  const res = await fetch(`https://api.testnet.teloscan.io/v1/account/${account}/nfts?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',

  })
  if (!res.ok) {
      console.error(res)
  }
  const data = await res.json()
  
  console.log(data.results);
  return data.results;
  

}


export async function getMyOrderList() {

  // todo
  const res = await fetch('http://127.0.0.1:8080', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
      console.error(res)
  }
  const data = await res.json()
  
  console.log(data.results);
  return data.results;
  

}



