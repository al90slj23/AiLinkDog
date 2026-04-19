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
import { Button } from '@douyinfe/semi-ui';
import fireworks from 'react-fireworks';
import AppDropdownMenu from '../../common/menu/AppDropdownMenu';

const NewYearButton = ({ isNewYear }) => {
  if (!isNewYear) {
    return null;
  }

  const handleNewYearClick = () => {
    fireworks.init('root', {});
    fireworks.start();
    setTimeout(() => {
      fireworks.stop();
    }, 3000);
  };

  return (
    <AppDropdownMenu
      position='bottomRight'
      items={[
        {
          key: 'happy-new-year',
          label: 'Happy New Year!!! 🎉',
          onClick: handleNewYearClick,
        },
      ]}
      trigger={
        <Button
          theme='borderless'
          type='tertiary'
          icon={<span className='text-xl'>🎉</span>}
          aria-label='New Year'
          className='!p-1.5 !text-current focus:!bg-semi-color-fill-1 dark:focus:!bg-gray-700 rounded-full'
        />
      }
    />
  );
};

export default NewYearButton;
