import type { GeppettoImage } from "@geppetto/types";
import { type FC, use } from "react";

import { ApplicationContext } from "@/application/state/ApplicationContext";
import {
  hasAnimations,
  hasAnimationsWithData,
} from "@/domain/animation/file2/animations";
import {
  hasControls,
  hasControlsWithStepsAndSettings,
} from "@/domain/animation/file2/controls";
import { hasMutations } from "@/domain/animation/file2/mutation";
import { hasLayers, hasPoints } from "@/domain/animation/file2/shapes";
import { Kbd, TodoItem, TodoList, ToolButton } from "@/ui/components";

type TodoProps = {
  texture: HTMLImageElement | null;
  file: GeppettoImage;
};

export const AnimationTodo: FC<TodoProps> = ({ file, texture }) => {
  const { sendMessage } = use(ApplicationContext);

  return (
    <TodoList>
      <TodoItem done={texture !== null} inProgress={texture === null}>
        Load a texture/image{" "}
        <ToolButton
          label={
            <Kbd
              dimmed
              shortcut={{ interaction: "KeyO", shift: true, ctrlOrCmd: true }}
            />
          }
          onClick={() => sendMessage("textureOpen")}
          size="small"
          standAlone
        />
      </TodoItem>
      <TodoItem done={hasPoints(file)} inProgress={hasLayers(file)}>
        Create a layer
      </TodoItem>
      <TodoItem done={hasMutations(file)}>Add mutators</TodoItem>
      <TodoItem
        done={hasControlsWithStepsAndSettings(file)}
        inProgress={hasControls(file)}
      >
        Add Controls
      </TodoItem>
      <TodoItem
        done={hasAnimationsWithData(file)}
        inProgress={hasAnimations(file)}
      >
        Add Animations
      </TodoItem>
    </TodoList>
  );
};
