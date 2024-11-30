"use client";
import React from "react";
import { Breadcrumb, Flex, Layout, Menu, theme } from "antd";

import Link from "next/link";
import MyConnectButton from "../ui/my-connect-button";

const { Header, Content, Footer } = Layout;

const items = [
  { label: "NFT Market", href: "/home/nft-market" },
  { label: "Listed NFT", href: "/home/listed-nft" },
  { label: "Blind Box", href: "/home/blind-box" },
  { label: "Combine", href: "/home/combine" },
  { label: "Owned NFT", href: "/home/owned-nft" },
];

export default function nftLayout({ children }: { children: React.ReactNode }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center", background: colorBgContainer }}>
        {/* <div className="demo-logo" /> */}
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["0"]}
          // items={items}
          style={{ flex: 1, minWidth: 0 }}
        >
          {items.map((item, index) => (
            <Menu.Item key={index} style={{ width: 130, textAlign: "center" }}>
              <Link href={item.href} passHref>
                {item.label}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
        <div style={{ position: "absolute", right: 50, top: 0 }}>
        <MyConnectButton />
      </div>
      </Header>
      
      <Content style={{ padding: "0 48px" }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Blind Box ©{new Date().getFullYear()} Created by <a href="https://github.com/pandajc">pandajc</a>
      </Footer>
    </Layout>
  );
}
