import chalk from "chalk";
import { execAsync } from "../utils";
import { Stage } from "../project/stage";
import { inject, injectable } from "tsyringe";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { ProjectSettings } from "../project/projectSettings";

@injectable()
class GitStage implements Stage {
  constructor(
    @inject("Logger") protected readonly logger: Logger,
    @inject("Spinner") protected readonly spinner: Spinner,
    @inject("ProjectSettings") protected readonly settings: ProjectSettings
  ) {}

  async proceed() {
    if (!this.settings.git) {
      return;
    }

    await this.init();
  }

  private async init() {
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

      await execAsync(initCmd, { cwd: this.settings.dir });

      this.spinner.succeed(`${chalk.green("Successfully initialized")} ${chalk.green.bold("git")}`);
    } catch (error) {
      this.spinner.fail(
        `${chalk.bold.red("Failed:")} could not initialize git. Update git to the latest version!`
      );
    }
  }
}

export { GitStage };
