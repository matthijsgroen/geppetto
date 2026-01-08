import { type GeppettoImage } from "@geppetto/types";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useContext } from "react";

import { AnimationTodo } from "@/application/modules/application-menu/ui/AnimationTodo";
import { ApplicationContext } from "@/application/state/ApplicationContext";
import { Icon, Kbd, Logo, Paragraph, Title, ToolButton } from "@/ui/components";
import { versionInfo } from "@/versionInfo";

type StartupScreenProps = {
  texture: HTMLImageElement | null;
  file: GeppettoImage;
};

export const StartupScreen: React.FC<StartupScreenProps> = ({
  file,
  texture,
}) => {
  const { sendMessage } = useContext(ApplicationContext);

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
        <AnimationTodo file={file} texture={texture} />
        <Paragraph size="small">
          Note: This is an early ALPHA build of Geppetto 2.0
          <br /> and is not yet ready for production use. (It&apos;s not feature
          complete yet!)
        </Paragraph>
      </div>
      <Paragraph align="right" selectable={false}>
        <Kbd dimmed shortcut={{ interaction: "KeyO", ctrlOrCmd: true }} />
        <ToolButton
          icon={<Icon>📄</Icon>}
          label="Load file..."
          onClick={() => sendMessage("fileOpen")}
          size="small"
          standAlone
        />
      </Paragraph>
      <Paragraph selectable={false}>Load a Geppetto file from disk</Paragraph>
      <Paragraph align="right" selectable={false}>
        &mdash; Or &mdash;
      </Paragraph>
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
      <Paragraph selectable={false}>
        Load a demo file to explore the app
      </Paragraph>
      <div className="col-span-2 pt-4">
        <Paragraph size="small">
          Version: {versionInfo.version} - {versionInfo.commit.slice(0, 6)},
          released{" "}
          {formatDistanceToNow(versionInfo.timestamp, { addSuffix: true })}
        </Paragraph>
      </div>
    </div>
  );
  // }

  // if (
  //   (screen === "composition" || screen === "animation") &&
  //   texture &&
  //   !hasPoints(file)
  // ) {
  //   return (
  //     <p>
  //       No layers with a surface. Add a layer in the &ldquo;Layers&rdquo;
  //       screen.
  //     </p>
  //   );
  // }
  // if (screen === "animation" && texture && !hasControls(file)) {
  //   return (
  //     <p>
  //       No Controls defined. Add a control in the &ldquo;Composition&rdquo;
  //       screen.
  //     </p>
  //   );
  // }
  // return null;
};
