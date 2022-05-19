#!/usr/bin/env node

const { version } = require("../package.json");
const { writeFile } = require("fs/promises");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const INFO_PATH = "./src/versionInfo.json";

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

  await writeFile(INFO_PATH, JSON.stringify(versionInfo), "utf-8");
};

run();
