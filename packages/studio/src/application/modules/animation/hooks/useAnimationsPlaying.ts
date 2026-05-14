import type { AnimationControls, GeppettoImage } from "geppetto-player";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { usePlayerTimestamp } from "@/application/modules/animation/state/PlayerControlsProvider";

export const useAnimationsPlaying = (
  animationControlsRef: RefObject<AnimationControls | null>,
  file: GeppettoImage,
  animationsPlaying: string[],
  onStop?: (animationId: string) => void
) => {
  const animationsPlayingRef = useRef<string[]>([]);
  const trackTimestampRef = useRef<{ time: number; trackId: string } | null>(
    null
  );

  usePlayerTimestamp((data) => {
    if (data === null) {
      return;
    }
    trackTimestampRef.current = data;
  });

  useEffect(() => {
    if (!animationControlsRef.current) return;
    const unsubscribe = animationControlsRef.current.onAnimationStopped(
      (animationName: string) => {
        const animationEntry = Object.entries(file.animations).find(
          ([, animation]) => animation.name === animationName
        );
        if (animationEntry) {
          const [animationId] = animationEntry;
          onStop?.(animationId);
        }
      }
    );
    return unsubscribe;
  }, [animationControlsRef, file.animations, onStop]);
  useEffect(() => {
    if (!animationControlsRef.current) return;
    if (
      JSON.stringify(animationsPlayingRef.current) ===
      JSON.stringify(animationsPlaying)
    )
      return;

    // Animations to start
    const toStart = animationsPlaying
      .filter((id) => !animationsPlayingRef.current.includes(id))
      .map((id) => file.animations[id].name);

    // Animations to stop
    const toStop = animationsPlayingRef.current
      .filter((id) => !animationsPlaying.includes(id))
      .map((id) => file.animations[id].name);

    toStart.forEach((animationName) => {
      if (
        trackTimestampRef.current &&
        file.animations[trackTimestampRef.current.trackId].name ===
          animationName
      ) {
        animationControlsRef.current?.startAnimation(animationName, {
          startAt: trackTimestampRef.current.time,
        });
      } else {
        animationControlsRef.current?.startAnimation(animationName);
      }
    });
    toStop.forEach((animationName) => {
      animationControlsRef.current?.stopAnimation(animationName);
    });
    animationsPlayingRef.current = animationsPlaying;
  }, [animationsPlaying, file.animations, animationControlsRef, onStop]);
};
