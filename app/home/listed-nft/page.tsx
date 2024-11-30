"use client";
import { newWindowWalletClient } from "@/app/contract/contract";
import NFTList from "../nft-market/page";
import { useEffect, useState } from "react";

const ListedNFTList = () => {
  const [account, setAccount] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const walletClient = await newWindowWalletClient();
      if (walletClient) {
        setAccount(walletClient.account.address);
      }
    };
    fetchData();
  }, [newWindowWalletClient]);
  return (
    <>
      
      {account.length > 0 ? <NFTList seller={account}></NFTList> : <></>}
    </>
  );
};

export default ListedNFTList;
