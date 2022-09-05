import { PackageManager } from "../packageManager";

interface ProjectSettings {
  readonly name: string;
  readonly dir: string;
  readonly git: boolean;
  readonly install: boolean;
  readonly packageManager: PackageManager;
}

class PpvProjectSettings implements ProjectSettings {
  constructor(
    readonly name: string,
    readonly dir: string,
    readonly git: boolean,
    readonly install: boolean,
    readonly packageManager: PackageManager
  ) {}
}

export { PpvProjectSettings };
export type { ProjectSettings };
