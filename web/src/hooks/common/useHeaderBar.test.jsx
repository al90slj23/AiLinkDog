import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value) => value,
    i18n: { language: 'zh', on: vi.fn(), off: vi.fn(), changeLanguage: vi.fn() },
  }),
}));

vi.mock('../../context/User', () => ({
  UserContext: {},
}));

vi.mock('../../context/Status', () => ({
  StatusContext: {},
}));

vi.mock('../../context/Theme', () => ({
  useSetTheme: () => vi.fn(),
  useTheme: () => 'light',
  useActualTheme: () => 'light',
}));

vi.mock('../../helpers', () => ({
  getLogo: () => '',
  getSystemName: () => 'AiLinkDog',
  API: { get: vi.fn(), put: vi.fn() },
  showSuccess: vi.fn(),
}));

vi.mock('../../i18n/language', () => ({
  normalizeLanguage: (value) => value,
}));

vi.mock('./useIsMobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('./useSidebarCollapsed', () => ({
  useSidebarCollapsed: () => [false, vi.fn()],
}));

vi.mock('./useMinimumLoadingTime', () => ({
  useMinimumLoadingTime: (value) => value,
}));

const { parseHeaderNavModules } = await import('./useHeaderBar');

describe('parseHeaderNavModules', () => {
  it('为缺少 status 的旧配置补上默认值 true', () => {
    const modules = parseHeaderNavModules('{"home":true}');

    expect(modules).toEqual({
      home: true,
      status: true,
    });
  });

  it('兼容 pricing 为 boolean 的旧配置格式', () => {
    const modules = parseHeaderNavModules('{"pricing":true}');

    expect(modules).toEqual({
      pricing: {
        enabled: true,
        requireAuth: false,
      },
      status: true,
    });
  });

  it('status 明确为 false 时保持 false', () => {
    const modules = parseHeaderNavModules('{"status":false}');

    expect(modules).toEqual({
      status: false,
    });
  });

  it('pricing 已是对象格式时保留原值', () => {
    const modules = parseHeaderNavModules(
      '{"pricing":{"enabled":false,"requireAuth":true}}',
    );

    expect(modules).toEqual({
      pricing: {
        enabled: false,
        requireAuth: true,
      },
      status: true,
    });
  });

  it('解析失败时返回 null', () => {
    expect(parseHeaderNavModules('{')).toBeNull();
  });
});
