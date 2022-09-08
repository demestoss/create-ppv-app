import { inject, injectable } from "tsyringe";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import type { Stage } from "../project/commandProcessor";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { Directory } from "../project/directory";
import type { ProjectSettings } from "../project/projectSettings";

@injectable()
class CreateTemplateStage implements Stage {
  name: string = "";

  constructor(
    @inject("Logger") protected readonly logger: Logger,
    @inject("Spinner") protected readonly spinner: Spinner,
    @inject("Directory") protected readonly env: Directory
  ) {}

  async proceed(settings: ProjectSettings) {
    this.logger.info(`\nUsing manager: ${this.logger.infoBold(settings.packageManager.name)}\n`);
    this.spinner.start(`Creating template in: ${this.formattedName}...`);

    this.name = settings.name;

    await this.checkIfExists(settings.dir);
    await this.copyFiles(settings.dir);

    this.spinner.succeed(`${this.formattedName} creating successfully completed!`);
  }

  private get srcDir() {
    return path.join(this.env.packageRoot, "template/base");
  }

  private get formattedName() {
    return this.logger.infoBold(this.name);
  }

  private async checkIfExists(dir: string) {
    if (!fs.existsSync(dir)) {
      return;
    }

    if (fs.readdirSync(dir).length === 0) {
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
      fs.emptyDirSync(dir);
    }

    this.spinner.start();
  }

  private async copyFiles(dir: string) {
    await fs.copy(this.srcDir, dir);
    await fs.rename(path.join(dir, "_gitignore"), path.join(dir, ".gitignore"));
  }
}

export { CreateTemplateStage };
