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
      <div className="m-4 grid grid-cols-[min-content_1fr] gap-x-4">
        <div className="flex justify-self-end pb-4">
          <Logo />
        </div>
        <div className="max-w-80">
          <Title>Welcome to Geppetto</Title>
          <Paragraph>
            Geppetto is a free and open animation tool
            <br /> to create and embed WebGL animations
          </Paragraph>
          <Paragraph size="small">
            Note: This is an early ALPHA build of Geppetto 2.0
            <br /> and is not yet ready for production use. (It&apos;s not
            feature complete yet!)
          </Paragraph>
        </div>
        {isNewFile(file) && (
          <>
            <Paragraph align="right">
              <ToolButton
                icon={<Icon>📄</Icon>}
                label="Load file..."
                onClick={() => sendMessage("fileOpen")}
                size="small"
                standAlone
              />
              <br />
              <Kbd shortcut={{ interaction: "KeyO", ctrlOrCmd: true }} />
            </Paragraph>
            <Paragraph>Load a Geppetto file from disk</Paragraph>
          </>
        )}
        <Paragraph align="right">
          <ToolButton
            icon={<Icon>🌅</Icon>}
            label="Load texture..."
            onClick={() => sendMessage("textureOpen")}
            size="small"
            standAlone
          />
          <br />
          <Kbd
            shortcut={{ interaction: "KeyO", ctrlOrCmd: true, shift: true }}
          />
        </Paragraph>
        <Paragraph>Load a texture from disk</Paragraph>
        <Paragraph align="right">&mdash; Or &mdash;</Paragraph>
        <div></div>
        <Paragraph align="right">
          <ToolButton
            icon={<Icon>🏡</Icon>}
            label="Load demo file"
            onClick={() => sendMessage("demoOpenScenery")}
            size="small"
            standAlone
          />
        </Paragraph>
        <Paragraph>Load a demo file to explore the app</Paragraph>
        <div className="col-span-2 pt-4">
          <Paragraph size="small">
            Version: {versionInfo.version} - {versionInfo.commit.slice(0, 6)},
            released{" "}
            {formatDistanceToNow(versionInfo.timestamp, { addSuffix: true })}
          </Paragraph>
        </div>
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
