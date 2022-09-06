import { PackageManager, PackageManagerFactory } from "../packageManager";
import path from "path";

interface CliOptions {
  name: string;
  git: boolean;
  install: boolean;
  packageManager: string;
}

interface ProjectSettings {
  readonly name: string;
  readonly git: boolean;
  readonly install: boolean;
  readonly dir: string;
  readonly packageManager: PackageManager;
}

class PpvProjectSettings implements ProjectSettings {
  readonly name: string;
  readonly dir: string;
  readonly git: boolean;
  readonly install: boolean;
  readonly packageManager: PackageManager;

  constructor(cliOptions: CliOptions) {
    this.name = cliOptions.name;
    this.git = cliOptions.git;
    this.install = cliOptions.install;
    this.dir = path.resolve(process.cwd(), this.name);
    this.packageManager = PackageManagerFactory.build(cliOptions.packageManager);
  }
}

export { PpvProjectSettings };
export type { ProjectSettings, CliOptions };
