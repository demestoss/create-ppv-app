import { singleton } from "tsyringe";
import chalk from "chalk";

interface Logger {
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  success(...args: unknown[]): void;
  infoBold(...args: unknown[]): string;
  warningBold(...args: unknown[]): string;
}

@singleton()
class ConsoleLogger implements Logger {
  error(...args: unknown[]) {
    this.log(chalk.red(...args));
  }

  info(...args: unknown[]) {
    this.log(chalk.blue(...args));
  }

  warn(...args: unknown[]) {
    this.log(chalk.yellow(...args));
  }

  success(...args: unknown[]) {
    this.log(chalk.green(...args));
  }

  infoBold(...args: unknown[]): string {
    return chalk.cyan.bold(...args);
  }

  warningBold(...args: unknown[]): string {
    return chalk.redBright.bold(...args);
  }

  private log(str: string) {
    console.log(str);
  }
}

export { ConsoleLogger };
export type { Logger };
