import { inject, injectable } from "tsyringe";
import type { Logger } from "../logger";
import type { ProjectSettings } from "../project/projectSettings";
import type { Stage } from "../project/stagesProcessor";

@injectable()
class GuideStage implements Stage {
  constructor(
    @inject("Logger") private readonly logger: Logger,
    @inject("ProjectSettings") private readonly settings: ProjectSettings
  ) {}

  async proceed() {
    this.logger.info("Next steps:");
    this.logger.info(`  cd ${this.settings.name}`);
    if (!this.settings.packageManager.installed) {
      this.logger.info(`  ${this.settings.name} install`);
    }
    this.logger.info(`  ${this.settings.packageManager.command}`);
  }
}

export { GuideStage };
