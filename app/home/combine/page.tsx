"use client";
import { getMyNFTList } from "@/app/api/my-nft";
import { blindBoxContractAddress, combine, nftAddress, openBox, setApprovalTrueForAll } from "@/app/contract/contract";
import { replaceIpfsUrl } from "@/app/ui/nft-card";
import SimpleNFT from "@/app/ui/simple-nft";
import { Button, Image, Flex } from "antd";

import React from "react";
import { useEffect, useState } from "react";
import "viem/window";

// todo query token uri by address
const myAddress = "0x186b4735E114d2666Ea2CAD0Ec3B30ac7b386447";

const CombineComponent: React.FC = () => {
  const maxTokenId = 4;
  const fragmentsPerCard = 4;
  const [nftListMap, setNftListMap] = useState<any>({});

  useEffect(() => {
    const fetchData = () => {
      getMyNFTList(myAddress, nftAddress)
        .then((nftList) => {
          setNftListMap(Object.fromEntries(nftList.map((element: any, index: number) => [element.tokenId, element])));
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchData();
  }, [getMyNFTList]);
  console.log("reload..");
  return (
    <FragmentsMappingComponent maxTokenId={maxTokenId} fragmentsPerCard={fragmentsPerCard} nftListMap={nftListMap} />
  );
};

export default CombineComponent;

const FragmentsMappingComponent = ({
  maxTokenId,
  fragmentsPerCard,
  nftListMap,
}: {
  maxTokenId: number;
  fragmentsPerCard: number;
  nftListMap: any;
}) => {
  const [loading, setLoading] = useState<number>(0);
  const [selectedTokenId, setSelectedTokenId] = useState<number>(1);

  const handleSelectToken = (tokenId: number) => {
    setSelectedTokenId(tokenId);
  };

  const calculateFragmentsNeeded = (tokenId: number): number[] => {
    maxTokenId + tokenId * fragmentsPerCard;
    const arr = [];
    for (let i = 0; i < fragmentsPerCard; i++) {
      arr.push(tokenId * fragmentsPerCard + i + 1);
    }
    return arr;
  };

  return (
    <>
      <Flex gap={"small"} justify="space-around">
        <Flex vertical>
          <div style={{ fontSize: 50 }}>Select Card To Be Combined</div>
          <Flex>
            {Array.from({ length: maxTokenId }, (_, index) => (
              <div
                style={selectedTokenId === index + 1 ? { border: 10, borderStyle: "solid", color: "red" } : {}}
                onClick={() => handleSelectToken(index + 1)}
              >
                <SimpleNFT tokenId={BigInt(index + 1)} />
              </div>
            ))}
          </Flex>

          <Button
            style={{ width: "100%", height: 40, borderRadius: 8, backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            onClick={async () => {
              // nftListMap[selectedTokenId]
              let enough = true;
              calculateFragmentsNeeded(selectedTokenId).map((tokenId: any, index: number) => {
                if (!(nftListMap[tokenId]?.amount > 0)) {
                  enough = false;
                  alert("Not enough fragments to combine");
                  return;
                }
              });
              if (!enough) {
                return;
              }
              setLoading(1);
              setApprovalTrueForAll(blindBoxContractAddress)
                .then((res) => {
                  console.log(res);
                  combine({ nftAddr: nftAddress, tokenId: BigInt(selectedTokenId) })
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((err) => {
                      alert(err);
                    })
                    .finally(() => {
                      setLoading(0);
                    });
                })
                .catch((err) => console.error(err));
            }}
            loading={loading === 1}
          >
            Combine
          </Button>
        </Flex>
        <Flex vertical>
          <div style={{ fontSize: 50 }}>Fragments Needed</div>
          <Flex>
            {
              <React.Fragment>
                {calculateFragmentsNeeded(selectedTokenId).map((tokenId: any, index: number) => (
                  <Flex vertical>
                    <SimpleNFT tokenId={BigInt(tokenId)} />
                    <div>Amount: {nftListMap[tokenId]?.amount || 0}</div>
                  </Flex>
                ))}
              </React.Fragment>
            }
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
