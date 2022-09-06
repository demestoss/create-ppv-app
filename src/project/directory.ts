import { fileURLToPath } from "url";
import path from "path";
import { singleton } from "tsyringe";

interface Directory {
  packageRoot: string;
}

@singleton()
class ProjectDirectory implements Directory {
  get packageRoot() {
    const __filename = fileURLToPath(import.meta.url);
    const distPath = path.dirname(__filename);
    return path.join(distPath, "../");
  }
}

export { ProjectDirectory };
export type { Directory };
