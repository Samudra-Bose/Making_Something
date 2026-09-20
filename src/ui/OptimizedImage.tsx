import React from 'react';
import type { ImageAsset } from '../assets/images';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  asset: ImageAsset;
  /** Override object-position if needed in context */
  position?: string;
  /** Additional class names */
  className?: string;
}

/**
 * OptimizedImage — DRIFT asset wrapper.
 *
 * What it does vs a raw <img>:
 *  - Sets loading="eager" + fetchPriority="high" for priority assets
 *  - Sets loading="lazy" for non-priority assets (below-fold)
 *  - Applies intentional object-position from the asset definition
 *  - Decodes asynchronously to avoid main-thread paint block
 *
 * What it does NOT do:
 *  - Does not change scroll timelines
 *  - Does not replace existing GSAP class wiring (className is passed through)
 */
export default function OptimizedImage({
  asset,
  position,
  className = '',
  style = {},
  ...rest
}: OptimizedImageProps) {
  const objectPosition = position ?? asset.position;

  return (
    <img
      src={asset.url}
      alt={asset.alt}
      loading={asset.priority ? 'eager' : 'lazy'}
      fetchPriority={asset.priority ? 'high' : 'low'}
      decoding={asset.priority ? 'sync' : 'async'}
      className={className}
      style={{
        objectPosition,
        ...style,
      }}
      {...rest}
    />
  );
}
