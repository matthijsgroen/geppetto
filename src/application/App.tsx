import React, { useEffect, useState } from "react";
import { GeppettoImage } from "src/animation/file2/types";
import { ThemeProvider } from "styled-components";
import { newFile } from "../animation/file2/new";
import { Layers } from "./layers/Layers";
import { defaultTheme } from "./theme/default";

const updateWindowTitle = (
  animFile: string | null,
  textureFile: string | null
) => {
  document.title = `${animFile ? animFile : "Untitled"} — ${
    textureFile ? textureFile : "No texture"
  }`;
};

// const OUTPUT_VERSION_NUMBER = "2.0";

const App: React.FC = () => {
  const fileState = useState<GeppettoImage>(newFile());

  const zoomState = useState(1.0);
  const panXState = useState(0.0);
  const panYState = useState(0.0);

  useEffect(() => {
    updateWindowTitle(null, null);
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Layers
        zoomState={zoomState}
        panXState={panXState}
        panYState={panYState}
        fileState={fileState}
      />
    </ThemeProvider>
  );
};

export default App;
