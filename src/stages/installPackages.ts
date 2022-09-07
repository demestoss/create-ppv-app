import { inject, injectable } from "tsyringe";
import type { Stage } from "../project/project";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { ProjectSettings } from "../project/projectSettings";
import type { Directory } from "../project/directory";
import { execAsync } from "../utils";

@injectable()
class InstallPackagesStage implements Stage {
  constructor(
    @inject("Logger") private readonly logger: Logger,
    @inject("Spinner") private readonly spinner: Spinner,
    @inject("Directory") private readonly env: Directory,
    @inject("ProjectSettings") private readonly settings: ProjectSettings
  ) {}

  async proceed() {
    await this.install();
  }

  private async install() {
    this.spinner.start(`Running ${this.logger.infoBold(this.settings.packageManager.install)}...`);
    await execAsync(`${this.settings.packageManager.install}`, { cwd: this.settings.dir });
    this.spinner.succeed(`Packages successfully installed!`);
  }
}

export { InstallPackagesStage };
