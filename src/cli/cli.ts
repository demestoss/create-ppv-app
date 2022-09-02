import path from "path";
import { Program } from "./program";
import { NameProcessor, PackageManagerProcessor } from "./processor";
import { Logger } from "../logger";
import { Spinner } from "../spinner";
import { ProjectSettings } from "../project/projectSettings";

interface Cli {
  proceed(): Promise<ProjectSettings>;
}

class AppCli implements Cli {
  private readonly program: Program;
  private readonly name: NameProcessor;
  private readonly packageManager: PackageManagerProcessor;

  constructor(private readonly logger: Logger, private readonly spinner: Spinner) {
    this.program = new Program();
    this.name = new NameProcessor(this.logger, this.spinner);
    this.packageManager = new PackageManagerProcessor(this.logger, this.spinner);
  }

  async proceed() {
    const options = this.program.parse(process.argv);

    const name = await this.name.proceed(options);
    const packageManager = await this.packageManager.proceed();
    const dir = path.resolve(process.cwd(), name);
    const git = !options.noGit;
    const install = !options.noInstall;

    return new ProjectSettings(name, dir, git, install, packageManager);
  }
}

export { AppCli };
