import { exec } from "child_process";
import { promisify } from "util";

const call = promisify(exec);

const getBranches = async () => {
  try {
    const { stdout, stderr } = await call("git branch");
    if (stderr) throw new Error(stderr);

    console.log(stdout);
  } catch (error) {
    throw error;
  }
};

const main = async () => {
  getBranches();
};

main();
