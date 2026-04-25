import { _ as e, l as o, K as i, m as n, L as p } from './index-CoIn5CRw.js';
import { p as m } from './radar-MK3ICKWK-CR6EA1S0.js';
import './semi-ui-St01U-q0.js';
import './react-core-4ZwCPCju.js';
import './i18n-BRm33D3q.js';
import './tools-Cq0Qq7OB.js';
import './react-components-geJ9h57c.js';
import './_baseUniq-CHUFGwGn.js';
import './_basePickBy-DzhG6LJH.js';
import './clone-C-OSllvx.js';
var g = {
    parse: e(async (r) => {
      const a = await m('info', r);
      o.debug(a);
    }, 'parse'),
  },
  v = { version: p.version },
  d = e(() => v.version, 'getVersion'),
  c = { getVersion: d },
  l = e((r, a, s) => {
    o.debug(
      `rendering info diagram
` + r,
    );
    const t = i(a);
    n(t, 100, 400, !0),
      t
        .append('g')
        .append('text')
        .attr('x', 100)
        .attr('y', 40)
        .attr('class', 'version')
        .attr('font-size', 32)
        .style('text-anchor', 'middle')
        .text(`v${s}`);
  }, 'draw'),
  f = { draw: l },
  L = { parser: g, db: c, renderer: f };
export { L as diagram };
