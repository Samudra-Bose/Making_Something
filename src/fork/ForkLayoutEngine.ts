import { World } from '../experience/store';

export interface SpatialState {
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  zIndex: number;
  scale: number;
  opacity: number;
}

export type ForkLayouts = Record<string, SpatialState>;

interface EngineProps {
  openForks: World[];
  activeFork: World | null;
  expandedFork: World | null;
  viewportWidth: number;
  viewportHeight: number;
}

export function computeForkLayout({
  openForks,
  activeFork,
  expandedFork,
  viewportWidth,
  viewportHeight
}: EngineProps): ForkLayouts {
  const layouts: ForkLayouts = {};
  
  const count = openForks.length;
  const isMobile = viewportWidth < 1024; // Simple breakpoint
  const gap = isMobile ? 16 : 24;
  const padding = isMobile ? 16 : 32;

  // Header/Nav compensation
  const topOffset = isMobile ? 80 : 100; 
  const bottomOffset = isMobile ? 80 : 40;

  const availableWidth = viewportWidth - padding * 2;
  const availableHeight = viewportHeight - topOffset - bottomOffset;

  // Base layout generation
  openForks.forEach((world, index) => {
    let state: SpatialState = {
      x: padding,
      y: topOffset,
      width: availableWidth,
      height: availableHeight,
      zIndex: activeFork === world ? 10 : 5,
      scale: 1,
      opacity: 1
    };

    if (expandedFork && expandedFork !== world) {
      // Background collapsed state for inactive windows when one is expanded
      state.opacity = 0;
      state.scale = 0.95;
      state.zIndex = 1;
      // Push it slightly outwards conceptually
      state.y = topOffset + availableHeight / 2;
    } else if (expandedFork === world) {
      // Expanded state
      state.x = padding;
      state.y = topOffset;
      state.width = availableWidth;
      state.height = availableHeight;
      state.zIndex = 20;
    } else if (isMobile) {
      // Mobile - stack like a deck of cards or just show active
      if (activeFork === world) {
        state.x = padding;
        state.y = topOffset;
        state.width = availableWidth;
        state.height = availableHeight;
        state.zIndex = 10;
      } else {
        // Hide inactive on mobile, but keep them mounted
        state.opacity = 0;
        state.scale = 0.95;
        state.zIndex = 1;
      }
    } else {
      // Desktop Spatial Layouts
      if (count === 1) {
        state.x = padding;
        state.y = topOffset;
        state.width = availableWidth;
        state.height = availableHeight;
      } else if (count === 2) {
        const activeIdx = openForks.indexOf(activeFork || openForks[0]);
        const isDominant = index === activeIdx;
        
        const domWidth = availableWidth * 0.6 - gap/2;
        const subWidth = availableWidth * 0.4 - gap/2;
        
        state.width = isDominant ? domWidth : subWidth;
        state.height = availableHeight;
        
        if (activeIdx === 0) {
          // left is dominant
          state.x = index === 0 ? padding : padding + domWidth + gap;
        } else {
          // right is dominant
          state.x = index === 0 ? padding : padding + subWidth + gap;
        }
        state.y = topOffset;
      } else if (count === 3) {
        // 1 dominant, 2 secondary (stacked on right)
        if (index === 0) {
          state.width = availableWidth * 0.6;
          state.height = availableHeight;
          state.x = padding;
          state.y = topOffset;
        } else {
          const rightWidth = availableWidth * 0.4 - gap;
          const halfHeight = (availableHeight - gap) / 2;
          state.width = rightWidth;
          state.height = halfHeight;
          state.x = padding + (availableWidth * 0.6) + gap;
          state.y = index === 1 ? topOffset : topOffset + halfHeight + gap;
        }
      } else if (count === 4) {
        // 2x2 grid physically
        const halfW = (availableWidth - gap) / 2;
        const halfH = (availableHeight - gap) / 2;
        state.width = halfW;
        state.height = halfH;
        state.x = padding + (index % 2) * (halfW + gap);
        state.y = topOffset + Math.floor(index / 2) * (halfH + gap);
      }
    }

    // Depth emphasis for active fork (when not fully expanded)
    if (!expandedFork && !isMobile && count > 1) {
      if (activeFork === world) {
        state.scale = 1.02;
        state.zIndex = 15;
      } else {
        state.scale = 0.98;
        state.opacity = 0.8;
      }
    }

    layouts[world] = state;
  });

  return layouts;
}
