export type GenLayerEnvironment = "studio" | "testnet" | "mainnet";

export type GenLayerClientConfig = {
  environment: GenLayerEnvironment;
  rpcUrl?: string;
  certificateIssuerAddress?: string;
};

export function createGenLayerConfig(config: GenLayerClientConfig): GenLayerClientConfig {
  return config;
}

export function isCertificateMintConfigured(config: GenLayerClientConfig): boolean {
  return Boolean(config.rpcUrl && config.certificateIssuerAddress);
}
