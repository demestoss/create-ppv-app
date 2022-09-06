import { inject, injectable } from "tsyringe";
import type { Program } from "./program";
import { NameProcessor } from "./processor";
import type { Environment } from "./environment";
import type { CliOptions } from "../project/projectSettings";

interface Cli {
  proceed(argv: string[]): Promise<CliOptions>;
}

@injectable()
class AppCli implements Cli {
  private readonly name: NameProcessor;

  constructor(
    @inject("Program") private readonly program: Program,
    @inject("Environment") private readonly env: Environment
  ) {
    this.name = new NameProcessor();
  }

  async proceed(argv: string[]): Promise<CliOptions> {
    const options = this.program.parse(argv);

    const name = await this.name.proceed(options);
    const packageManager = this.env.userAgent || "npm";
    const git = !options.noGit;
    const install = !options.noInstall;

    return { name, git, install, packageManager };
  }
}

export { AppCli };
