interface GenLayerLogoProps {
  size?: number;
  className?: string;
}

export function GenLayerLogo({ size = 32, className }: GenLayerLogoProps) {
  return (
    <img
      src="/genlayer-logo.png"
      alt="GenLayer"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
