import { isFrameControlAction } from "../../animation/file2/animations";
import { collectChildIds } from "../../animation/file2/hierarchy";
import { GeppettoImage } from "../../animation/file2/types";
import { TimeBox, TimeEvent, TimeLineCurves } from "../../ui-components";
import { useFile } from "../contexts/FileContext";

type AnimationTimeLinesProps = {
  selectedAnimations: string[];
};

const getControlLabel = (file: GeppettoImage, controlId: string) => {
  const control = file.controls[controlId];
  return control ? control.name : "Unknown control";
};

export const AnimationTimeLines: React.FC<AnimationTimeLinesProps> = ({
  selectedAnimations,
}) => {
  const [file] = useFile();

  const animationsIds = selectedAnimations.reduce<string[]>((ids, current) => {
    const animationNode = file.animationHierarchy[current];
    if (animationNode.type === "animation") {
      return ids.includes(current) ? ids : ids.concat(current);
    }
    if (animationNode.type === "animationFolder") {
      return ids
        .concat(collectChildIds(file.animationHierarchy, current))
        .filter((item, index, list) => list.indexOf(item) === index);
    }
    return ids;
  }, []);

  return (
    <div>
      <TimeLineCurves />
      {animationsIds.map((animationId) => {
        const animation = file.animations[animationId];
        const rowIndices: string[] = [];

        const getRowIndex = (controlId: string): number => {
          if (!rowIndices.includes(controlId)) {
            rowIndices.push(controlId);
          }

          return rowIndices.indexOf(controlId);
        };

        return (
          <div key={animationId}>
            {animation.name}
            <TimeBox zoom={1.0}>
              {animation.actions
                .filter(isFrameControlAction)
                .map((action, index) => (
                  <TimeEvent
                    key={index}
                    startTime={action.start}
                    endTime={action.start + action.duration}
                    label={getControlLabel(file, action.controlId)}
                    easing={action.easingFunction}
                    row={getRowIndex(action.controlId)}
                  />
                ))}
            </TimeBox>
          </div>
        );
      })}
    </div>
  );
};
