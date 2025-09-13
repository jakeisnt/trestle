import { createSignal, onMount, onCleanup, createEffect, Show } from "solid-js";

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

  // Minimap state
  const [showMinimap, setShowMinimap] = createSignal(false);
  const [imageDimensions, setImageDimensions] = createSignal({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = createSignal({ width: 0, height: 0 });
  
  // Minimap drag state
  const [isDraggingMinimap, setIsDraggingMinimap] = createSignal(false);
  let minimapRef: HTMLDivElement | undefined;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartPanX = 0;
  let dragStartPanY = 0;

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
    setShowMinimap(false);
    
    if (scrollZoomTimeout) {
      window.clearTimeout(scrollZoomTimeout);
    }
    
    imageRef.style.transform = "translateX(0px) translateY(0px) scale(1)";
  };

  /**
   * Handle zoom in button click
   */
  const handleZoomIn = () => {
    if (!imageRef) return;
    
    const newScale = Math.min(3, currentScale() + 0.2);
    setCurrentScale(newScale);
    setIsScrollZooming(true);
    
    // Apply zoom transform
    imageRef.style.transform = `translateX(${panX()}px) translateY(${panY()}px) scale(${newScale})`;
    
    // Show minimap when zoomed
    if (newScale > 1) {
      setShowMinimap(true);
    }
    
    // Clear any existing timeout
    if (scrollZoomTimeout) {
      window.clearTimeout(scrollZoomTimeout);
    }
    
    // Set timeout to disable scroll zooming after a brief delay
    scrollZoomTimeout = window.setTimeout(() => {
      setIsScrollZooming(false);
    }, 150);
  };

  /**
   * Handle zoom out button click
   */
  const handleZoomOut = () => {
    if (!imageRef) return;
    
    const newScale = Math.max(0.5, currentScale() - 0.2);
    setCurrentScale(newScale);
    setIsScrollZooming(true);
    
    // Apply zoom transform
    imageRef.style.transform = `translateX(${panX()}px) translateY(${panY()}px) scale(${newScale})`;
    
    // Hide minimap when not zoomed
    if (newScale <= 1) {
      setShowMinimap(false);
    }
    
    // Clear any existing timeout
    if (scrollZoomTimeout) {
      window.clearTimeout(scrollZoomTimeout);
    }
    
    // Set timeout to disable scroll zooming after a brief delay
    scrollZoomTimeout = window.setTimeout(() => {
      setIsScrollZooming(false);
    }, 150);
  };

  /**
   * Update image and container dimensions for minimap
   */
  const updateDimensions = () => {
    if (imageRef && containerRef) {
      const imgRect = imageRef.getBoundingClientRect();
      const containerRect = containerRef.getBoundingClientRect();
      
      setImageDimensions({
        width: imgRect.width / currentScale(),
        height: imgRect.height / currentScale()
      });
      
      setContainerDimensions({
        width: containerRect.width,
        height: containerRect.height
      });
    }
  };

  /**
   * Handle minimap drag start
   */
  const handleMinimapDragStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDraggingMinimap(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartX = clientX;
    dragStartY = clientY;
    dragStartPanX = panX();
    dragStartPanY = panY();
  };

  /**
   * Handle minimap drag move
   */
  const handleMinimapDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDraggingMinimap() || !imageRef) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;
    
    // Convert minimap drag to image pan
    const minimapRect = minimapRef?.getBoundingClientRect();
    if (!minimapRect) return;
    
    const minimapWidth = minimapRect.width;
    const minimapHeight = minimapRect.height;
    
    // Calculate the scale factor between minimap and actual image
    const scaleX = (imageDimensions().width * currentScale()) / minimapWidth;
    const scaleY = (imageDimensions().height * currentScale()) / minimapHeight;
    
    // Update pan based on drag
    const newPanX = dragStartPanX + (deltaX * scaleX);
    const newPanY = dragStartPanY + (deltaY * scaleY);
    
    setPanX(newPanX);
    setPanY(newPanY);
    
    // Apply transform to main image
    imageRef.style.transform = `translateX(${newPanX}px) translateY(${newPanY}px) scale(${currentScale()})`;
  };

  /**
   * Handle minimap drag end
   */
  const handleMinimapDragEnd = () => {
    setIsDraggingMinimap(false);
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
      
      // Show minimap when zoomed
      if (clampedScale > 1) {
        setShowMinimap(true);
      } else {
        setShowMinimap(false);
      }
      
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
      
      // Update dimensions for minimap
      updateDimensions();
      
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
      
      // Show minimap when zoomed
      if (clampedScale > 1) {
        setShowMinimap(true);
      } else {
        setShowMinimap(false);
      }
      
      // Update dimensions for minimap
      updateDimensions();
      
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

  // Set up wheel event listener and image load handler
  onMount(() => {
    if (containerRef) {
      containerRef.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    if (imageRef) {
      imageRef.addEventListener('load', updateDimensions);
    }
    
    // Add global mouse/touch event listeners for minimap dragging
    const handleGlobalMouseMove = (e: MouseEvent) => handleMinimapDragMove(e);
    const handleGlobalMouseUp = () => handleMinimapDragEnd();
    const handleGlobalTouchMove = (e: TouchEvent) => handleMinimapDragMove(e);
    const handleGlobalTouchEnd = () => handleMinimapDragEnd();
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  });

  // Update dimensions when scale or pan changes
  createEffect(() => {
    if (currentScale() > 1) {
      updateDimensions();
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
      
      {/* Minimap and Zoom Controls */}
      <Show when={showMinimap()}>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            gap: "10px",
            "z-index": 10,
          }}
        >
          {/* Minimap */}
          <div
            style={{
              width: "120px",
              height: "80px",
              border: "2px solid rgba(255, 255, 255, 0.8)",
              "border-radius": "4px",
              overflow: "hidden",
              position: "relative",
              "background-color": "rgba(0, 0, 0, 0.7)",
              "backdrop-filter": "blur(4px)",
            }}
          >
            {/* Full image in minimap */}
            <img
              src={props.src}
              alt="Minimap"
              style={{
                width: "100%",
                height: "100%",
                "object-fit": "contain",
                opacity: 0.6,
              }}
            />
            {/* Viewport indicator */}
            <div
              ref={minimapRef}
              style={{
                position: "absolute",
                border: "2px solid #fff",
                "border-radius": "2px",
                "background-color": isDraggingMinimap() ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.2)",
                left: `${Math.max(0, Math.min(100, 50 + (panX() / (imageDimensions().width * currentScale())) * 100))}%`,
                top: `${Math.max(0, Math.min(100, 50 + (panY() / (imageDimensions().height * currentScale())) * 100))}%`,
                width: `${Math.min(100, (containerDimensions().width / (imageDimensions().width * currentScale())) * 100)}%`,
                height: `${Math.min(100, (containerDimensions().height / (imageDimensions().height * currentScale())) * 100)}%`,
                transform: "translate(-50%, -50%)",
                cursor: isDraggingMinimap() ? "grabbing" : "grab",
                "user-select": "none",
                transition: isDraggingMinimap() ? "none" : "all 0.1s ease",
              }}
              onMouseDown={handleMinimapDragStart}
              onTouchStart={handleMinimapDragStart}
            />
          </div>
          
          {/* Zoom Controls */}
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              style={{
                width: "32px",
                height: "32px",
                border: "2px solid rgba(255, 255, 255, 0.8)",
                "border-radius": "4px",
                "background-color": "rgba(0, 0, 0, 0.7)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                "font-size": "16px",
                "font-weight": "bold",
                "backdrop-filter": "blur(4px)",
              }}
            >
              −
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              style={{
                width: "32px",
                height: "32px",
                border: "2px solid rgba(255, 255, 255, 0.8)",
                "border-radius": "4px",
                "background-color": "rgba(0, 0, 0, 0.7)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                "font-size": "16px",
                "font-weight": "bold",
                "backdrop-filter": "blur(4px)",
              }}
            >
              +
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ZoomableImage;
