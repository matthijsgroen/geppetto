import { formatSpeed } from "@/application/shared/speedFormatter";
import { useFile } from "@/application/state/FileContext";
import { updateAnimationSpeedModifier } from "@/domain/animation/file2/animations";
import { MenuItem, MenuRadioGroup } from "@/ui/components";

export const AnimationSpeedOptions: React.FC<{
  animationId: string;
}> = ({ animationId }) => {
  const [file, setFile] = useFile();
  const animation = file.animations[animationId];

  return (
    <MenuRadioGroup value={animation.speedModifier ?? 1}>
      {[0.125, 0.25, 0.5, 1 / 1.5, 1, 1.5, 2, 4, 8].map((speed) => (
        <MenuItem
          key={speed}
          onClick={() => {
            setFile(updateAnimationSpeedModifier(animationId, speed));
          }}
          type="radio"
          value={speed}
        >
          {formatSpeed(speed)}
        </MenuItem>
      ))}
    </MenuRadioGroup>
  );
};
