import { AnimationControls } from "geppetto-player";
import { delayFrames } from "./tween";

const charSay = (character: AnimationControls, name: string) => {
  const root = document.getElementById("root");

  const awaitClick = async () =>
    new Promise<void>((resolve) => {
      const handler = () => {
        resolve();
        root.removeEventListener("click", handler);
      };
      root.addEventListener("click", handler);
    });

  const talkDelay = async (message: string) => {
    await delayFrames("talking", message.length * 6);
    character.startTrack("StopTalking");
    character.startTrack("EyebrowReset");
  };

  const showText = (text: string) => {
    const dialogBox = document.createElement("div");
    dialogBox.classList.add("dialogbox");

    const nameField = document.createElement("h3");
    nameField.classList.add("dialogname");
    nameField.textContent = name;
    dialogBox.appendChild(nameField);
    root.appendChild(dialogBox);

    const textField = document.createElement("p");
    textField.textContent = text;
    dialogBox.appendChild(textField);

    return () => {
      root.removeChild(dialogBox);
    };
  };

  return async (message: string) => {
    character.startTrack("Talking");
    character.startTrack("Eyebrows");
    const hideText = showText(message);
    talkDelay(message);

    await awaitClick();
    hideText();
  };
};

type DialogCallbackOptions = {
  endDialog: () => void;
};
type DialogCallBack = (options: DialogCallbackOptions) => Promise<void>;
type DialogOptions = Record<string, DialogCallBack>;

const dialog = async (options: DialogOptions): Promise<void> => {
  await delayFrames("startTalking", 60);
};

export const conversation = async (character: AnimationControls) => {
  await delayFrames("startTalking", 60);
  const say = charSay(character, "Innkeeper");

  await say("Hi! Welcome adventurer, to Geppetto's Inn! How can I help you?");

  await dialog({
    "What is Geppetto?": async () => {
      await say("Geppetto blablabla!");
    },
    "I think I'll start exploring!": async ({ endDialog }) => {
      await say("Good luck!");
      endDialog();
    },
  });
};
