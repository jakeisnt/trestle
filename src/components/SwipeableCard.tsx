import { createEffect, createSignal, onMount, mergeProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import WithProgressCircle from "./WithProgressCircle";

import { ArrowLeft, ArrowRight, Close } from "./icons";

type SwipeableCardProps = {
  children: JSX.Element;
  // Called when the user starts swiping the card.
  onSwipeStart?: (e: TouchEvent) => void;
  // Called when the user stops swiping the card
  // regardless of outcome.
  onSwipeEnd?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  class?: string;
  refetchId?: number;
  SwipeLeftIcon?: JSX.Element;
  SwipeRightIcon?: JSX.Element;
  SwipeUpIcon?: JSX.Element;
  SwipeDownIcon?: JSX.Element;
};

const SwipeableCard = (inputProps: SwipeableCardProps) => {
  const props = mergeProps(inputProps, {
    SwipeLeftIcon: ArrowLeft,
    SwipeRightIcon: ArrowRight,
    SwipeUpIcon: Close,
    SwipeDownIcon: Close,
  });

  // time (ms) to wait before interpreting a touch event as a swipe
  const MAX_CLICK_DURATION = 200;

  let startX = 0;
  let startY = 0;

  let currentX = 0;
  let currentY = 0;

  let cardRef: HTMLDivElement | undefined;

  let canSwipeVertically = false;
  let canSwipeHorizontally = false;

  let ratio: number;

  onMount(() => {
    // remove 'overscroll effects' from the page
    document.body.style.overscrollBehavior = "none";
    // The ratio of the screen width to height
    ratio = window.innerWidth / window.innerHeight;
  });

  /**
   * Reset the card's position and scale.
   */
  const resetCard = () => {
    if (!cardRef) return;

    currentX = 0;
    currentY = 0;
    cardRef.style.transform = `translateX(0px) translateY(0px) scale(1)`;
    setHorizontalFillAmount(0);
    setVerticalFillAmount(0);
    setDirection(undefined);
  };

  // When the component mounts, reset the card's position and scale
  createEffect(() => {
    if (props.onSwipeDown || props.onSwipeUp) {
      canSwipeVertically = true;
    }

    if (props.onSwipeLeft || props.onSwipeRight) {
      canSwipeHorizontally = true;
    }

    if (!props.refetchId) return;
    resetCard();
  });

  let touchStartTimeout: number;
  let clickStartTime = 0;

  /**
   * Start dragging the card.
   */
  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    clickStartTime = Date.now();
  };

  // Minimum distance to trigger swipe action (in pixels)
  const SWIPE_ACTION_TRIGGER_DISTANCE = 100;
  const [verticalFillAmount, setVerticalFillAmount] = createSignal(0);
  const [horizontalFillAmount, setHorizontalFillAmount] = createSignal(0);
  const [direction, setDirection] = createSignal<"left" | "right" | "up" | "down" | undefined>();

  /**
   * Get the direction closest to the threshold.
   */
  const getDirectionClosestToThreshold = (currentX: number, currentY: number) => {
    const xDiff = Math.abs(currentX - startX);
    const yDiff = Math.abs(currentY - startY);

    if (xDiff > yDiff * ratio && canSwipeHorizontally) {
      return currentX < startX ? "left" : "right";
    } else if (yDiff > xDiff * ratio && canSwipeVertically) {
      return currentY < startY ? "up" : "down";
    } else {
      return undefined;
    }
  };

  /**
   * Get the direction the user clicked in.
   * Compare the current cursor position to the position of the center of the card.
   */
  const getClickDirection = () => {
    if (!cardRef) {
      return;
    }

    // get position of top left corner of card
    const rect = cardRef.getBoundingClientRect();
    const topLeftX = rect.left + window.scrollX;
    // const topLeftY = rect.top + window.scrollY;

    // get center of card
    const centerX = topLeftX + rect.width / 2;
    // const centerY = topLeftY + rect.height / 2;

    if (currentX < centerX) {
      return "left";
    } else if (currentX > centerX) {
      return "right";
    }
  };

  /**
   * Folow the user's touch movement to drag the card downwards.
   */
  const handleTouchMove = (e: TouchEvent) => {
    if (!cardRef) return;
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const clickDurationHasPassed = Date.now() - clickStartTime > MAX_CLICK_DURATION;

    // The user hasn't swiped but they also don't intend to click.
    const weAreNotClicking = clickDurationHasPassed;

    if (weAreNotClicking) {
      props.onSwipeStart?.(e);
    }

    if (absDeltaY > absDeltaX && canSwipeVertically) {
      // Cancel the 'do not move card' animation
      // if the user is already swiping the card.
      if (touchStartTimeout) {
        window.clearTimeout(touchStartTimeout);
      }

      const change = absDeltaY;

      cardRef.style.transform = `translateY(${deltaY}px) scale(${Math.max(0.5, 1 - change / 200)})`;

      setVerticalFillAmount(change);
    } else if (absDeltaX > absDeltaY && canSwipeHorizontally) {
      // Cancel the 'do not move card' animation
      // if the user is already swiping the card.
      if (touchStartTimeout) {
        window.clearTimeout(touchStartTimeout);
      }

      const change = Math.abs(deltaX);
      cardRef.style.transform = `translateX(${deltaX}px) scale(${Math.max(0.5, 1 - change / 200)})`;

      setHorizontalFillAmount(change);
    } else if (weAreNotClicking && !touchStartTimeout) {
      // If the user intends to swipe but doesn't,
      // make the card smaller to encourage the user to swipe.
      touchStartTimeout = window.setTimeout(() => {
        if (!cardRef) return;
        cardRef.style.transform = `translateX(0px) translateY(0px) scale(0.9)`;
      }, 250);
    }

    setDirection(getDirectionClosestToThreshold(currentX, currentY));
  };

  /**
   * Stop dragging the card.
   */
  const handleTouchEnd = (e: TouchEvent) => {
    // If we've queued a prompting animation, cancel it.
    if (touchStartTimeout) {
      window.clearTimeout(touchStartTimeout);
    }

    // If the user has moved the cursor by 10px since the start of the touch,
    // allow the dragging behavior to begin.
    currentX = e.changedTouches[0].clientX;
    currentY = e.changedTouches[0].clientY;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const clickDurationHasNotPassed = Date.now() - clickStartTime < MAX_CLICK_DURATION;

    const weAreClicking = absDeltaX < 10 && absDeltaY < 10 && clickDurationHasNotPassed;

    if (weAreClicking) {
      // We have clicked.
      // Determine whether to trigger the left or right swipe action.
      const direction = getClickDirection();

      if (direction === "left" && props.onSwipeLeft) {
        props.onSwipeLeft();
      } else if (direction === "right" && props.onSwipeRight) {
        props.onSwipeRight();
      } else {
        resetCard();
      }

      if (props.onSwipeEnd) {
        props.onSwipeEnd();
      }

      return;
    }

    // If we haven't clicked, we've swiped.
    // Figure out whether a swipe has been committed and in what direction..
    clickStartTime = 0;

    // Horizontal swipe
    if (absDeltaX > absDeltaY && canSwipeHorizontally) {
      if (deltaX > SWIPE_ACTION_TRIGGER_DISTANCE && props.onSwipeLeft) {
        props.onSwipeLeft();
      } else if (deltaX < -SWIPE_ACTION_TRIGGER_DISTANCE && props.onSwipeRight) {
        props.onSwipeRight();
      } else {
        resetCard();
      }
    }
    // Vertical swipe
    else if (absDeltaY > absDeltaX && canSwipeVertically) {
      if (deltaY > SWIPE_ACTION_TRIGGER_DISTANCE && props.onSwipeDown) {
        props.onSwipeDown();
      } else if (deltaY < -SWIPE_ACTION_TRIGGER_DISTANCE && props.onSwipeUp) {
        props.onSwipeUp();
      } else {
        resetCard();
      }
    } else {
      resetCard();
    }

    props.onSwipeEnd?.();
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "opacity 0.3s",
          opacity: props.onSwipeDown && direction() === "down" ? 1 : 0,
        }}
      >
        <WithProgressCircle
          Icon={props.SwipeDownIcon}
          fillAmount={verticalFillAmount()}
          width={20}
          height={20}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "60px",
          transform: "translateX(-50%)",
          transition: "opacity 0.3s",
          opacity: props.onSwipeUp && direction() === "up" ? 1 : 0,
        }}
      >
        <WithProgressCircle
          Icon={props.SwipeUpIcon}
          fillAmount={verticalFillAmount()}
          width={20}
          height={20}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "30px",
          transform: "translateY(-50%)",
          transition: "opacity 0.3s",
          opacity: props.onSwipeLeft && direction() === "left" ? 1 : 0,
        }}
      >
        <WithProgressCircle
          Icon={props.SwipeLeftIcon}
          fillAmount={horizontalFillAmount()}
          width={20}
          height={20}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "30px",
          transform: "translateY(-50%)",
          transition: "opacity 0.3s",
          opacity: props.onSwipeRight && direction() === "right" ? 1 : 0,
        }}
      >
        <WithProgressCircle
          Icon={props.SwipeRightIcon}
          fillAmount={horizontalFillAmount()}
          width={20}
          height={20}
        />
      </div>

      <div
        class={props.class}
        ref={cardRef}
        style={{
          transition: "transform 0.3s",
          "touch-action": "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {props.children}
      </div>
    </>
  );
};

export default SwipeableCard;
