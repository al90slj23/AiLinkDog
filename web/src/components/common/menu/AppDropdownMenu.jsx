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

import React from 'react';

/*
 * 为什么这里不用 Semi UI Dropdown：
 * 在当前项目的 React 18 StrictMode 下，Semi UI Dropdown 经由 Tooltip / Trigger / Button
 * 的内部链路持续触发 findDOMNode 弃用警告。升级 Semi UI 后该问题仍然存在。
 *
 * 这里抽成项目级基础组件，是为了：
 * 1. 保留用户可见的菜单样式与交互体验尽量一致；
 * 2. 避免在各业务文件里重复手写菜单逻辑；
 * 3. 保留全局 StrictMode，而不是为了兼容性噪音关闭开发期检查。
 */

const getPositionClassName = (position) => {
  switch (position) {
    case 'bottomLeft':
      return 'left-0 top-full mt-2';
    case 'bottomRight':
    default:
      return 'right-0 top-full mt-2';
  }
};

const mergeClassNames = (...values) =>
  values.filter(Boolean).join(' ');

const AppDropdownMenu = ({
  trigger,
  items,
  position = 'bottomRight',
  menuClassName = '',
  itemClassName = '',
  panel = null,
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    function handlePointerDown(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const renderedTrigger = React.cloneElement(trigger, {
    onClick: (event) => {
      trigger.props.onClick?.(event);
      setOpen((value) => !value);
    },
  });

  return (
    <div className='relative inline-flex' ref={containerRef}>
      {renderedTrigger}

      {open ? (
        <div
          className={mergeClassNames(
            'absolute z-[1000] min-w-[140px] overflow-hidden rounded-lg border border-semi-color-border bg-semi-color-bg-overlay shadow-lg dark:border-gray-600 dark:bg-gray-700',
            getPositionClassName(position),
            menuClassName,
          )}
        >
          {items?.map((item) => {
            if (item?.type === 'divider') {
              return (
                <div
                  key={item.key || 'divider'}
                  className='my-1 h-px bg-semi-color-border dark:bg-gray-600'
                />
              );
            }

            const activeClass = item.active
              ? '!bg-semi-color-primary-light-default dark:!bg-blue-600 font-semibold'
              : 'hover:bg-semi-color-fill-1 dark:hover:bg-gray-600';

            return (
              <button
                key={item.key}
                type='button'
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={mergeClassNames(
                  'block w-full px-3 py-1.5 text-left text-sm text-semi-color-text-0 dark:text-gray-200',
                  activeClass,
                  itemClassName,
                  item.className,
                )}
              >
                {item.render ? item.render() : item.label}
              </button>
            );
          })}

          {panel ? panel({ close: () => setOpen(false) }) : null}
        </div>
      ) : null}
    </div>
  );
};

export default AppDropdownMenu;
