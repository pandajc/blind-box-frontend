"use client";
import { blindBoxContractAddress, openBox } from "@/app/contract/contract";
import { replaceIpfsUrl } from "@/app/ui/nft-card";
import SimpleNFT from "@/app/ui/simple-nft";
import { Button, Image, Flex } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { text } from "stream/consumers";
import { parseUnits } from "viem/utils";
import "viem/window";

// todo query token uri by address
const nftAddr = "0xf3981B00662D7C43C805Ce0ed65B521893B9C3e6";
// 10 个
const value = parseUnits("0.123", 18);
const OpenBoxComponent: React.FC = () => {
  const [loading, setLoading] = useState<number>(0);
  const [res, setRes] = useState<readonly bigint[]>([]);

  return (
    <>
      <Button
        style={{ width: "100%", height: 40, borderRadius: 8, backgroundColor: "rgba(0, 0, 0, 0.06)" }}
        onClick={async () => {
          setLoading(1);
          openBox(value, { nftAddr: nftAddr, count: 10n })
            .then((res) => {
              console.log(res);
              setLoading(2);
              setRes(res);
            })
            .catch((err) => {
              console.error(err);
              alert(err);
              setLoading(0);
            });
        }}
        loading={loading === 1}
      >
        OpenBox
      </Button>
      <div style={{ height: 50 }}></div>
      <Content style={{ padding: "0 50px" }}>
        {loading === 2 && (
          <>
            <Flex justify="center">
              <div style={{ fontSize: 50, textAlign: "center" }}>Got NFT</div>
            </Flex>
            <Flex justify="center" wrap gap="small">
              {res.map((tokenId: bigint, index: number) => (
                <SimpleNFT tokenId={tokenId} />
              ))}
            </Flex>
          </>
        )}
      </Content>
    </>
  );
};

export default OpenBoxComponent;
