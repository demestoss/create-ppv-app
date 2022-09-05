interface PackageManager {
  name: string;
  installed: boolean;
  lockFile: string;
  command: string;
}

class BasePackageManager implements PackageManager {
  name: string = "";
  installed: boolean = false;
  lockFile: string = "";
  command: string = "";
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

export { NpmPackageManager, PnpmPackageManager, YarnPackageManager };
export type { PackageManager };
