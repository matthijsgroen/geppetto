import { AnimationControls } from "geppetto-player";
import { delayFrames } from "./tween";

const root = document.getElementById("root");

const awaitClick = async () =>
  new Promise<void>((resolve) => {
    const dialog = document.getElementsByClassName("dialogbox")[0];
    const handler = () => {
      resolve();
      dialog.removeEventListener("click", handler);
    };
    dialog.addEventListener("click", handler);
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

const END = "END";

type DialogTree = (string | DialogChoice)[];
type DialogChoice = Record<string, DialogTree>;

const dialogText: DialogTree = [
  "Hi! Welcome adventurer, welcome to my inn! Is there something you want to know?",
  {
    "What is Geppetto?": [
      "Geppetto consists of two parts. A desktop application to define animated images, and a JavaScript library to play them.",
      {
        "Is Geppetto free?": [
          "Yes! It is free to use and distribute. It's also opensource (MIT License). So everyone can see how it works and extend it.",
        ],
        "How does it work?": [
          "You need to create a texture file as .PNG. in Geppetto you will make layers from your texture, and compose them into your image.",
          "The next step is to add mutations to your layer tree to create motion. You can then create timelines to define multiple animations.",
          {
            "Why not [Other product here]?": [
              "Other solutions exist for animation. Some are paid, some are not open source, some use vector graphics.",
              "Using a single texture file is fast (single http request) and adding more detail to your image doesn't have any rendering cost.",
            ],
            "What are the features?": [
              "Real-time control and animations. Did you know I can look in the direction you click in this image?",
              "Smooth transition between animations.",
              "Fast, most of the processing is on the GPU",
              "Free as in beer and speech. Isn't that great! It also means Matthijs doesn't make any money from it, and only works on it in his free time. " +
                "But, feel free to contribute!",
            ],
            "Sounds great!": [END],
          },
        ],
        "I want to talk about something else": [END],
      },
    ],
    "What can you tell me about your world?": [
      "I hope the world I live in will be expanded into a full game! Wouldn't that be great?",
      "For now it functions as a demo, to see if a game like environment could be created.",
      "Can you spot all the moving elements?",
      END,
    ],
    "I think I'll start exploring!": ["Good luck!", END],
  },
];

const playDialog = async (
  dialogText: DialogTree,
  talkFn: (text: string) => Promise<void>
): Promise<void> => {
  for (const item of dialogText) {
    if (typeof item === "string" && item !== END) {
      await talkFn(item);
    }
    if (typeof item === "object") {
      const options = Object.entries(item).reduce<DialogOptions>(
        (result, [key, tree]) => ({
          ...result,
          [key]: async ({ endDialog }) => {
            await playDialog(tree, talkFn);
            if (tree[tree.length - 1] === END) {
              endDialog();
            }
          },
        }),
        {}
      );
      await dialog(options);
    }
  }
};

export const conversation = async (character: AnimationControls) => {
  await delayFrames("startTalking", 60);
  character.startTrack("PauseSweeping");
  const say = charSay(character, "Innkeeper");

  await playDialog(dialogText, say);
};
