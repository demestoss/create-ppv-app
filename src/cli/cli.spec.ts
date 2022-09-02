import { describe, expect, it } from "vitest";
import path from "path";
import { MockedCli } from "./cli.mock";

describe("Parse CLI arguments", () => {
  describe("Npm", async () => {
    it("With name", async () => {
      const result = await new MockedCli().name("mock-app").proceed();
      expect(result.packageManager.name).toBe("npm");
      expect(result.name).toBe("mock-app");
      expect(result.dir).toBe(path.resolve(process.cwd(), "mock-app"));
      expect(result.git).toBe(true);
      expect(result.install).toBe(true);
    });

    it("No git", async () => {
      const result = await new MockedCli().name().noGit().proceed();
      expect(result.git).toBe(false);
    });

    it("No install", async () => {
      const result = await new MockedCli().name().noInstall().proceed();
      expect(result.install).toBe(false);
    });

    it("No git, no install", async () => {
      const result = await new MockedCli().name().noGit().noInstall().proceed();
      expect(result.git).toBe(false);
      expect(result.install).toBe(false);
    });
  });

  describe("Yarn", async () => {
    it("With name", async () => {
      const result = await new MockedCli().yarn().name("mock-app").proceed();
      expect(result.packageManager.name).toBe("yarn");
      expect(result.name).toBe("mock-app");
      expect(result.dir).toBe(path.resolve(process.cwd(), "mock-app"));
      expect(result.git).toBe(true);
      expect(result.install).toBe(true);
    });
  });

  describe("Pnpm", async () => {
    it("With name", async () => {
      const result = await new MockedCli().pnpm().name("mock-app").proceed();
      expect(result.packageManager.name).toBe("pnpm");
      expect(result.name).toBe("mock-app");
      expect(result.dir).toBe(path.resolve(process.cwd(), "mock-app"));
      expect(result.git).toBe(true);
      expect(result.install).toBe(true);
    });
  });
});
