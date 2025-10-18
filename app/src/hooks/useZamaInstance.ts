import { useEffect, useState } from 'react';
import { createInstance, initSDK, SepoliaConfig, type FhevmInstanceConfig } from '@zama-fhe/relayer-sdk/bundle';

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initZama = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initSDK();

        const config: FhevmInstanceConfig = { ...SepoliaConfig };
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          config.network = (window as any).ethereum;
        }

        const zamaInstance = await createInstance(config);

        if (mounted) {
          setInstance(zamaInstance);
        }
      } catch (err) {
        console.error('Failed to initialize Zama instance:', err);
        if (mounted) {
          const message = err instanceof Error ? err.message : 'Failed to initialize encryption service';
          setError(message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initZama();

    return () => {
      mounted = false;
    };
  }, []);

  return { instance, isLoading, error };
}
