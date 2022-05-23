#!/usr/bin/env node

const { version } = require("../package.json");
const { writeFile } = require("fs/promises");
const util = require("util");
const prettier = require("prettier");
const exec = util.promisify(require("child_process").exec);

const INFO_PATH = "./src/versionInfo.ts";

const currentCommit = async () => {
  const status = await exec("git rev-parse HEAD");
  return status.stdout.trim();
};

const run = async () => {
  const commit = await currentCommit();

  const versionInfo = {
    version,
    timestamp: new Date().getTime(),
    commit,
  };
  const contents = `export const versionInfo = ${JSON.stringify(
    versionInfo
  )} as const;`;

  const formattedContents = prettier.format(contents, { parser: "typescript" });

  await writeFile(INFO_PATH, formattedContents, "utf-8");

  await exec(`git update-index --assume-unchanged ${INFO_PATH}`);
};

run();
