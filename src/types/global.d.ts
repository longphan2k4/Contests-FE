// Global type declarations for the application

// Module declarations for file imports
declare module '*.svg' {
  import type React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.styl' {
  const classes: { [key: string]: string };
  export default classes;
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VITE_API_URL?: string;
    readonly VITE_SOCKET_URL?: string;
    readonly VITE_APP_TITLE?: string;
    readonly VITE_TINYMCE_API_KEY?: string;
    readonly VITE_ENV?: string;
  }
}

// Window object extensions
declare interface Window {
  // Add any window extensions here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tinymce?: any;
}

// Vite specific
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_TINYMCE_API_KEY: string;
  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
