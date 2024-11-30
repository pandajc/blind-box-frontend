import { ConnectButton, Connector } from '@ant-design/web3';
import {
  Mainnet,
  MetaMask,
  OkxWallet,
  TokenPocket,
  WagmiWeb3ConfigProvider,
  WalletConnect,
} from '@ant-design/web3-wagmi';
import { QueryClient } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { http } from 'wagmi';
import { telosTestnet } from 'wagmi/chains';

const queryClient = new QueryClient();

const MyWeb3Provider = ({children}: {children: React.ReactNode}) => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      ens
      chains={[telosTestnet]}
      transports={{
        [telosTestnet.id]: http(),
      }}
      walletConnect={{
        projectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
      }}
      wallets={[
        MetaMask(),
        WalletConnect(),
        TokenPocket({
          group: 'Popular',
        }),
        OkxWallet(),
      ]}
      queryClient={queryClient}
    >
      <Connector
        modalProps={{
          mode: 'simple',
        }}
      >
        {/* <ConnectButton quickConnect /> */}
      </Connector>
        {children}
    </WagmiWeb3ConfigProvider>
  );
};

export default MyWeb3Provider;