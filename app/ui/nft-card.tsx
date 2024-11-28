import React from "react";
import { Image, Button } from "antd";

const MyNFTCard = async ({
  tokenId,
  name,
  description,
  metadataUrl,
  price,
  amount,
}: {
  tokenId: number;
  name: string;
  description: string;
  metadataUrl: string;
  price: string;
  amount: number;
}) => {
  const imageSrc = await parseIpfsMetadata(metadataUrl);
  return (
    <>
      <div
        style={{
          width: 282,
          backgroundColor: "#fff",
          borderRadius: 16,
          border: "1px solid #d9d9d9",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 16 }}>
          <Image
            style={{ borderRadius: 16 }}
            alt="nft"
            width={250}
            height={250}
            // src="https://api.our-metaverse.xyz/ourms/6_pnghash_0cecc6d080015b34f60bdd253081f36e277ce20ceaf7a6340de3b06d2defad6a_26958469.webp"
            src={imageSrc}
          ></Image>
          <div style={{ marginBottom: 16, marginTop: 16, fontSize: 24, fontWeight: 500 }}>ID {tokenId}</div>
          <div style={{ marginBottom: 16, marginTop: 16, fontSize: 24, fontWeight: 500 }}>My NFT {name}</div>
          <div style={{ marginBottom: 16, fontSize: 16, color: "rgba(0, 0, 0, 0.65)" }}>description xxxx  {description}</div>
          <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>amount 5 {amount}</div>
          <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>1.23 ETH {price}</div>
          <div style={{ marginTop: 24 }}>
            <Button style={{ width: "100%", height: 40, borderRadius: 8, backgroundColor: "rgba(0, 0, 0, 0.06)" }}>
              Buy Now
            </Button>
            <Button style={{ width: "100%", height: 40, borderRadius: 8, backgroundColor: "rgba(0, 0, 0, 0.06)" }}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export async function parseIpfsMetadata(metadataUrl: string)  {
  const url = metadataUrl;
  console.log(url);
  
const replacedUrl = replaceIpfsUrl(url);
let image = "";
await fetch(replacedUrl)
  .then(response => response.json())
  .then(data => {
    image = replaceIpfsUrl(data.image);
    console.log(image);
  })
  .catch(error => console.error(error));
  return image;
}

export function replaceIpfsUrl(url: string) {
  return url.replace('ipfs://', 'https://given-amaranth-platypus.myfilebase.com/ipfs/');
}


export default MyNFTCard;

