import { inject, injectable } from "tsyringe";
import path from "path";
import { Program } from "./program";
import { NameProcessor, PackageManagerProcessor } from "./processor";
import type { Environment } from "../environment";
import { PpvProjectSettings, ProjectSettings } from "../project/projectSettings";

interface Cli {
  proceed(argv: string[]): Promise<ProjectSettings>;
}

@injectable()
class AppCli implements Cli {
  private readonly program: Program;
  private readonly name: NameProcessor;
  private readonly packageManager: PackageManagerProcessor;

  constructor(@inject("Environment") private readonly env: Environment) {
    this.program = new Program();
    this.name = new NameProcessor();
    this.packageManager = new PackageManagerProcessor(this.env.userAgent);
  }

  async proceed(argv: string[]) {
    const options = this.program.parse(argv);

    const name = await this.name.proceed(options);
    const packageManager = await this.packageManager.proceed();
    const dir = path.resolve(process.cwd(), name);
    const git = !options.noGit;
    const install = !options.noInstall;

    return new PpvProjectSettings(name, dir, git, install, packageManager);
  }
}

export { AppCli };
