import { createSignal, onMount, onCleanup } from "solid-js";

type ZoomableImageProps = {
  src: string;
  alt: string;
  class?: string;
  width?: string | number;
  height?: string | number;
};

const ZoomableImage = (props: ZoomableImageProps) => {
  let imageRef: HTMLImageElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  // Zoom state
  const [isZooming, setIsZooming] = createSignal(false);
  const [isScrollZooming, setIsScrollZooming] = createSignal(false);
  const [currentScale, setCurrentScale] = createSignal(1);
  const [panX, setPanX] = createSignal(0);
  const [panY, setPanY] = createSignal(0);

  // Pinch-to-zoom state
  let initialDistance = 0;
  let initialScale = 1;
  let zoomCenterX = 0;
  let zoomCenterY = 0;

  // Scroll-to-zoom state
  let scrollZoomTimeout: number;

  /**
   * Calculate distance between two touch points
   */
  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * Calculate center point between two touches
   */
  const getCenter = (touch1: Touch, touch2: Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  /**
   * Reset the image's position and scale
   */
  const resetImage = () => {
    if (!imageRef) return;
    
    setCurrentScale(1);
    setPanX(0);
    setPanY(0);
    setIsZooming(false);
    setIsScrollZooming(false);
    
    if (scrollZoomTimeout) {
      window.clearTimeout(scrollZoomTimeout);
    }
    
    imageRef.style.transform = "translateX(0px) translateY(0px) scale(1)";
  };

  /**
   * Handle wheel events for scroll-to-zoom
   */
  const handleWheel = (e: WheelEvent) => {
    if (!imageRef || !containerRef) return;

    // Always prevent default scroll behavior when over the image
    e.preventDefault();
    e.stopPropagation();

    // Only allow zoom if not currently pinch-zooming
    if (isZooming()) return;

    const deltaY = e.deltaY;
    const zoomFactor = 0.1; // How much to zoom per scroll step
    const newScale = currentScale() + (deltaY > 0 ? -zoomFactor : zoomFactor);
    
    // Limit zoom between 0.5x and 3x
    const clampedScale = Math.max(0.5, Math.min(3, newScale));
    
    if (clampedScale !== currentScale()) {
      setCurrentScale(clampedScale);
      setIsScrollZooming(true);
      
      // Calculate zoom center based on mouse position relative to image
      const rect = containerRef.getBoundingClientRect();
      const centerX = e.clientX - rect.left - rect.width / 2;
      const centerY = e.clientY - rect.top - rect.height / 2;
      
      // Adjust pan to keep zoom centered on mouse position
      const scaleDiff = clampedScale - 1;
      setPanX(centerX * scaleDiff);
      setPanY(centerY * scaleDiff);
      
      // Apply zoom transform
      imageRef.style.transform = `translateX(${panX()}px) translateY(${panY()}px) scale(${clampedScale})`;
      
      // Clear any existing timeout
      if (scrollZoomTimeout) {
        window.clearTimeout(scrollZoomTimeout);
      }
      
      // Set timeout to disable scroll zooming after a brief delay
      scrollZoomTimeout = window.setTimeout(() => {
        setIsScrollZooming(false);
      }, 150);
    }
  };

  /**
   * Handle touch start for pinch-to-zoom
   */
  const handleTouchStart = (e: TouchEvent) => {
    e.stopPropagation(); // Don't interfere with SwipeableCard

    // Handle multi-touch (pinch-to-zoom)
    if (e.touches.length === 2) {
      setIsZooming(true);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      initialDistance = getDistance(touch1, touch2);
      initialScale = currentScale();
      
      const center = getCenter(touch1, touch2);
      zoomCenterX = center.x;
      zoomCenterY = center.y;
      
      return;
    }

    // Handle single touch - let SwipeableCard handle it
    if (e.touches.length === 1) {
      setIsZooming(false);
    }
  };

  /**
   * Handle touch move for pinch-to-zoom
   */
  const handleTouchMove = (e: TouchEvent) => {
    if (!imageRef) return;

    // Handle pinch-to-zoom
    if (e.touches.length === 2 && isZooming()) {
      e.preventDefault();
      e.stopPropagation();
      
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const currentDistance = getDistance(touch1, touch2);
      const scale = (currentDistance / initialDistance) * initialScale;
      
      // Limit zoom between 0.5x and 3x
      const clampedScale = Math.max(0.5, Math.min(3, scale));
      setCurrentScale(clampedScale);
      
      // Calculate pan offset to keep zoom centered
      const center = getCenter(touch1, touch2);
      const deltaX = center.x - zoomCenterX;
      const deltaY = center.y - zoomCenterY;
      
      setPanX(prev => prev + deltaX);
      setPanY(prev => prev + deltaY);
      
      // Apply zoom and pan transforms
      imageRef.style.transform = `translateX(${panX()}px) translateY(${panY()}px) scale(${clampedScale})`;
      
      return;
    }

    // For single touch, let SwipeableCard handle it
    if (e.touches.length === 1 && !isZooming()) {
      // Don't prevent default or stop propagation for single touch
      return;
    }
  };

  /**
   * Handle touch end for pinch-to-zoom
   */
  const handleTouchEnd = (e: TouchEvent) => {
    // Handle zoom end - if we were zooming and now have fewer than 2 touches
    if (isZooming() && e.touches.length < 2) {
      setIsZooming(false);
      // Keep the current zoom state, don't reset
      return;
    }

    // For single touch end, let SwipeableCard handle it
    if (e.touches.length === 0 && !isZooming()) {
      return;
    }
  };

  // Set up wheel event listener
  onMount(() => {
    if (containerRef) {
      containerRef.addEventListener('wheel', handleWheel, { passive: false });
    }
  });

  onCleanup(() => {
    if (containerRef) {
      containerRef.removeEventListener('wheel', handleWheel);
    }
    if (scrollZoomTimeout) {
      window.clearTimeout(scrollZoomTimeout);
    }
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        ref={imageRef}
        src={props.src}
        alt={props.alt}
        class={props.class}
        width={props.width}
        height={props.height}
        style={{
          "max-height": "95%",
          "max-width": "95%",
          "object-fit": "contain",
          "user-select": "none",
          "pointer-events": "none",
          "transform-origin": "center center",
          transition: isZooming() || isScrollZooming() ? "none" : "opacity 100ms",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
};

export default ZoomableImage;
