import chalk from "chalk";
import { utils } from "../utils";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";

class Git {
  constructor(private readonly logger: Logger, private readonly spinner: Spinner) {}

  async init(dir: string) {
    this.logger.info("Initializing Git...");
    this.spinner.start("Creating a new git repo...");

    try {
      let initCmd = "git init --initial-branch=master";

      const { stdout: gitVersionOutput } = await utils("git --version");
      const gitVersionTag = gitVersionOutput.split(" ")[2];
      const major = gitVersionTag?.split(".")[0];
      const minor = gitVersionTag?.split(".")[1];
      if (Number(major) < 2 || Number(minor) < 28) {
        initCmd = "git init && git branch -m master";
      }

      await utils(initCmd, { cwd: dir });

      this.spinner.succeed(`${chalk.green("Successfully initialized")} ${chalk.green.bold("git")}`);
    } catch (error) {
      this.spinner.fail(
        `${chalk.bold.red("Failed:")} could not initialize git. Update git to the latest version!`
      );
    }
  }
}

export { Git };
