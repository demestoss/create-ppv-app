import { inject, injectable } from "tsyringe";
import type { Stage } from "../project/stagesProcessor";
import type { Logger } from "../logger";
import type { Spinner } from "../spinner";
import type { ProjectSettings } from "../project/projectSettings";
import { execAsync } from "../utils";

@injectable()
class InstallPackagesStage implements Stage {
  constructor(
    @inject("Logger") private readonly logger: Logger,
    @inject("Spinner") private readonly spinner: Spinner
  ) {}

  async proceed(settings: ProjectSettings) {
    this.spinner.start(`Running ${this.logger.infoBold(settings.packageManager.install)}...`);
    await execAsync(`${settings.packageManager.install}`, { cwd: settings.dir });
    this.spinner.succeed(`Packages successfully installed!`);
  }
}

export { InstallPackagesStage };
