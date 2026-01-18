import { useState, useEffect } from 'react';
import type { Event } from 'nostr-tools';
import { KIND_PICTURE } from '../lib/nostr';

const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
];

export function useNostrFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sockets: WebSocket[] = [];
    const receivedIds = new Set<string>();

    function connectToRelay(url: string) {
      try {
        const ws = new WebSocket(url);

        ws.onopen = () => {
          console.log(`Connected to ${url}`);
          // Subscribe to Kind 20 (picture) events
          const subId = Math.random().toString(36).substring(7);
          const req = JSON.stringify([
            'REQ',
            subId,
            {
              kinds: [KIND_PICTURE],
              limit: 50,
            },
          ]);
          ws.send(req);
        };

        ws.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data);
            if (data[0] === 'EVENT' && data[2]) {
              const event = data[2] as Event;
              if (!receivedIds.has(event.id)) {
                receivedIds.add(event.id);
                setEvents((prev) => {
                  const updated = [...prev, event];
                  // Sort by created_at descending
                  updated.sort((a, b) => b.created_at - a.created_at);
                  return updated;
                });
              }
            } else if (data[0] === 'EOSE') {
              setIsLoading(false);
            }
          } catch (e) {
            console.error('Failed to parse message:', e);
          }
        };

        ws.onerror = (err) => {
          console.error(`WebSocket error for ${url}:`, err);
        };

        ws.onclose = () => {
          console.log(`Disconnected from ${url}`);
        };

        sockets.push(ws);
      } catch (e) {
        console.error(`Failed to connect to ${url}:`, e);
      }
    }

    // Connect to all relays
    RELAYS.forEach(connectToRelay);

    // Set a timeout to stop loading state if no EOSE is received
    const timeout = setTimeout(() => {
      setIsLoading(false);
      if (events.length === 0) {
        setError('No events found. The relays might be slow or have no content.');
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      sockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    };
  }, []);

  return { events, isLoading, error };
}
