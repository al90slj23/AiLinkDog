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

export function formatDateTime(value) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString();
}

export function formatQuota(value) {
  if (value === null || value === undefined) {
    return '--';
  }
  return Number(value).toLocaleString();
}

export function getWithdrawalStatusMeta(status, t) {
  switch (status) {
    case 'pending':
      return { label: t('待审核'), color: 'orange' };
    case 'approved':
      return { label: t('已通过'), color: 'green' };
    case 'rejected':
      return { label: t('已拒绝'), color: 'red' };
    case 'processing':
      return { label: t('处理中'), color: 'blue' };
    default:
      return { label: t('状态未知'), color: 'grey' };
  }
}

export function getCommissionStatusMeta(status, t) {
  switch (status) {
    case 'settled':
      return { label: t('已结算'), color: 'green' };
    case 'pending':
      return { label: t('待结算'), color: 'orange' };
    case 'rejected':
      return { label: t('已驳回'), color: 'red' };
    default:
      return { label: t('状态未知'), color: 'grey' };
  }
}
