import { inject, injectable } from "tsyringe";
import { NameProcessor } from "./processor";
import type { Program } from "./program";
import type { Environment } from "./environment";
import type { ProjectOptions } from "../project/project";
import type { Logger } from "../logger";

interface Cli {
  proceed(argv: string[]): Promise<ProjectOptions>;
}

@injectable()
class AppCli implements Cli {
  private readonly name: NameProcessor;

  constructor(
    @inject("Logger") private readonly logger: Logger,
    @inject("Program") private readonly program: Program,
    @inject("Environment") private readonly env: Environment
  ) {
    this.name = new NameProcessor();
  }

  async proceed(argv: string[]): Promise<ProjectOptions> {
    this.logger.success("Welcome to create-ppv app!");

    const options = this.program.parse(argv);

    const name = await this.name.proceed(options);
    const packageManager = this.env.userAgent || "npm";
    const git = !options.noGit;
    const install = !options.noInstall;

    return { name, git, install, packageManager };
  }
}

export { AppCli };
export type { Cli };
