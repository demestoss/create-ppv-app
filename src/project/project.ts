import { PackageJsonService } from "../stages/packageJson";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import { Git } from "../stages/git";
import { Template } from "../stages/template";
import { ProjectSettings } from "./projectSettings";

class Project {
  constructor(
    private readonly logger: Logger,
    private readonly spinner: Spinner,
    private readonly settings: ProjectSettings
  ) {}

  async createBaseTemplate() {
    const baseTemplate = new Template(this.logger, this.spinner, this.settings.packageManager);
    await baseTemplate.create(this.settings.dir, this.settings.name);
  }

  async updatePackages() {
    const pkgJsonService = new PackageJsonService(this.logger, this.spinner, this.settings.dir);
    await pkgJsonService.updatePackages();
    await this.runPackageInstall();
  }

  async runPackageInstall() {
    await this.settings.packageManager.copyLockFile(this.settings.dir);

    if (!this.settings.install) {
      return;
    }

    await this.settings.packageManager.install(this.settings.dir);
  }

  async initGit() {
    if (!this.settings.git) {
      return;
    }

    const git = new Git(this.logger, this.spinner);
    await git.init(this.settings.dir);
  }

  logGuide() {
    this.settings.packageManager.logGuide(this.settings.name);
  }
}

export { Project };
