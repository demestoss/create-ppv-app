interface Stage {
  proceed(): Promise<void>;
}

export type { Stage };
