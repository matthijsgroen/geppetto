#!/usr/bin/env node

import packageDefinition from "../package.json" with { type: "json" };
import { writeFile } from "fs/promises";
import util from "util";
import prettier from "prettier";
import { exec as execCallback } from "child_process";

const exec = util.promisify(execCallback);

const INFO_PATH = "./src/versionInfo.ts";

const currentCommit = async () => {
  const status = await exec("git rev-parse HEAD");
  return status.stdout.trim();
};

const run = async () => {
  const commit = await currentCommit();

  const versionInfo = {
    version: packageDefinition.version,
    timestamp: new Date().getTime(),
    commit,
  };
  const contents = `export const versionInfo = ${JSON.stringify(
    versionInfo
  )} as const;`;

  const formattedContents = await prettier.format(contents, {
    parser: "typescript",
  });

  await writeFile(INFO_PATH, formattedContents, "utf-8");

  await exec(`git update-index --assume-unchanged ${INFO_PATH}`);
};

run();
