import { singleton } from "tsyringe";

interface Environment {
  userAgent: string;
}

@singleton()
class NodeEnvironment implements Environment {
  private readonly env: NodeJS.ProcessEnv = process.env;

  get userAgent() {
    return this.env.npm_config_user_agent || "";
  }
}

export { NodeEnvironment };
export type { Environment };
