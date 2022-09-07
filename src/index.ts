#!/usr/bin/env node
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import type { Logger } from "./logger";
import { AppCli } from "./cli/cli";
import { Project } from "./project/project";
import { container } from "./container";
import { PpvProjectSettings } from "./project/projectSettings";
import { ProjectStagesRegister } from "./project/projectStagesRegister";

@injectable()
class Bootstrap {
  constructor(@inject("Logger") private readonly logger: Logger) {}

  async main() {
    try {
      await this.run();
      process.exit(0);
    } catch (e) {
      this.handleError(e);
      process.exit(1);
    }
  }

  private async run() {
    const cli = container.resolve(AppCli);
    const cliOptions = await cli.proceed(process.argv);

    const projectSettings = new PpvProjectSettings(cliOptions);
    container.register("ProjectSettings", { useValue: projectSettings });

    const projectStagesRegister = new ProjectStagesRegister(container);
    projectStagesRegister.register(cliOptions);

    const project = container.resolve(Project);
    await project.proceedStages();
  }

  private handleError(e: unknown) {
    this.logger.error("Aborting installation...");
    if (e instanceof Error) {
      this.logger.error(e);
    } else {
      this.logger.error("An unknown error has occurred");
      this.logger.error(e);
    }
  }
}

container.resolve(Bootstrap).main();
