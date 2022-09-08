import path from "path";
import { ProjectOptions } from "./project";
import { PackageManager, PackageManagerFactory } from "../packageManager";

class ProjectSettings {
  readonly name: string;
  readonly dir: string;
  readonly packageManager: PackageManager;

  constructor(cliOptions: ProjectOptions) {
    this.name = cliOptions.name;
    this.dir = path.resolve(process.cwd(), this.name);
    this.packageManager = PackageManagerFactory.build(cliOptions.packageManager);
  }
}

export { ProjectSettings };
