import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from './config/wagmi';
import { GameDashboard } from './components/GameDashboard';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en">
          <div className="app-shell">
            <header className="app-header">
              <div>
                <h1>Encrypted Mafia</h1>
                <p>Coordinate hidden roles securely on-chain.</p>
              </div>
              <ConnectButton chainStatus="none" showBalance={false} />
            </header>
            <main className="app-main">
              <GameDashboard />
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
