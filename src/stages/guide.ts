import { inject, injectable } from "tsyringe";
import type { Logger } from "../logger";
import type { ProjectSettings } from "../project/projectSettings";
import type { Stage } from "../project/stagesProcessor";

@injectable()
class GuideStage implements Stage {
  constructor(@inject("Logger") private readonly logger: Logger) {}

  async proceed(settings: ProjectSettings) {
    this.logger.info("Next steps:");
    this.logger.info(`  cd ${settings.name}`);
    if (!settings.packageManager.installed) {
      this.logger.info(`  ${settings.name} install`);
    }
    this.logger.info(`  ${settings.packageManager.command}`);
  }
}

export { GuideStage };
