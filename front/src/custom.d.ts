declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
declare module '*.webp';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
