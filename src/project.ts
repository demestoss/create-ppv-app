import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import { execAsync } from "./execAsync";
import { PackageJsonService } from "./packageJson";
import type { Logger } from "./logger";
import type { PackageManager, ProjectOptions } from "./index";
import type { Spinner } from "./spinner";
import { Git } from "./git";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

class Project {
  private readonly srcDir = path.join(PKG_ROOT, "template");
  private readonly name: string;
  private readonly dir: string;
  private readonly packageManager: PackageManager;

  constructor(
    private readonly logger: Logger,
    private readonly spinner: Spinner,
    options: ProjectOptions
  ) {
    this.name = options.name;
    this.dir = options.dir;
    this.packageManager = options.packageManager;
  }

  async createBaseTemplate() {
    this.logger.info(`\nUsing manager: ${chalk.cyan.bold(this.packageManager)}\n`);
    this.spinner.start(`Creating template in: ${this.dir}...`);

    await this.checkIfExists();
    this.spinner.start();

    await fs.copy(this.srcDir, this.dir);
    await fs.rename(path.join(this.dir, "_gitignore"), path.join(this.dir, ".gitignore"));

    await execAsync(`${this.packageManager} install`, { cwd: this.dir });

    this.spinner.succeed(`${chalk.cyan.bold(this.name)} creating successfully completed!`);
  }

  async updatePackages() {
    const pkgJsonService = new PackageJsonService(this.logger, this.spinner, this.dir);
    await pkgJsonService.updatePackages();
  }

  async initGit() {
    const git = new Git(this.logger, this.spinner, this.dir);
    await git.init();
  }

  private async checkIfExists() {
    if (!fs.existsSync(this.dir)) {
      return;
    }

    if (fs.readdirSync(this.dir).length === 0) {
      this.spinner.info(`${chalk.cyan.bold(this.name)} exists but is empty, continuing...`);
      return;
    }

    this.spinner.stopAndPersist();

    const { overwriteDir } = await inquirer.prompt<{ overwriteDir: boolean }>({
      name: "overwriteDir",
      type: "confirm",
      message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(
        this.name
      )} already exists and isn't empty. Do you want to overwrite it?`,
      default: false,
    });

    if (!overwriteDir) {
      this.spinner.fail("Aborting installation...");
      process.exit(0);
    } else {
      this.spinner.info(`Emptying ${chalk.cyan.bold(this.name)} and creating app..`);
      fs.emptyDirSync(this.dir);
    }
  }
}

export { Project };
