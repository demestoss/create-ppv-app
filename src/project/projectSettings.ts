import path from "path";
import { CliOptions } from "./project";
import { PackageManager, PackageManagerFactory } from "../packageManager";

interface ProjectSettings {
  readonly name: string;
  readonly dir: string;
  readonly packageManager: PackageManager;
}

class PpvProjectSettings implements ProjectSettings {
  readonly name: string;
  readonly dir: string;
  readonly packageManager: PackageManager;

  constructor(cliOptions: CliOptions) {
    this.name = cliOptions.name;
    this.dir = path.resolve(process.cwd(), this.name);
    this.packageManager = PackageManagerFactory.build(cliOptions.packageManager);
  }
}

export { PpvProjectSettings };
export type { ProjectSettings, CliOptions };
