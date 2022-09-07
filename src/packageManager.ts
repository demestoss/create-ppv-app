interface PackageManager {
  name: string;
  installed: boolean;
  lockFile: string;
  command: string;
  install: string;
}

class BasePackageManager implements PackageManager {
  name: string = "";
  installed: boolean = false;
  lockFile: string = "";
  command: string = "";

  get install() {
    // TODO: we need to handle this installation info somewhere else
    this.installed = true;
    return `${this.name} install`;
  }
}

class NpmPackageManager extends BasePackageManager {
  name = "npm";
  lockFile = "package-lock.json";
  command = "npm run dev";
}

class YarnPackageManager extends BasePackageManager {
  name = "yarn";
  lockFile = "yarn.lock";
  command = "yarn dev";
}

class PnpmPackageManager extends BasePackageManager {
  name = "pnpm";
  lockFile = "pnpm-lock.yaml";
  command = "pnpm dev";
}

class PackageManagerFactory {
  static build(packageManager: string) {
    if (packageManager?.startsWith("yarn")) return new YarnPackageManager();
    if (packageManager?.startsWith("pnpm")) return new PnpmPackageManager();

    return new NpmPackageManager();
  }
}

export { PackageManagerFactory };
export type { PackageManager };
