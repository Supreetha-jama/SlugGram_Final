import { getSignature, getEventHash, type UnsignedEvent, type Event } from 'nostr-tools';
import { hashContent } from './crypto';

// Kind 20: Picture event (NIP-68)
export const KIND_PICTURE = 20;

export interface PictureEvent extends Event {
  kind: typeof KIND_PICTURE;
}

export function createPictureEvent(
  privateKey: string,
  imageUrl: string,
  caption: string,
  pubkey: string
): PictureEvent {
  const unsignedEvent: UnsignedEvent = {
    kind: KIND_PICTURE,
    pubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ['url', imageUrl],
      ['m', 'image/jpeg'],
      ['dim', '1080x1080'],
    ],
    content: caption,
  };

  const id = getEventHash(unsignedEvent);
  const sig = getSignature(unsignedEvent, privateKey);

  return {
    ...unsignedEvent,
    id,
    sig,
  } as PictureEvent;
}

// NIP-98 HTTP Auth
export function createNip98AuthEvent(
  privateKey: string,
  pubkey: string,
  url: string,
  method: string,
  bodyHash?: string
): Event {
  const tags: string[][] = [
    ['u', url],
    ['method', method],
  ];

  if (bodyHash) {
    tags.push(['payload', bodyHash]);
  }

  const unsignedEvent: UnsignedEvent = {
    kind: 27235,
    pubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    content: '',
  };

  const id = getEventHash(unsignedEvent);
  const sig = getSignature(unsignedEvent, privateKey);

  return {
    ...unsignedEvent,
    id,
    sig,
  };
}

export function encodeNip98Auth(event: Event): string {
  return btoa(JSON.stringify(event));
}
