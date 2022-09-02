import { PackageManager } from "../packageManager";

class ProjectSettings {
  constructor(
    readonly name: string,
    readonly dir: string,
    readonly git: boolean,
    readonly install: boolean,
    readonly packageManager: PackageManager
  ) {}
}

export { ProjectSettings };
