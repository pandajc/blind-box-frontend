import { Image } from "antd";
import { replaceIpfsUrl } from "./nft-card";

export default function SimpleNFT({ tokenId }: { tokenId: bigint }) {
  return (
    <Image
      preview={false}
      style={{ borderRadius: 16 }}
      alt="nft"
      width={100}
      height={100}
      src={replaceIpfsUrl(`ipfs://QmcBbmi6bR8sVvrYMRond1bRFiNsntCW3z7qndJheLhxMA/${tokenId}.png`)}
    ></Image>
  );
}
