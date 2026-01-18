import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { deriveKeyPair } from '../lib/crypto';

interface NostrContextType {
  publicKey: string | null;
  privateKey: string | null;
  isReady: boolean;
}

const NostrContext = createContext<NostrContextType>({
  publicKey: null,
  privateKey: null,
  isReady: false,
});

export function NostrProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth0();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initKeys() {
      if (isAuthenticated && user?.sub) {
        try {
          const keyPair = await deriveKeyPair(user.sub);
          setPublicKey(keyPair.publicKey);
          setPrivateKey(keyPair.privateKey);
          setIsReady(true);
        } catch (error) {
          console.error('Failed to derive key pair:', error);
        }
      } else {
        setPublicKey(null);
        setPrivateKey(null);
        setIsReady(false);
      }
    }
    initKeys();
  }, [isAuthenticated, user?.sub]);

  return (
    <NostrContext.Provider value={{ publicKey, privateKey, isReady }}>
      {children}
    </NostrContext.Provider>
  );
}

export function useNostr() {
  return useContext(NostrContext);
}
