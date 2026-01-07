let tweens: { name: string; ticker: () => void }[] = [];

export type TweenCreator = (
  name: string,
  source: number,
  target: number,
  speed: number,
  applier: (value: number) => void
) => Promise<void>;

export const cleanTicker = (name: string) => {
  tweens = tweens.filter((e) => e.name !== name);
};

export const animationTween: TweenCreator = (
  name,
  source,
  target,
  speed,
  applier
) =>
  new Promise((resolve) => {
    cleanTicker(name);
    let current = source;
    const ticker = () => {
      if (current === target) {
        cleanTicker(name);
        resolve();
      } else {
        if (current < target) {
          current += Math.min(speed, target - current);
        } else {
          current -= Math.min(speed, current - target);
        }
      }
      applier(current);
    };
    tweens = tweens.concat({ name, ticker });
  });

export const delayFrames = (name: string, frames: number): Promise<void> =>
  new Promise((resolve) => {
    cleanTicker(name);
    let current = frames;

    const ticker = () => {
      if (current === 0) {
        cleanTicker(name);
        resolve();
      } else {
        current--;
      }
    };
    tweens = tweens.concat({ name, ticker });
  });

export const tick = () => {
  for (const tween of tweens) {
    tween.ticker();
  }
};
