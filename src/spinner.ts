import ora, { PersistOptions } from "ora";
import { singleton } from "tsyringe";

interface Spinner {
  start(text?: string): this;
  stop(): this;
  succeed(text?: string): this;
  fail(text?: string): this;
  warn(text?: string): this;
  info(text?: string): this;
  stopAndPersist(options?: PersistOptions): this;
}

@singleton()
class AppSpinner implements Spinner {
  private readonly spinner = ora();

  fail(text?: string): this {
    this.spinner.fail(this.format(text));
    return this;
  }

  info(text?: string): this {
    this.spinner.info(this.format(text));
    return this;
  }

  start(text?: string): this {
    this.spinner.start(this.format(text));
    return this;
  }

  stop(): this {
    this.spinner.stop();
    return this;
  }

  stopAndPersist(options?: PersistOptions): this {
    this.spinner.stopAndPersist(options);
    return this;
  }

  succeed(text?: string): this {
    this.spinner.succeed(this.format(text));
    return this;
  }

  warn(text?: string): this {
    this.spinner.warn(this.format(text));
    return this;
  }

  private format(text?: string) {
    return text ? `${text}\n` : text;
  }
}

export { AppSpinner };
export type { Spinner };
