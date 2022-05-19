import { useContext } from "react";
import { isNew } from "../../animation/file2/new";
import { hasPoints } from "../../animation/file2/shapes";
import { GeppettoImage } from "../../animation/file2/types";
import { Icon, Label, Logo, ToolButton } from "../../ui-components";
import { Kbd } from "../../ui-components/Kbd/Kbd";
import { versionInfo } from "../../versionInfo";
import { ApplicationContext } from "../contexts/ApplicationContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

type StartupScreenProps = {
  texture: HTMLImageElement | null;
  file: GeppettoImage;
  screen: "layers" | "composition" | "animation";
};

export const StartupScreen: React.FC<StartupScreenProps> = ({
  file,
  texture,
  screen,
}) => {
  const { sendMessage } = useContext(ApplicationContext);

  if (texture === null) {
    return (
      <div>
        <Logo />
        <h1>Welcome to Geppetto</h1>
        <p>
          Geppetto is a free and open animation tool
          <br /> to create and embed WebGL animations
        </p>
        {isNew(file) && (
          <p>
            <ToolButton
              icon={<Icon>📄</Icon>}
              label={"Load file..."}
              onClick={() => sendMessage("fileOpen")}
              size="small"
              shadow
            />
            <Kbd shortcut={{ key: "KeyO", ctrlOrCmd: true }} />
          </p>
        )}
        <p>
          <ToolButton
            icon={<Icon>🌅</Icon>}
            label={"Load texture..."}
            onClick={() => sendMessage("textureOpen")}
            size="small"
            shadow
          />
          <Kbd shortcut={{ key: "KeyO", ctrlOrCmd: true, shift: true }} />
        </p>
        <p>&mdash; Or &mdash;</p>
        <p>
          <ToolButton
            icon={<Icon>🏡</Icon>}
            label={"Load demo file"}
            onClick={() => sendMessage("demoOpenScenery")}
            size="small"
            shadow
          />
        </p>
        <Label size="small">
          Version: {versionInfo.version} - {versionInfo.commit.slice(0, 6)},
          released{" "}
          {formatDistanceToNow(versionInfo.timestamp, { addSuffix: true })}
        </Label>
      </div>
    );
  }

  if (screen === "composition" && texture && !hasPoints(file)) {
    return <p>No layers with a surface. Add a layer in the "Layers" screen.</p>;
  }
  return null;
};
