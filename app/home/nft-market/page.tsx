"use client";
import React, { useEffect, useState } from "react";
import { Button, Flex } from "antd";
import { NFTCard } from "@ant-design/web3";
import { Space } from "antd";
import MyNFTCard from "@/app/ui/nft-card";
import { getOrderList } from "@/app/api/my-nft";
import { getOrder, nftAddress, uri } from "@/app/contract/contract";
import { formatEther } from "viem";

const NFTList = ({ seller = "" }: { seller: string }) => {
  const [nftList, setNftList] = useState<any[]>([]);
  const [uriTemp, setUriTemp] = useState("");
  useEffect(() => {
    const fetchData = () => {
      uri(nftAddress, BigInt(1)).then((res) => {
        console.log(`uri: ${res}`);

        const baseUri = String(res).replace("1.json", "");
        console.log(`baseUri: ${baseUri}`);
        setUriTemp(baseUri);
        getOrderList(nftAddress, seller, 0, 0)
          .then((res) => {
            console.log(res);
            setNftList(res);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    };
    fetchData();
  }, [getOrderList]);

  return (
    <Flex wrap gap="small">
      {nftList.map((element: any, index: number) => (
        <MyNFTCard
          orderId={element.orderId}
          tokenId={element.tokenId}
          key={index}
          metadataUrl={`${uriTemp}${element.tokenId}.json`}
          price={element.price}
          amount={element.amount}
          seller={element.seller}
        />
      ))}
    </Flex>
  );
};

export default NFTList;
