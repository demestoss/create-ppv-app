import chalk from "chalk";
import { execAsync } from "../execAsync";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";

class Git {
  constructor(
    private readonly logger: Logger,
    private readonly spinner: Spinner,
    private readonly dir: string
  ) {}

  async init() {
    this.logger.info("Initializing Git...");
    this.spinner.start("Creating a new git repo...");

    try {
      let initCmd = "git init --initial-branch=master";

      const { stdout: gitVersionOutput } = await execAsync("git --version");
      const gitVersionTag = gitVersionOutput.split(" ")[2];
      const major = gitVersionTag?.split(".")[0];
      const minor = gitVersionTag?.split(".")[1];
      if (Number(major) < 2 || Number(minor) < 28) {
        initCmd = "git init && git branch -m master";
      }

      await execAsync(initCmd, { cwd: this.dir });

      this.spinner.succeed(`${chalk.green("Successfully initialized")} ${chalk.green.bold("git")}`);
    } catch (error) {
      this.spinner.fail(
        `${chalk.bold.red("Failed:")} could not initialize git. Update git to the latest version!`
      );
    }
  }
}

export { Git };
