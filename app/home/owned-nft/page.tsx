import React from "react";
import { Button, Flex } from "antd";
import { NFTCard } from "@ant-design/web3";
import { Space } from "antd";
import MyNFTCard from "@/app/ui/nft-card";
import { getMyNFTList } from "@/app/api/my-nft";
import { getOrder } from "@/app/contract/contract";

const NFTList: React.FC = async () => {
  const nftList = await getMyNFTList();
  const order1 = await  getOrder(1);
  console.log(order1);
  
  return (
    <Flex wrap gap="small">
      {nftList.map((element: any, index: number) => (
        <MyNFTCard
        tokenId={element.tokenId}
          key={index}
          name={element.name}
          description={element.description}
          metadataUrl={element.tokenUri}
          price={element.price}
          amount={element.amount}
        />
      ))}
    </Flex>
  );
};

export default NFTList;
