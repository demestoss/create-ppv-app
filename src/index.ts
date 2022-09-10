#!/usr/bin/env node
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { container } from "./container/container";
import type { Project } from "./project/project";
import type { Logger } from "./logger";
import type { Cli } from "./cli/cli";

@injectable()
class Bootstrap {
  constructor(
    @inject("Logger") private readonly logger: Logger,
    @inject("Cli") private readonly cli: Cli,
    @inject("Project") private readonly project: Project
  ) {}

  async main(argv: string[]) {
    try {
      const projectOptions = await this.cli.proceed(argv);
      await this.project.create(projectOptions);

      process.exit(0);
    } catch (e) {
      this.handleError(e);
      process.exit(1);
    }
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

container.resolve(Bootstrap).main(process.argv);
