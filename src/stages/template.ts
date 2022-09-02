import { Logger } from "../logger";
import { Spinner } from "../spinner";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { PackageManager } from "../packageManager";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

class Template {
  private readonly srcDir = path.join(PKG_ROOT, "template/base");

  constructor(
    private readonly logger: Logger,
    private readonly spinner: Spinner,
    private readonly packageManager: PackageManager
  ) {}

  async create(dir: string, name: string) {
    this.logger.info(`\nUsing manager: ${chalk.cyan.bold(this.packageManager.name)}\n`);
    this.spinner.start(`Creating template in: ${dir}...`);

    await this.checkIfExists(dir, name);
    this.spinner.start();

    await fs.copy(this.srcDir, dir);
    await fs.rename(path.join(dir, "_gitignore"), path.join(dir, ".gitignore"));

    this.spinner.succeed(`${chalk.cyan.bold(name)} creating successfully completed!`);
  }

  private async checkIfExists(dir: string, name: string) {
    if (!fs.existsSync(dir)) {
      return;
    }

    if (fs.readdirSync(dir).length === 0) {
      this.spinner.info(`${chalk.cyan.bold(name)} exists but is empty, continuing...`);
      return;
    }

    this.spinner.stopAndPersist();

    const { overwriteDir } = await inquirer.prompt<{ overwriteDir: boolean }>({
      name: "overwriteDir",
      type: "confirm",
      message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(
        name
      )} already exists and isn't empty. Do you want to overwrite it?`,
      default: false,
    });

    if (!overwriteDir) {
      this.spinner.fail("Aborting installation...");
      process.exit(0);
    } else {
      this.spinner.info(`Emptying ${chalk.cyan.bold(name)} and creating app..`);
      fs.emptyDirSync(dir);
    }
  }
}

export { Template };
