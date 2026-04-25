import { j as t } from './semi-ui-St01U-q0.js';
import './react-core-4ZwCPCju.js';
import { D as r } from './index-COgVsDoJ.js';
import { u as o } from './i18n-BRm33D3q.js';
import './index-CoIn5CRw.js';
import './tools-Cq0Qq7OB.js';
import './react-components-geJ9h57c.js';
const c = () => {
  const { t: e } = o();
  return t.jsx(r, {
    apiEndpoint: '/api/user-agreement',
    title: e('用户协议'),
    cacheKey: 'user_agreement',
    emptyMessage: e('加载用户协议内容失败...'),
  });
};
export { c as default };
