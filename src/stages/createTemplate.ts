import { inject, injectable } from "tsyringe";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import type { Stage } from "../project/stagesProcessor";
import type { ProjectSettings } from "../project/projectSettings";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { Directory } from "../project/directory";

@injectable()
class CreateTemplateStage implements Stage {
  constructor(
    @inject("Logger") protected readonly logger: Logger,
    @inject("Spinner") protected readonly spinner: Spinner,
    @inject("Directory") protected readonly env: Directory,
    @inject("ProjectSettings") protected readonly settings: ProjectSettings
  ) {}

  async proceed() {
    this.logger.info(
      `\nUsing manager: ${this.logger.infoBold(this.settings.packageManager.name)}\n`
    );
    this.spinner.start(`Creating template in: ${this.formattedName}...`);

    await this.checkIfExists();
    await this.copyFiles();

    this.spinner.succeed(`${this.formattedName} creating successfully completed!`);
  }

  private get srcDir() {
    return path.join(this.env.packageRoot, "template/base");
  }

  private get formattedName() {
    return this.logger.infoBold(this.settings.name);
  }

  private async checkIfExists() {
    if (!fs.existsSync(this.settings.dir)) {
      return;
    }

    if (fs.readdirSync(this.settings.dir).length === 0) {
      this.spinner.info(`${this.formattedName} exists but is empty, continuing...`);
      return;
    }

    this.spinner.stopAndPersist();

    const { overwriteDir } = await inquirer.prompt<{ overwriteDir: boolean }>({
      name: "overwriteDir",
      type: "confirm",
      message: `${this.logger.warningBold("Warning:")} ${
        this.formattedName
      } already exists and isn't empty. Do you want to overwrite it?`,
      default: false,
    });

    if (!overwriteDir) {
      this.spinner.fail("Aborting installation...");
      process.exit(0);
    } else {
      this.spinner.info(`Emptying ${this.formattedName} and creating app..`);
      fs.emptyDirSync(this.settings.dir);
    }

    this.spinner.start();
  }

  private async copyFiles() {
    await fs.copy(this.srcDir, this.settings.dir);
    await fs.rename(
      path.join(this.settings.dir, "_gitignore"),
      path.join(this.settings.dir, ".gitignore")
    );
  }
}

export { CreateTemplateStage };
