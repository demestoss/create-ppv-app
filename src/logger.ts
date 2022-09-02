import chalk from "chalk";

interface Logger {
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  success(...args: unknown[]): void;
}

class AppLogger implements Logger {
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

  private log(str: string) {
    console.log(str);
  }
}

export { AppLogger };
export type { Logger };
