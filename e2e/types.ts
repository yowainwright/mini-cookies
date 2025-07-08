declare global {
  interface Window {
    miniCookies: any;
    testResults: {
      setCookie?: boolean;
      getCookie?: string;
      removeCookie?: boolean;
      setStateCookie?: boolean;
      reviewState?: any;
      clearState?: any;
      setWithAttrs?: boolean;
      testDebug?: {
        value: string;
        debugOutput: string;
      };
    };
    pageReady?: boolean;
  }
}

export {};
