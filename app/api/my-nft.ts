export const dynamic = 'force-static'
 
export async function getMyNFTList() {
  const res = await fetch('https://api.testnet.teloscan.io/v1/account/0x186b4735E114d2666Ea2CAD0Ec3B30ac7b386447/nfts', {
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



