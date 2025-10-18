import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = 'projectId';

export const config = getDefaultConfig({
  appName: 'Encrypted Mafia',
  projectId,
  chains: [sepolia],
  ssr: false,
});
