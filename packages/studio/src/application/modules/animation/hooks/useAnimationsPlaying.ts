import type { AnimationControls, GeppettoImage } from "geppetto-player";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";

export const useAnimationsPlaying = (
  animationControlsRef: RefObject<AnimationControls | null>,
  file: GeppettoImage,
  animationsPlaying: string[],
  onStop?: (animationId: string) => void
) => {
  const animationsPlayingRef = useRef<string[]>([]);
  useEffect(() => {
    if (!animationControlsRef.current) return;
    const unsubscribe = animationControlsRef.current.onTrackStopped(
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
      animationControlsRef.current?.startAnimation(animationName);
    });
    toStop.forEach((animationName) => {
      animationControlsRef.current?.stopAnimation(animationName);
    });
    animationsPlayingRef.current = animationsPlaying;
  }, [animationsPlaying, file.animations, animationControlsRef, onStop]);
};
