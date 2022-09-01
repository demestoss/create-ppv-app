import chalk from "chalk";
import { execAsync } from "./execAsync";
import { PackageJsonService } from "./stages/packageJson";
import type { Logger } from "./logger";
import type { PackageManager, ProjectOptions } from "./index";
import type { Spinner } from "./spinner";
import { Git } from "./stages/git";
import { BaseTemplate } from "./stages/baseTemplate";

class Project {
  private readonly name: string;
  private readonly dir: string;
  private readonly git: boolean;
  private readonly packageManager: PackageManager;

  constructor(
    private readonly logger: Logger,
    private readonly spinner: Spinner,
    options: ProjectOptions
  ) {
    this.name = options.name;
    this.dir = options.dir;
    this.packageManager = options.packageManager;
    this.git = options.git;
  }

  async createBaseTemplate() {
    const baseTemplate = new BaseTemplate(
      this.logger,
      this.spinner,
      this.dir,
      this.name,
      this.packageManager
    );
    await baseTemplate.create();
  }

  async updatePackages() {
    const pkgJsonService = new PackageJsonService(this.logger, this.spinner, this.dir);
    await pkgJsonService.updatePackages();
    await this.runPackageInstall();
  }

  async runPackageInstall() {
    this.spinner.start(`Running ${chalk.cyan.bold(this.packageManager + " install")}...`);
    await execAsync(`${this.packageManager} install`, { cwd: this.dir });
    this.spinner.succeed(`Packages successfully installed!`);
  }

  async initGit() {
    if (!this.git) {
      return;
    }

    const git = new Git(this.logger, this.spinner, this.dir);
    await git.init();
  }
}

export { Project };
