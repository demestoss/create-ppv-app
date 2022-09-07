import { ConsoleLogger } from "../logger";
import { AppSpinner } from "../spinner";
import { AppCli } from "./cli";

class MockedCli {
  private readonly appName = "create-ppv-app";
  private argv: string[] = [];
  private manager: string = "npm";
  private _name: string = "";

  noGit() {
    this.argv.push("--noGit");
    return this;
  }

  noInstall() {
    this.argv.push("--noInstall");
    return this;
  }

  yarn() {
    this.manager = "yarn";
    return this;
  }

  pnpm() {
    this.manager = "pnpm";
    return this;
  }

  npm() {
    this.manager = "npm";
    return this;
  }

  name(name: string = "mock-app") {
    this._name = name;
    return this;
  }

  async proceed() {
    const logger = new ConsoleLogger();
    const spinner = new AppSpinner();
    return new AppCli(logger, spinner, this.buildEnv()).proceed(this.buildArgv());
  }

  private buildArgv() {
    return [this.manager, this.appName, this._name, ...this.argv];
  }

  private buildEnv() {
    return {
      ...process.env,
      npm_config_user_agent: this.manager,
    };
  }
}

export { MockedCli };
