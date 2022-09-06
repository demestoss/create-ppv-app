import { inject, injectable } from "tsyringe";
import type { Stage } from "../project/stage";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { ProjectSettings } from "../project/projectSettings";
import type { Directory } from "../project/directory";
import { execAsync } from "../utils";
import fs from "fs-extra";
import path from "path";

@injectable()
class InstallPackagesStage implements Stage {
  constructor(
    @inject("Logger") private readonly logger: Logger,
    @inject("Spinner") private readonly spinner: Spinner,
    @inject("Directory") private readonly env: Directory,
    @inject("ProjectSettings") private readonly settings: ProjectSettings
  ) {}

  async proceed() {
    await this.copyLockFile();

    if (!this.settings.install) {
      return;
    }

    await this.install();
  }

  private get lockDir() {
    return path.join(this.env.packageRoot, "template/packageManager");
  }

  private async install() {
    this.spinner.start(
      `Running ${this.logger.infoBold(this.settings.packageManager.name + " install")}...`
    );
    await execAsync(`${this.settings.packageManager.name} install`, { cwd: this.settings.dir });
    this.spinner.succeed(`Packages successfully installed!`);
    this.settings.packageManager.installed = true;
  }

  private async copyLockFile() {
    await fs.copy(
      path.join(this.lockDir, this.settings.packageManager.lockFile),
      path.join(this.settings.dir, this.settings.packageManager.lockFile)
    );
  }
}

export { InstallPackagesStage };
