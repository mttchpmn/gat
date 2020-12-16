#! /usr/bin/env ts-node

import { exec } from "child_process";
import { promisify } from "util";
// import { program } from "commander";
import inquirer from "inquirer";

// const parseArgs = () => {
//   program.option("-f, --filename <filename>", "Input filename");
//   program.option("-p, --preview", "Preview DB write");

//   program.parse(process.argv);
//   const { filename, preview } = program;

//   if (!filename)
//     throw new Error(
//       "Input file is required. Specify with -f or --filename flag"
//     );

//   return { filename, preview };
// };

const callCommand = async (command: string) => {
  const call = promisify(exec);
  try {
    const { stdout, stderr } = await call(command);
    if (stderr) throw new Error(stderr);

    return stdout;
  } catch (error) {
    throw error;
  }
};

const getBranches = async () => {
  try {
    const output = await callCommand("git branch");

    const allBranches = output
      .split("\n") // Split by lines
      .filter((b: string) => b !== "") // Remove empty indices
      .map((b: string) => b.replace(/(^\s+|\s+$)/g, "")); // Trim whitespace

    const currentBranch = allBranches
      .find((b: string) => b.startsWith("*"))
      ?.replace(/\*\s/, "");

    const otherBranches = allBranches.filter((b: string) => !b.startsWith("*"));

    return { currentBranch: currentBranch as string, otherBranches };
  } catch (error) {
    throw error;
  }
};

const getBranchSelection = async (
  currentBranch: string,
  otherBranches: string[]
) => {
  console.log(`Your current branch is '${currentBranch}'`);
  const prompt = {
    type: "list",
    name: "selectedBranch",
    message: "Please select a new branch",
    choices: otherBranches,
  };

  const { selectedBranch } = await inquirer.prompt([prompt]);

  return selectedBranch;
};

const switchBranch = async (branch: string) => {
  // Divert stderr to stdout as Git writes checkout message to stderr
  const output = await callCommand(`git checkout ${branch} 2>&1`);

  console.log(output);
};

const main = async () => {
  // TODO - Parse commands
  const { currentBranch, otherBranches } = await getBranches();
  const selectedBranch = await getBranchSelection(currentBranch, otherBranches);
  await switchBranch(selectedBranch);
};

main();
