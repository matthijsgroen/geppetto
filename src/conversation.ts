import { AnimationControls } from "geppetto-player";
import { delayFrames } from "./tween";

const root = document.getElementById("root");

const awaitClick = async () =>
  new Promise<void>((resolve) => {
    const handler = () => {
      resolve();
      root.removeEventListener("click", handler);
    };
    root.addEventListener("click", handler);
  });

const charSay = (character: AnimationControls, name: string) => {
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
    character.startTrack("Talking", { startAt: 800 });
    character.startTrack("Eyebrows");
    const hideText = showText(message);
    talkDelay(message);

    await awaitClick();
    character.startTrack("StopTalking");
    character.startTrack("EyebrowReset");
    hideText();
  };
};

type DialogCallbackOptions = {
  endDialog: () => void;
};
type DialogCallBack = (options: DialogCallbackOptions) => Promise<void>;
type DialogOptions = Record<string, DialogCallBack>;

const dialog = async (options: DialogOptions): Promise<void> => {
  let inConversation = true;
  const choiceAPI: DialogCallbackOptions = {
    endDialog: () => {
      inConversation = false;
    },
  };

  while (inConversation) {
    const choiceBox = document.createElement("div");
    choiceBox.classList.add("choicebox");
    root.appendChild(choiceBox);
    const choice = await new Promise<keyof DialogOptions>((resolve) => {
      Object.keys(options).forEach((key) => {
        const button = document.createElement("button");
        button.textContent = key;
        button.addEventListener("click", () => {
          root.removeChild(choiceBox);
          setTimeout(() => {
            resolve(key);
          });
        });
        choiceBox.appendChild(button);
      });
    });
    await options[choice](choiceAPI);
  }
};

export const conversation = async (character: AnimationControls) => {
  await delayFrames("startTalking", 60);
  const say = charSay(character, "Innkeeper");

  await say(
    "Hi! Welcome adventurer, welcome to my inn! Is there something you want to know?"
  );

  await dialog({
    "What is Geppetto?": async () => {
      await say(
        "Geppetto consists of two parts. A desktop application to define animated images, and a JavaScript library to play them."
      );
    },
    "Is Geppetto free?": async () => {
      await say(
        "Yes! It is free to use and distribute. It's also opensource (MIT License). So everyone can see how it works and extend it."
      );
    },
    "How does it work?": async () => {
      await say(
        "You need to create a texture file as .PNG. in Geppetto you will make layers from your texture, and compose them into your image."
      );
      await say(
        "The next step is to add mutations to your layer tree to create motion. You can then create timelines to define multiple animations."
      );
    },
    "I think I'll start exploring!": async ({ endDialog }) => {
      await say("Good luck!");
      endDialog();
    },
  });
};
