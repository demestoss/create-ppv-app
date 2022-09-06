#!/usr/bin/env node
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import type { Logger } from "./logger";
import { AppCli } from "./cli/cli";
import { Project } from "./project/project";
import { container } from "./container";
import { PpvProjectSettings } from "./project/projectSettings";

@injectable()
class Bootstrap {
  constructor(@inject("Logger") private readonly logger: Logger) {}

  async main() {
    try {
      await this.run();
    } catch (e) {
      this.handleError(e);
    }
  }

  private async run() {
    this.logger.success("Welcome to create-ppv app!");

    const cli = container.resolve(AppCli);
    const cliOptions = await cli.proceed(process.argv);
    const projectSettings = new PpvProjectSettings(cliOptions);
    container.register("ProjectSettings", { useValue: projectSettings });

    const project = container.resolve(Project);
    await project.proceedStages();

    process.exit(0);
  }

  private handleError(e: unknown) {
    this.logger.error("Aborting installation...");
    if (e instanceof Error) {
      this.logger.error(e);
    } else {
      this.logger.error("An unknown error has occurred");
      this.logger.error(e);
    }

    process.exit(1);
  }
}

container.resolve(Bootstrap).main();
