import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const renderedButtons = [];

vi.mock('@douyinfe/semi-ui', () => {
  const passthrough = ({ children, ...props }) => {
    const {
      bodyStyle,
      extraText,
      gutter,
      hoverable,
      size,
      type,
      xs,
      sm,
      md,
      lg,
      xl,
      ...rest
    } = props;
    return React.createElement('div', rest, children);
  };
  const button = ({ children, loading, ...props }) => {
    renderedButtons.push({ children, ...props });
    return React.createElement('button', props, children);
  };
  const switchComponent = ({ checked, onChange, ...props }) =>
    React.createElement('input', {
      ...props,
      type: 'checkbox',
      checked: Boolean(checked),
      onChange: (event) => onChange?.(event.target.checked),
    });

  return {
    Card: passthrough,
    Form: {
      Section: passthrough,
    },
    Button: button,
    Switch: switchComponent,
    Row: passthrough,
    Col: passthrough,
    Typography: {
      Text: passthrough,
    },
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value) => value,
  }),
}));

const showSuccess = vi.fn();

vi.mock('../../../helpers', () => ({
  API: { put: vi.fn() },
  showSuccess,
  showError: vi.fn(),
}));

vi.mock('../../../context/Status', () => ({
  StatusContext: React.createContext([{ status: {} }, vi.fn()]),
}));

const MODULE_PATH = './SettingsHeaderNavModules';

async function importModuleFresh() {
  vi.resetModules();
  return import(MODULE_PATH);
}

async function importModuleWithUseStateMocks(implementations) {
  vi.resetModules();
  vi.doMock('react', async () => {
    const actual = await vi.importActual('react');
    let callIndex = 0;

    return {
      ...actual,
      useState(initialValue) {
        const implementation = implementations[callIndex];
        callIndex += 1;

        if (implementation) {
          return implementation(initialValue);
        }

        return actual.useState(initialValue);
      },
    };
  });

  return import(MODULE_PATH);
}

beforeEach(() => {
  renderedButtons.length = 0;
  showSuccess.mockReset();
});

describe('SettingsHeaderNavModules', () => {
  it('共享默认结构包含 status true', async () => {
    const { DEFAULT_HEADER_NAV_MODULES } = await importModuleFresh();

    expect(DEFAULT_HEADER_NAV_MODULES).toMatchObject({
      status: true,
    });
  });

  it('初始默认状态包含 status true，且页面包含服务状态文案', async () => {
    const setLoading = vi.fn();
    const setHeaderNavModules = vi.fn();
    const captured = {
      initialModules: null,
    };

    const { default: SettingsHeaderNavModules } =
      await importModuleWithUseStateMocks([
        (initialValue) => [
          typeof initialValue === 'function' ? initialValue() : initialValue,
          setLoading,
        ],
        (initialValue) => {
          captured.initialModules =
            typeof initialValue === 'function' ? initialValue() : initialValue;
          return [captured.initialModules, setHeaderNavModules];
        },
      ]);

    const html = renderToStaticMarkup(
      <SettingsHeaderNavModules options={{}} refresh={vi.fn()} />,
    );

    expect(html).toContain('服务状态');
    expect(captured.initialModules).toMatchObject({
      status: true,
    });
  });

  it('重置为默认后写回 status true', async () => {
    const { DEFAULT_HEADER_NAV_MODULES } = await importModuleFresh();
    const setLoading = vi.fn();
    const setHeaderNavModules = vi.fn();

    const { default: SettingsHeaderNavModules } =
      await importModuleWithUseStateMocks([
        (initialValue) => [
        typeof initialValue === 'function' ? initialValue() : initialValue,
        setLoading,
        ],
        () => [
          {
            ...DEFAULT_HEADER_NAV_MODULES,
            status: false,
            pricing: {
              ...DEFAULT_HEADER_NAV_MODULES.pricing,
            },
          },
          setHeaderNavModules,
        ],
      ]);

    renderToStaticMarkup(
      <SettingsHeaderNavModules options={{}} refresh={vi.fn()} />,
    );

    const resetButton = renderedButtons.find(
      (button) => button.children === '重置为默认',
    );

    resetButton.onClick();

    expect(setHeaderNavModules).toHaveBeenCalledWith(
      expect.objectContaining({
        status: true,
      }),
    );
  });
});
