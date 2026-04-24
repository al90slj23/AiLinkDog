import { describe, expect, it, vi } from 'vitest';

vi.mock('../../context/Status', () => ({
  StatusContext: {},
}));

vi.mock('../../helpers', () => ({
  API: { get: vi.fn() },
}));

const { DEFAULT_ADMIN_CONFIG, mergeAdminConfig } = await import('./useSidebar');

describe('DEFAULT_ADMIN_CONFIG', () => {
  it('管理员默认配置包含 statuscenter', () => {
    expect(DEFAULT_ADMIN_CONFIG.admin.statuscenter).toBe(true);
    expect(DEFAULT_ADMIN_CONFIG.personal.statuscenter).toBeUndefined();
  });

  it('用户默认配置包含 monitortargets', () => {
    expect(DEFAULT_ADMIN_CONFIG.personal.monitortargets).toBe(true);
    expect(DEFAULT_ADMIN_CONFIG.admin.monitortargets).toBeUndefined();
  });
});

describe('mergeAdminConfig', () => {
  it('合并旧配置时保留默认的 statuscenter', () => {
    const merged = mergeAdminConfig({
      admin: {
        enabled: true,
        user: false,
      },
    });

    expect(merged.admin).toEqual({
      enabled: true,
      channel: true,
      models: true,
      deployment: true,
      redemption: true,
      user: false,
      subscription: true,
      referralmanage: true,
      setting: true,
      statuscenter: true,
    });
  });

  it('合并旧配置时保留默认的 monitortargets', () => {
    const merged = mergeAdminConfig({
      personal: {
        enabled: true,
        personal: false,
      },
    });

    expect(merged.personal).toEqual({
      enabled: true,
      topup: true,
      personal: false,
      referralcenter: true,
      monitortargets: true,
    });
  });
});
