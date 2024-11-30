"use client";
import React, { useEffect, useState } from "react";
import { Image, Button, Modal, Form, Input } from "antd";
import { usePathname } from "next/navigation";
import { list, nftAddress, purchase, revoke, updateAmount, updatePrice } from "../contract/contract";
import { formatEther, parseEther } from "viem";
import { Address } from "@ant-design/web3";
import { DEFAULT_TOKEN } from "../util/common";

const btnCss = { width: "100%", height: 40, borderRadius: 8, backgroundColor: "rgba(0, 0, 0, 0.06)" };
const smallDescCss = { marginBottom: 16, fontSize: 16, color: "rgba(0, 0, 0, 0.65)" };

const ownedNFTPathname = "/home/owned-nft";
const listedNFTPathname = "/home/listed-nft";
const nftMarketPathname = "/home/nft-market";

const MyNFTCard = ({
  tokenId,
  metadataUrl,
  price,
  amount,
  orderId = BigInt(0),
  seller = "",
}: {
  tokenId: bigint;
  metadataUrl: string;
  price: bigint;
  amount: number;
  orderId?: bigint;
  seller?: string;
}) => {
  const pathname = usePathname();
  const [modelTitle, setModelTitle] = useState("");
  const [updateBtn, setUpdateBtn] = useState("");
  const [dataInState] = useState({ tokenId, orderId, price, amount });
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<metadataType>({
    name: "",
    image: "",
    properties: { type: "", parent: 0, level: "" },
  });
  useEffect(() => {
    const fetchData = () => {
      parseIpfsMetadata(metadataUrl)
        .then((data) => {
          setMetadata(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchData();
  }, [parseIpfsMetadata]);

  const { name, image, properties } = metadata;

  const isUpdatePrice = pathname === listedNFTPathname && updateBtn === "price";
  const isUpdateAmount = pathname === listedNFTPathname && updateBtn === "amount";
  const isOwnedNFTPathname = pathname === ownedNFTPathname;
  const isListedNFTPathname = pathname === listedNFTPathname;
  const isNftMarketPathname = pathname === nftMarketPathname;

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
          <Image style={{ borderRadius: 16 }} alt="nft" width={250} height={250} src={image}></Image>
          <div style={{ marginBottom: 16, marginTop: 16, fontSize: 24, fontWeight: 500 }}>
            #{" "}
            <a href={replaceIpfsUrl(metadataUrl)} style={{ color: "red" }}>
              {tokenId}
            </a>
          </div>
          <div style={{ marginBottom: 16, marginTop: 16, fontSize: 24, fontWeight: 500 }}>{name}</div>
          <div style={smallDescCss}>
            description: {` type ${properties?.type},   `}
            {properties?.type === "card" ? "" : `fragment of ID ${properties?.parent},`}
            {`level: ${properties?.level}`}
          </div>

          {pathname === nftMarketPathname && (
            <>
              <div style={smallDescCss}>
                seller:
                <Address
                  ellipsis={{
                    headClip: 8,
                    tailClip: 6,
                  }}
                  copyable
                  address={seller}
                />
              </div>
              <div style={smallDescCss}>orderId: {orderId}</div>
            </>
          )}

          <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>
            amount: <span style={{ color: "red" }}>{amount}</span>
          </div>
          {price && price > 0 ? (
            <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>
              price: {` ${formatEther(price)} ${DEFAULT_TOKEN}`}
            </div>
          ) : (
            <></>
          )}

          <div style={{ marginTop: 24 }}>
            {pathname === nftMarketPathname && (
              <Button
                style={btnCss}
                onClick={() => {
                  setModelTitle("Input Amount");
                  setOpen(true);
                }}
              >
                Buy Now
              </Button>
            )}
            {isListedNFTPathname && (
              <Button
                style={btnCss}
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  revoke({ orderId: dataInState.orderId })
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((err) => {
                      alert(err);
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
              >
                Cancel
              </Button>
            )}
            {isListedNFTPathname && (
              <Button
                style={btnCss}
                onClick={() => {
                  setModelTitle("Update Price");
                  setUpdateBtn("price");
                  setOpen(true);
                }}
              >
                Update Price
              </Button>
            )}
            {isListedNFTPathname && (
              <Button
                style={btnCss}
                onClick={() => {
                  setModelTitle("Update Amount");
                  setUpdateBtn("amount");
                  setOpen(true);
                }}
              >
                Update Amount
              </Button>
            )}
            {isOwnedNFTPathname && (
              <Button
                style={btnCss}
                onClick={() => {
                  setModelTitle("List NFT");
                  setOpen(true);
                }}
              >
                List
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        title={modelTitle}
        open={open}
        onOk={async () => {
          const values = form.getFieldsValue(true);
          console.log(`price ${values.price}, amount ${values.amount}, tokenId ${dataInState.tokenId}`);
          form.validateFields().then(() => {
            setConfirmLoading(true);
            if (isOwnedNFTPathname) {
              list({
                nftAddr: nftAddress,
                tokenId: BigInt(dataInState.tokenId),
                price: values.price,
                amount: values.amount,
              })
                .then((res) => {
                  console.log(res);
                })
                .catch((error) => {
                  console.error(error);
                  alert(error);
                })
                .finally(() => {
                  setConfirmLoading(false);
                  setOpen(false);
                });
            } else if (isUpdatePrice) {
              updatePrice({ orderId: BigInt(dataInState.orderId), newPrice: BigInt(values.price) })
                .then((res) => {
                  console.log(res);
                })
                .catch((error) => {
                  console.error(error);
                  alert(error);
                })
                .finally(() => {
                  setConfirmLoading(false);
                  setOpen(false);
                });
            } else if (isUpdateAmount) {
              updateAmount({ orderId: BigInt(dataInState.orderId), newAmount: BigInt(values.amount) })
                .then((res) => {
                  console.log(res);
                })
                .catch((error) => {
                  console.error(error);
                  alert(error);
                })
                .finally(() => {
                  setConfirmLoading(false);
                  setOpen(false);
                });
            } else if (isNftMarketPathname) {
              console.log(
                `---- order id ${dataInState.orderId}  token id ${dataInState.tokenId} amount ${values.amount}`
              );
              const value = BigInt(values.amount * price);

              purchase(value, { orderId: BigInt(dataInState.orderId), amount: BigInt(amount) })
                .then((res) => {
                  console.log(res);
                })
                .catch((error) => {
                  console.error(error);
                  alert(error);
                })
                .finally(() => {
                  setConfirmLoading(false);
                  setOpen(false);
                });
            }
          });
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <p>tokenId: {dataInState.tokenId}</p>
        {pathname === ownedNFTPathname && (
          <Form form={form} layout="vertical">
            <Form.Item name="price" label="price(wei)" rules={[{ required: true, min: 1 }]}>
              <Input />
            </Form.Item>
            <Form.Item name="amount" label="amount" rules={[{ required: true, min: 1 }]}>
              <Input />
            </Form.Item>
          </Form>
        )}
        {isUpdatePrice && (
          <Form form={form} layout="vertical">
            <Form.Item name="price" label="price(wei)" rules={[{ required: true, min: 1 }]}>
              <Input />
            </Form.Item>
          </Form>
        )}
        {isUpdateAmount && (
          <Form form={form} layout="vertical">
            <Form.Item name="amount" label="amount" rules={[{ required: true, min: 1 }]}>
              <Input />
            </Form.Item>
          </Form>
        )}
        {isNftMarketPathname && (
          <Form form={form} layout="vertical">
            <Form.Item name="amount" label="amount" rules={[{ required: true, min: 1 }]}>
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
type metadataType = { name: string; image: string; properties: { type: string; parent: number; level: string } };
export async function parseIpfsMetadata(metadataUrl: string): Promise<metadataType> {
  const url = metadataUrl;
  console.log(url);
  const metadata = { image: "", name: "", properties: { type: "", parent: 0, level: "" } };
  const replacedUrl = replaceIpfsUrl(url);
  let image = "";
  fetch(replacedUrl)
    .then((response) => response.json())
    .then((data) => {
      image = replaceIpfsUrl(data.image);
      console.log(image);
      metadata.image = image;
      metadata.name = data?.name;
      metadata.properties = data?.properties;
      // return {
      //   image: image,
      //   name: data?.name,
      //   properties: { type: data?.properties?.type, parent: data?.properties?.parent, level: data?.properties?.level },
      // };
    })
    .catch((error) => {
      console.error(error);
      return metadata;
    });

  return metadata;
}

export function replaceIpfsUrl(url: string) {
  return url?.replace("ipfs://", "https://given-amaranth-platypus.myfilebase.com/ipfs/");
}

export default MyNFTCard;

// {"name":"Card 1","image":"ipfs://QmcBbmi6bR8sVvrYMRond1bRFiNsntCW3z7qndJheLhxMA/1.png","properties":{"type":"card","parent":1,"level":"high"}}
