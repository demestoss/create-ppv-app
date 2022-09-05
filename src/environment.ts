import { fileURLToPath } from "url";
import path from "path";
import { singleton } from "tsyringe";

interface Environment {
  userAgent: string;
  packageRoot: string;
}

@singleton()
class NodeEnvironment implements Environment {
  private readonly env: NodeJS.ProcessEnv = process.env;

  get userAgent() {
    return this.env.npm_config_user_agent || "";
  }

  get packageRoot() {
    const __filename = fileURLToPath(import.meta.url);
    const distPath = path.dirname(__filename);
    return path.join(distPath, "../");
  }
}

export { NodeEnvironment };
export type { Environment };
