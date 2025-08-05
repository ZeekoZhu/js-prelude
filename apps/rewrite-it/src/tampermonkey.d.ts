declare const GM_registerMenuCommand: (
  name: string,
  callback: () => void,
  accessKey?: string,
) => void | number;

declare const GM_unregisterMenuCommand: (id: void | number) => void;

declare const GM_setValue: <T>(key: string, value: T) => void;
declare const GM_getValue: <T>(key: string, defaultValue?: T) => T;
declare const GM_deleteValue: (key: string) => void;
declare const GM_listValues: () => string[];

declare const GM_openInTab: (
  url: string,
  options?: { active?: boolean; insert?: boolean; setParent?: boolean },
) => void | object;

declare const GM_xmlhttpRequest: (details: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  data?: string;
  onload?: (response: {
    responseText: string;
    status: number;
    statusText: string;
    responseHeaders: string;
  }) => void;
  onerror?: (error: Error) => void;
}) => void;

declare const GM_addStyle: (css: string) => void;

declare const GM_notification: (
  text: string,
  title?: string,
  image?: string,
  onclick?: () => void,
) => void;
