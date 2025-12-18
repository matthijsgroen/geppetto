import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useContext } from "react";

import { isNewFile } from "../../animation/file2/new";
import { hasPoints } from "../../animation/file2/shapes";
import { type GeppettoImage } from "../../animation/file2/types";
import {
  Icon,
  Kbd,
  Logo,
  Paragraph,
  Title,
  ToolButton,
} from "../../ui-components";
import { versionInfo } from "../../versionInfo";
import { ApplicationContext } from "../contexts/ApplicationContext";

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
        <Title>Welcome to Geppetto</Title>
        <Paragraph>
          Geppetto is a free and open animation tool
          <br /> to create and embed WebGL animations
        </Paragraph>
        <Paragraph>
          Note: This is an early ALPHA build of Geppetto 2.0
          <br /> and is not yet ready for production use. (It&apos;s not feature
          complete yet!)
        </Paragraph>
        {isNewFile(file) && (
          <Paragraph>
            <ToolButton
              icon={<Icon>📄</Icon>}
              label="Load file..."
              onClick={() => sendMessage("fileOpen")}
              size="small"
              shadow
            />
            <Kbd shortcut={{ interaction: "KeyO", ctrlOrCmd: true }} />
          </Paragraph>
        )}
        <Paragraph>
          <ToolButton
            icon={<Icon>🌅</Icon>}
            label="Load texture..."
            onClick={() => sendMessage("textureOpen")}
            size="small"
            shadow
          />
          <Kbd
            shortcut={{ interaction: "KeyO", ctrlOrCmd: true, shift: true }}
          />
        </Paragraph>
        <Paragraph>&mdash; Or &mdash;</Paragraph>
        <Paragraph>
          <ToolButton
            icon={<Icon>🏡</Icon>}
            label="Load demo file"
            onClick={() => sendMessage("demoOpenScenery")}
            size="small"
            shadow
          />
        </Paragraph>
        <Paragraph size="small">
          Version: {versionInfo.version} - {versionInfo.commit.slice(0, 6)},
          released{" "}
          {formatDistanceToNow(versionInfo.timestamp, { addSuffix: true })}
        </Paragraph>
      </div>
    );
  }

  if (screen === "composition" && texture && !hasPoints(file)) {
    return (
      <p>
        No layers with a surface. Add a layer in the &ldquo;Layers&rdquo;
        screen.
      </p>
    );
  }
  return null;
};
