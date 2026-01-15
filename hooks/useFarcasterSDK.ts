'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export function useFarcasterSDK() {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize the SDK context
        const sdkContext = await sdk.context;
        setContext(sdkContext);
        console.log('Farcaster SDK Context:', sdkContext);
      } catch (error) {
        console.error('Failed to load Farcaster SDK context:', error);
      } finally {
        // CRITICAL: Always call ready() to remove splash screen
        // This must be called regardless of success or failure
        try {
          await sdk.actions.ready();
          setIsSDKReady(true);
          console.log('Farcaster SDK ready() called successfully');
        } catch (readyError) {
          console.error('Failed to call sdk.actions.ready():', readyError);
          // Even if ready() fails, mark as ready to prevent infinite loading
          setIsSDKReady(true);
        }
      }
    };

    initialize();
  }, []);

  return { isSDKReady, context };
}
