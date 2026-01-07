#!/usr/bin/env ts-node

import {
  access as accessCallback,
  constants,
  readFile as readFileCallback,
  writeFile as writeFileCallback,
} from "fs";
import { basename, extname, dirname, join } from "path";
import { argv } from "process";
import util from "util";
import { GlslMinify } from "webpack-glsl-minify/build/minify";

const readFile = util.promisify(readFileCallback);
const writeFile = util.promisify(writeFileCallback);
const access = util.promisify(accessCallback);

const glsl = new GlslMinify({
  output: "sourceOnly",
  esModule: false,
  stripVersion: false,
  preserveDefines: false,
  preserveUniforms: true,
  preserveVariables: false,
  nomangle: [],
});

const VALID_EXTENSIONS = [".frag", ".vert", ".vs", ".fs"];

const start: (files: string[]) => void = async ([inputFile]) => {
  if (inputFile === undefined) {
    console.error("No input filename provided.");
    process.exit(1);
  }
  try {
    await access(inputFile, constants.R_OK);
  } catch (e) {
    console.error("No permission to read input file, or file does not exist.");
    process.exit(1);
  }

  const extension = extname(inputFile);
  if (!VALID_EXTENSIONS.includes(extension)) {
    console.error(
      `Input file does not seem to be a shader. Extension should be one of ${VALID_EXTENSIONS}`
    );
    process.exit(1);
  }

  const baseName = basename(inputFile, extension);
  const targetFolder = dirname(inputFile);

  const targetFilename = join(targetFolder, `${baseName}-min${extension}`);

  const shaderSource = await readFile(inputFile, "utf8");
  const minifiedGlsl = await glsl.executeAndStringify(shaderSource);
  await writeFile(targetFilename, minifiedGlsl);
  console.log(
    "%s %f%",
    targetFilename,
    Math.round((minifiedGlsl.length / shaderSource.length) * 10000) / 100
  );
};

start(argv.slice(2));
