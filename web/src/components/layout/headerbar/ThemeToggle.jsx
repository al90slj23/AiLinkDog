/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useMemo } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useActualTheme } from '../../../context/Theme';
import AppDropdownMenu from '../../common/menu/AppDropdownMenu';

const ThemeToggle = ({ theme, onThemeToggle, t }) => {
  const actualTheme = useActualTheme();

  const themeOptions = useMemo(
    () => [
      {
        key: 'light',
        icon: <Sun size={18} />,
        buttonIcon: <Sun size={18} />,
        label: t('浅色模式'),
        description: t('始终使用浅色主题'),
      },
      {
        key: 'dark',
        icon: <Moon size={18} />,
        buttonIcon: <Moon size={18} />,
        label: t('深色模式'),
        description: t('始终使用深色主题'),
      },
      {
        key: 'auto',
        icon: <Monitor size={18} />,
        buttonIcon: <Monitor size={18} />,
        label: t('自动模式'),
        description: t('跟随系统主题设置'),
      },
    ],
    [t],
  );

  const currentButtonIcon = useMemo(() => {
    const currentOption = themeOptions.find((option) => option.key === theme);
    return currentOption?.buttonIcon || themeOptions[2].buttonIcon;
  }, [theme, themeOptions]);

  const items = themeOptions.map((option) => ({
    key: option.key,
    active: theme === option.key,
    render: () => (
      <div className='flex items-start gap-2'>
        <span className='mt-0.5'>{option.icon}</span>
        <div className='flex flex-col'>
          <span>{option.label}</span>
          <span className='text-xs text-semi-color-text-2'>
            {option.description}
          </span>
        </div>
      </div>
    ),
    onClick: () => onThemeToggle(option.key),
  }));

  return (
    <AppDropdownMenu
      position='bottomRight'
      items={items}
      panel={
        theme === 'auto'
          ? () => (
              <>
                <div className='my-1 h-px bg-semi-color-border dark:bg-gray-600' />
                <div className='px-3 py-2 text-xs text-semi-color-text-2'>
                  {t('当前跟随系统')}：
                  {actualTheme === 'dark' ? t('深色') : t('浅色')}
                </div>
              </>
            )
          : null
      }
      trigger={
        <Button
          icon={currentButtonIcon}
          aria-label={t('切换主题')}
          theme='borderless'
          type='tertiary'
          className='!p-1.5 !text-current focus:!bg-semi-color-fill-1 !rounded-full !bg-semi-color-fill-0 hover:!bg-semi-color-fill-1'
        />
      }
    />
  );
};

export default ThemeToggle;
