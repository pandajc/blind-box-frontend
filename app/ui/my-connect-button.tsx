"use client";

import { useState, useEffect } from "react";

import { formatEther, getAddress } from "viem";
import Image from "next/image";
import { newWindowWalletClient, publicClient } from "../contract/contract";
import { Address } from "@ant-design/web3";

export default function MyConnectButton() {
  // State variables to store the wallet address and balance
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const fetchData = () => {
    newWindowWalletClient()
      .then((walletClient) => {
        if (walletClient) {
          setAddress(walletClient.account.address);
          return walletClient.account.address;
        }
        return "";
      })
      .then((addr) => {
        if (!addr) {
          return;
        }
        publicClient
          .getBalance({ address: getAddress(addr) })
          .then((balance) => {
            setBalance(formatEther(balance));
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [newWindowWalletClient]);

  // Function to handle the button click event
  async function handleClick() {
    fetchData();
  }

  return (
    <>
      {/* Render the Status component with the address and balance */}
      <Status address={address} balance={balance} />

      {/* Render the Connect Wallet button */}
      <button
        className="px-8 py-2 rounded-md  flex flex-row items-center justify-center border border-[#1e2124] hover:border hover:border-indigo-600 shadow-md shadow-indigo-500/10"
        onClick={handleClick}
      >
        {/* Display the MetaMask Fox image */}
        {address ? (
          <>
            <div className="border bg-green-500 border-green-500 rounded-full w-1.5 h-1.5 mr-2"></div>
            <Address
              ellipsis={{
                headClip: 8,
                tailClip: 6,
              }}
              copyable
              address={address}
            />
          </>
        ) : (
          <>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              alt="MetaMask Fox"
              width={25}
              height={25}
            />
            <h1 className="mx-auto">Connect Wallet</h1>
          </>
        )}
      </button>
    </>
  );
}

// Component to display the wallet status (connected or disconnected)
function Status({ address, balance }: { address: string | null; balance: string }) {
  if (!address) {
    // If no address is provided, display "Disconnected" status
    return (
      <div className="flex items-center">
        <div className="border bg-red-600 border-red-600 rounded-full w-1.5 h-1.5 mr-2"></div>
        <div>Disconnected</div>
      </div>
    );
  }

  // If an address is provided, display the address and balance
  return (
    <div className="flex items-center w-full">
      <div className="text-xs md:text-xs">Balance: {balance}</div>
    </div>
  );
}
