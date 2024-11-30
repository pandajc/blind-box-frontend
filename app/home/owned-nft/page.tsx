"use client";
import React, { useEffect, useState } from "react";
import { Button, Flex } from "antd";
import { NFTCard } from "@ant-design/web3";
import { Space } from "antd";
import MyNFTCard from "@/app/ui/nft-card";
import { getMyNFTList } from "@/app/api/my-nft";
import { newWindowWalletClient, nftAddress } from "@/app/contract/contract";
import { WalletConnect } from "@ant-design/web3-wagmi";
import WalletButton from "@/app/ui/connector";

const NFTList: React.FC = () => {
  const [account, setAccount] = useState("");
  const [nftList, setNftList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      newWindowWalletClient()
        .then((walletClient) => {
          if (walletClient) {
            console.log(walletClient);
            const addr = walletClient.account.address;
            if (addr) {
              setAccount(addr);
              getMyNFTList(addr, nftAddress)
                .then((res) => {
                  setNftList(res);
                })
                .catch((error) => {
                  console.error(error);
                  alert(error);
                });
            }
          }
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        });
    };
    fetchData();
  }, [getMyNFTList, newWindowWalletClient]);

  return (
    <Flex wrap gap="small">
      {/* <WalletButton></WalletButton> */}
      {account.length > 0 &&
        nftList.length > 0 &&
        nftList.map((element: any, index: number) => (
          <MyNFTCard
            tokenId={element.tokenId}
            key={index}
            metadataUrl={element.tokenUri}
            price={element.price}
            amount={element.amount}
          />
        ))}
    </Flex>
  );
};

export default NFTList;
