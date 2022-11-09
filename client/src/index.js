import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import App from './App';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli, chain.hardhat],
  [publicProvider()]
);

const wagmiClient = (name, autoConnect) => {
  const { connectors } = getDefaultWallets({ name, chains });
  return createClient({ autoConnect, connectors, provider });
};

const { name, autoConnect } = require('./config.json');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiConfig client={wagmiClient(name, autoConnect)}>
      <RainbowKitProvider chains={chains}>
        <App name={name} />
      </RainbowKitProvider>
    </WagmiConfig>
  </StrictMode>
);
