import { isCI } from 'ci-info';
import { vi } from 'vitest';

if (isCI) {
  vi.spyOn(console, 'info').mockImplementation(() => {});
}
