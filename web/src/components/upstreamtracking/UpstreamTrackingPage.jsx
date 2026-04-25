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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
  Banner,
  Button,
  Card,
  Collapse,
  Descriptions,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import {
  authHeader,
  getUserIdFromLocalStorage,
  isAdmin,
  showError,
  showSuccess,
} from '../../helpers';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const defaultOverview = {
  startVersion: '',
  lastSyncedVersion: '',
  intervalDays: 0,
  repo: '',
  baseBranch: '',
  executedAt: 0,
  updateSummary: '',
  hasSimilarLocalWork: false,
  localWorkSummary: '',
  shouldMerge: 'observe',
  mergeReason: '',
  mergeStrategy: 'observe_only',
  mergePlanSummary: '',
  targetFiles: [],
  targetAreas: [],
  riskSummary: '',
};

const defaultSelectedDetail = {
  id: null,
  cycleCode: '',
  status: '',
  executedAt: 0,
  updateSummary: '',
  hasSimilarLocalWork: false,
  localWorkSummary: '',
  shouldMerge: 'observe',
  mergeReason: '',
  mergeStrategy: 'observe_only',
  mergePlanSummary: '',
  targetFiles: [],
  targetAreas: [],
  riskSummary: '',
  decisionStatus: '',
  decisionNote: '',
  actions: [],
  contexts: [],
};

function formatContextContent(content) {
  if (!content) return '-';
  const text = String(content).trim();
  if (text === '') return '-';
  if (
    (text.startsWith('{') && text.endsWith('}')) ||
    (text.startsWith('[') && text.endsWith(']'))
  ) {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }
  return text;
}

function getContextTypeColor(type) {
  switch (type) {
    case 'upstream_commits':
      return 'blue';
    case 'upstream_compare':
      return 'green';
    case 'ald_memory_context':
      return 'purple';
    case 'analysis_prompt':
      return 'orange';
    case 'analysis_response':
      return 'red';
    default:
      return 'grey';
  }
}

function getContextTypeLabel(type, t) {
  switch (type) {
    case 'analysis_response':
      return t('分析结论输出');
    case 'upstream_compare':
      return t('上游差异摘要');
    case 'ald_memory_context':
      return t('ALD 记忆上下文');
    case 'upstream_commits':
      return t('上游提交列表');
    case 'analysis_prompt':
      return t('分析提示词');
    default:
      return type || t('未分类');
  }
}

function getContextTypePriority(type) {
  switch (type) {
    case 'analysis_response':
      return 1;
    case 'upstream_compare':
      return 2;
    case 'ald_memory_context':
      return 3;
    case 'upstream_commits':
      return 4;
    case 'analysis_prompt':
      return 5;
    default:
      return 99;
  }
}

function getContextTypeDescription(type, t) {
  switch (type) {
    case 'analysis_response':
      return t('优先阅读：这里是模型最终给出的结构化评估结果。');
    case 'upstream_compare':
      return t('建议其次阅读：这里汇总了 upstream 本次变更的文件级差异。');
    case 'ald_memory_context':
      return t('用于判断 ALD 现有规则和知识库是否已经覆盖类似优化。');
    case 'upstream_commits':
      return t('提供本次上游提交列表，适合快速回看变更范围。');
    case 'analysis_prompt':
      return t('需要核对模型输入时再展开，通常不必先看。');
    default:
      return t('作为补充证据保留，按需展开查看。');
  }
}

function buildContextGroups(contexts) {
  if (!Array.isArray(contexts) || contexts.length === 0) {
    return [];
  }

  const groups = [];
  const groupMap = new Map();

  contexts.forEach((item) => {
    const key = item?.contextType || 'unknown';
    if (!groupMap.has(key)) {
      const nextGroup = {
        key,
        items: [],
      };
      groupMap.set(key, nextGroup);
      groups.push(nextGroup);
    }
    groupMap.get(key).items.push(item);
  });

  groups.sort(
    (left, right) =>
      getContextTypePriority(left.key) - getContextTypePriority(right.key),
  );

  return groups;
}

function StateMessageCard({ title, message }) {
  return (
    <Card style={{ width: '100%' }}>
      <Title heading={5}>{title}</Title>
      <Text type='secondary'>{message}</Text>
    </Card>
  );
}

const defaultConfig = {
  configured: false,
  maskedValue: '',
  enabled: false,
  repoOwner: '',
  repoName: '',
  baseBranch: '',
  provider: '',
  model: '',
  baseUrl: '',
  scheduleMode: '',
  analysisScope: '',
};

function getConfigPlaceholder(value, fallbackText) {
  const text = String(value || '').trim();
  if (text !== '') {
    return text;
  }
  return fallbackText;
}

function formatDateTime(timestamp) {
  if (!timestamp) return '-';

  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp) || numericTimestamp <= 0) {
    return '-';
  }

  const normalizedTimestamp =
    numericTimestamp > 1e12 ? numericTimestamp : numericTimestamp * 1000;

  const date = new Date(normalizedTimestamp);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getMergeDecisionColor(value) {
  switch (String(value || '').toLowerCase()) {
    case 'merge':
    case 'recommended':
    case 'accept':
    case 'accepted':
      return 'green';
    case 'partial':
    case 'observe':
    case 'pending':
      return 'blue';
    case 'reject':
    case 'rejected':
    case 'ignore':
      return 'red';
    default:
      return 'grey';
  }
}

function renderValueList(items, emptyText) {
  if (!Array.isArray(items) || items.length === 0) {
    return <Text type='tertiary'>{emptyText}</Text>;
  }

  return (
    <Space wrap spacing={8}>
      {items.map((item) => (
        <Tag key={item} color='white' shape='circle'>
          {item}
        </Tag>
      ))}
    </Space>
  );
}

function SectionCard({ title, description, children, tone = 'default' }) {
  const backgroundColor =
    tone === 'muted'
      ? 'var(--semi-color-fill-0)'
      : tone === 'subtle'
        ? 'var(--semi-color-bg-2)'
        : 'transparent';

  return (
    <div
      style={{
        width: '100%',
        padding: 16,
        background: backgroundColor,
        border: '1px solid var(--semi-color-border)',
        borderRadius: 12,
      }}
    >
      <Space vertical align='start' spacing={12} style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
          <Title heading={6} style={{ marginBottom: 6 }}>
            {title}
          </Title>
          {description ? (
            <Text type='secondary' style={{ display: 'block' }}>
              {description}
            </Text>
          ) : null}
        </div>
        {children}
      </Space>
    </div>
  );
}

function getDirectBackendBaseUrl() {
  return `${window.location.protocol}//${window.location.hostname}:3000`;
}

function normalizeHistoryItem(item) {
  return {
    id: item?.id ?? null,
    title: item?.title || item?.summary || item?.cycle_code || '-',
    cycleCode: item?.cycleCode || item?.cycle_code || '',
    status: item?.status || '',
    executedAt: item?.executedAt || item?.analysis_finished_at || 0,
    updateSummary: item?.updateSummary || item?.summary || '',
    shouldMerge: item?.shouldMerge || item?.recommendation_level || '',
    mergeStrategy: item?.mergeStrategy || '',
    decisionStatus: item?.decisionStatus || item?.decision_status || '',
  };
}

function normalizeAction(item) {
  return {
    id: item?.id ?? null,
    cycleId: item?.cycleId ?? item?.cycle_id ?? null,
    title: item?.title || '',
    category: item?.category || '',
    recommendation: item?.recommendation || '',
    priority: item?.priority || '',
    status: item?.status || '',
    targetArea: item?.targetArea || item?.target_area || '',
    note: item?.note || '',
  };
}

function normalizeContext(item) {
  return {
    id: item?.id ?? null,
    contextType: item?.contextType || item?.context_type || '',
    content: item?.content || '',
    contentMeta: item?.contentMeta || item?.content_meta || '',
  };
}

function normalizeSelectedDetail(detail, fallbackItem) {
  if (!detail && !fallbackItem) {
    return null;
  }

  return {
    ...defaultSelectedDetail,
    id: detail?.id ?? fallbackItem?.id ?? null,
    cycleCode:
      detail?.cycleCode || detail?.cycle_code || fallbackItem?.cycleCode || '',
    status: detail?.status || fallbackItem?.status || '',
    executedAt: detail?.executedAt || fallbackItem?.executedAt || 0,
    updateSummary:
      detail?.updateSummary ||
      fallbackItem?.updateSummary ||
      fallbackItem?.title ||
      '',
    hasSimilarLocalWork: Boolean(detail?.hasSimilarLocalWork),
    localWorkSummary: detail?.localWorkSummary || '',
    shouldMerge:
      detail?.shouldMerge ||
      fallbackItem?.shouldMerge ||
      detail?.recommendation_level ||
      'observe',
    mergeReason: detail?.mergeReason || detail?.recommendation_text || '',
    mergeStrategy: detail?.mergeStrategy || '',
    mergePlanSummary: detail?.mergePlanSummary || '',
    targetFiles: Array.isArray(detail?.targetFiles) ? detail.targetFiles : [],
    targetAreas: Array.isArray(detail?.targetAreas) ? detail.targetAreas : [],
    riskSummary: detail?.riskSummary || detail?.risk_summary || '',
    decisionStatus:
      detail?.decisionStatus ||
      fallbackItem?.decisionStatus ||
      detail?.decision_status ||
      '',
    decisionNote: detail?.decisionNote || detail?.decision_note || '',
    actions: Array.isArray(detail?.actions)
      ? detail.actions.map(normalizeAction)
      : [],
    contexts: Array.isArray(detail?.contexts)
      ? detail.contexts.map(normalizeContext)
      : [],
  };
}

function normalizeConfigView(configView) {
  return {
    ...defaultConfig,
    ...configView,
    maskedValue: configView?.maskedValue || configView?.maskedToken || '',
  };
}

function normalizeOverviewView(overviewView) {
  return {
    ...defaultOverview,
    ...overviewView,
    targetFiles: Array.isArray(overviewView?.targetFiles)
      ? overviewView.targetFiles
      : [],
    targetAreas: Array.isArray(overviewView?.targetAreas)
      ? overviewView.targetAreas
      : [],
  };
}

function isUpstreamTrackingAuthFailure(error) {
  const status = error?.response?.status;
  const message = String(
    error?.response?.data?.message || error?.message || '',
  ).toLowerCase();

  if (status === 401) {
    return true;
  }

  return (
    message.includes('not logged in') ||
    message.includes('login has expired') ||
    message.includes('access token invalid') ||
    message.includes('unauthorized')
  );
}

async function requestUpstreamTracking(method, path, data) {
  const headers = {
    ...authHeader(),
    'New-API-User': getUserIdFromLocalStorage(),
    'Cache-Control': 'no-store',
  };

  return axios.request({
    method,
    baseURL: getDirectBackendBaseUrl(),
    url: path,
    data,
    headers,
    withCredentials: true,
  });
}

export default function UpstreamTrackingPage() {
  const { t } = useTranslation();
  const detailRequestRef = useRef(0);
  const selectedCycleIdRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creatingCycle, setCreatingCycle] = useState(false);
  const [runningCycleId, setRunningCycleId] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [overview, setOverview] = useState(defaultOverview);
  const [analysisToken, setAnalysisToken] = useState('');
  const [newCycleSummary, setNewCycleSummary] = useState('');
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedCycleId, setSelectedCycleId] = useState(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [updatingActionId, setUpdatingActionId] = useState(null);
  const [contextsLoading, setContextsLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const latestHistoryItem = historyItems.length > 0 ? historyItems[0] : null;
  const selectedHistoryItem =
    historyItems.find((item) => item.id === selectedCycleId) ||
    latestHistoryItem ||
    null;
  const selectedHistorySummary = selectedHistoryItem
    ? `${selectedHistoryItem.title || t('未命名记录')} · ${formatDateTime(selectedHistoryItem.executedAt)}`
    : '';
  const selectedCycle = useMemo(() => {
    if (!selectedHistoryItem) {
      return null;
    }

    if (selectedDetail?.id === selectedHistoryItem.id) {
      return normalizeSelectedDetail(selectedDetail, selectedHistoryItem);
    }

    return normalizeSelectedDetail(null, selectedHistoryItem);
  }, [selectedDetail, selectedHistoryItem]);
  const selectedCycleActions = selectedCycle?.actions || [];
  const selectedCycleContexts = useMemo(() => {
    const contexts = Array.isArray(selectedCycle?.contexts)
      ? [...selectedCycle.contexts]
      : [];
    contexts.sort((left, right) => {
      const priorityDiff =
        getContextTypePriority(left?.contextType) -
        getContextTypePriority(right?.contextType);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return (left?.id || 0) - (right?.id || 0);
    });
    return contexts;
  }, [selectedCycle?.contexts]);
  const selectedCycleContextGroups = useMemo(
    () => buildContextGroups(selectedCycleContexts),
    [selectedCycleContexts],
  );

  useEffect(() => {
    selectedCycleIdRef.current = selectedCycleId;
  }, [selectedCycleId]);

  const selectCycle = (cycleId) => {
    selectedCycleIdRef.current = cycleId;
    setSelectedCycleId(cycleId);
  };

  const loadCycleDetail = async (cycleId) => {
    if (!cycleId) {
      setSelectedDetail(null);
      return;
    }

    if (selectedDetail?.id === cycleId) {
      return;
    }

    const fallbackItem =
      historyItems.find((item) => item.id === cycleId) || null;
    const requestId = detailRequestRef.current + 1;

    detailRequestRef.current = requestId;
    setSelectedDetail(null);
    setDecisionNote('');

    setDetailLoading(true);
    try {
      const detailRes = await requestUpstreamTracking(
        'get',
        `/api/upstreamtracking/cycles/${cycleId}/detail`,
      );

      if (!detailRes.data.success) {
        return showError(detailRes.data.message || t('加载详情失败'));
      }

      const nextDetail = normalizeSelectedDetail(
        detailRes.data.data,
        fallbackItem,
      );

      if (
        detailRequestRef.current !== requestId ||
        cycleId !== selectedCycleIdRef.current
      ) {
        return;
      }

      setSelectedDetail(nextDetail);
      setDecisionNote(nextDetail?.decisionNote || '');
    } catch (error) {
      if (detailRequestRef.current !== requestId) {
        return;
      }
      if (isUpstreamTrackingAuthFailure(error)) {
        setSessionExpired(true);
        setHistoryItems([]);
        setSelectedDetail(null);
        return;
      }
      showError(error.message || t('加载详情失败'));
    } finally {
      if (detailRequestRef.current === requestId) {
        setDetailLoading(false);
      }
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      setAuthRequired(false);
      setSessionExpired(false);
      setApiUnavailable(false);

      if (!isAdmin()) {
        setAuthRequired(true);
        setOverview(defaultOverview);
        setHistoryItems([]);
        setSelectedDetail(null);
        return;
      }

      const pageRes = await requestUpstreamTracking(
        'get',
        '/api/upstreamtracking/page',
      );

      if (!pageRes.data.success) {
        const message = String(pageRes.data.message || '');
        if (
          isUpstreamTrackingAuthFailure({
            response: { data: { message }, status: 401 },
          })
        ) {
          setSessionExpired(true);
          setOverview(defaultOverview);
          setHistoryItems([]);
          setSelectedDetail(null);
          return;
        }
        showError(message || t('加载失败'));
        return;
      }

      const pageData = pageRes.data.data || {};
      const nextHistoryItems = Array.isArray(pageData.historyItems)
        ? pageData.historyItems.map(normalizeHistoryItem)
        : [];
      const nextSelectedDetail = normalizeSelectedDetail(
        pageData.selectedDetail,
        nextHistoryItems[0],
      );

      setOverview(normalizeOverviewView(pageData.overview));
      setConfig(normalizeConfigView(pageData.configView));
      setHistoryItems(nextHistoryItems);
      setSelectedDetail(nextSelectedDetail);
      selectCycle(nextSelectedDetail?.id ?? nextHistoryItems[0]?.id ?? null);
      setDecisionNote(nextSelectedDetail?.decisionNote || '');
    } catch (error) {
      if (isUpstreamTrackingAuthFailure(error)) {
        setSessionExpired(true);
        setOverview(defaultOverview);
        setHistoryItems([]);
        setSelectedDetail(null);
        return;
      }
      if (error?.response?.status === 404) {
        setApiUnavailable(true);
        setOverview(defaultOverview);
        setHistoryItems([]);
        setSelectedDetail(null);
        return;
      }
      showError(error.message || t('加载失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const payload = {
        enabled: config.enabled,
        repoOwner: config.repoOwner,
        repoName: config.repoName,
        baseBranch: config.baseBranch,
        startVersion: config.startVersion,
        lastSyncedVersion: config.lastSyncedVersion,
        intervalDays: Number(config.intervalDays || 0),
        provider: config.provider,
        model: config.model,
        baseUrl: config.baseUrl,
        scheduleMode: config.scheduleMode,
        analysisScope: config.analysisScope,
      };
      if (analysisToken.trim() !== '') {
        payload.analysisToken = analysisToken.trim();
      }
      const res = await requestUpstreamTracking(
        'put',
        '/api/upstreamtracking/config',
        payload,
      );
      if (!res.data.success)
        return showError(res.data.message || t('保存失败'));
      setConfig(normalizeConfigView(res.data.data));
      setAnalysisToken('');
      showSuccess(t('配置已保存'));
    } catch (error) {
      showError(error.message || t('保存失败'));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCycle = async () => {
    setCreatingCycle(true);
    try {
      const res = await requestUpstreamTracking(
        'post',
        '/api/upstreamtracking/cycles',
        { summary: newCycleSummary.trim() },
      );
      if (!res.data.success) {
        return showError(res.data.message || t('创建周期失败'));
      }
      setNewCycleSummary('');
      showSuccess(t('周期已创建'));
      await loadData();
    } catch (error) {
      showError(error.message || t('创建周期失败'));
    } finally {
      setCreatingCycle(false);
    }
  };

  const handleAnalyzeCycle = async (cycleId) => {
    setRunningCycleId(cycleId);
    try {
      const res = await requestUpstreamTracking(
        'post',
        `/api/upstreamtracking/cycles/${cycleId}/analyze`,
      );
      if (!res.data.success) {
        await loadData();
        return showError(
          res.data.message || t('分析已记录失败原因，请查看最新执行记录'),
        );
      }
      showSuccess(t('分析已完成'));
      await loadData();
    } catch (error) {
      showError(error.message || t('执行分析失败'));
    } finally {
      setRunningCycleId(null);
    }
  };

  const handleDecideCycle = async (decisionStatus) => {
    if (!selectedCycle) return;
    setSubmittingDecision(true);
    try {
      const res = await requestUpstreamTracking(
        'post',
        `/api/upstreamtracking/cycles/${selectedCycle.id}/decision`,
        {
          decisionStatus,
          decisionNote: decisionNote.trim(),
        },
      );
      if (!res.data.success) {
        return showError(res.data.message || t('提交决策失败'));
      }
      showSuccess(t('决策已保存'));
      await loadData();
    } catch (error) {
      showError(error.message || t('提交决策失败'));
    } finally {
      setSubmittingDecision(false);
    }
  };

  const handleUpdateActionStatus = async (action, status) => {
    setUpdatingActionId(action.id);
    try {
      const res = await requestUpstreamTracking(
        'put',
        `/api/upstreamtracking/actions/${action.id}`,
        {
          title: action.title,
          category: action.category,
          recommendation: action.recommendation,
          priority: action.priority,
          status,
          targetArea: action.targetArea,
          note: action.note,
        },
      );
      if (!res.data.success) {
        return showError(res.data.message || t('更新事项失败'));
      }
      showSuccess(t('事项已更新'));
      await loadData();
    } catch (error) {
      showError(error.message || t('更新事项失败'));
    } finally {
      setUpdatingActionId(null);
    }
  };

  const handleLoadContexts = async (cycleId) => {
    if (!cycleId) return;
    setContextsLoading(true);
    try {
      const res = await requestUpstreamTracking(
        'get',
        `/api/upstreamtracking/cycles/${cycleId}/contexts`,
      );
      if (!res.data.success) {
        return showError(res.data.message || t('获取上下文失败'));
      }
      const nextContexts = Array.isArray(res.data.data)
        ? res.data.data.map(normalizeContext)
        : [];
      setSelectedDetail((prev) => {
        if (selectedCycleIdRef.current !== cycleId) {
          return prev;
        }

        const baseDetail =
          prev?.id === cycleId
            ? prev
            : normalizeSelectedDetail(null, selectedHistoryItem);

        if (!baseDetail || baseDetail.id !== cycleId) {
          return prev;
        }

        return normalizeSelectedDetail(
          { ...baseDetail, contexts: nextContexts },
          null,
        );
      });
    } catch (error) {
      showError(error.message || t('获取上下文失败'));
    } finally {
      setContextsLoading(false);
    }
  };

  const cycleColumns = useMemo(
    () => [
      {
        title: t('执行时间'),
        dataIndex: 'executedAt',
        render: (value) => formatDateTime(value),
      },
      { title: t('更新标题'), dataIndex: 'title', ellipsis: true },
      {
        title: t('是否建议合并'),
        dataIndex: 'shouldMerge',
        render: (value) => (
          <Tag color={getMergeDecisionColor(value)}>{value || t('待分析')}</Tag>
        ),
      },
      {
        title: t('合并方式'),
        dataIndex: 'mergeStrategy',
        render: (value) => value || '-',
      },
      {
        title: t('决策状态'),
        dataIndex: 'decisionStatus',
        render: (value) => value || '-',
      },
      {
        title: t('操作'),
        dataIndex: 'id',
        render: (_, record) => (
          <Space>
            <Button
              theme='outline'
              size='small'
              loading={runningCycleId === record.id}
              onClick={() => handleAnalyzeCycle(record.id)}
            >
              {t('执行分析')}
            </Button>
            <Button
              theme={record.id === selectedCycleId ? 'solid' : 'borderless'}
              size='small'
              onClick={() => {
                selectCycle(record.id);
                loadCycleDetail(record.id);
              }}
            >
              {record.id === selectedCycleId ? t('当前查看') : t('查看详情')}
            </Button>
          </Space>
        ),
      },
    ],
    [runningCycleId, selectedCycleId, t],
  );

  const actionColumns = useMemo(
    () => [
      { title: t('标题'), dataIndex: 'title' },
      { title: t('分类'), dataIndex: 'category' },
      { title: t('建议动作'), dataIndex: 'recommendation' },
      { title: t('优先级'), dataIndex: 'priority' },
      { title: t('状态'), dataIndex: 'status' },
      { title: t('目标区域'), dataIndex: 'targetArea' },
      {
        title: t('操作'),
        dataIndex: 'id',
        render: (_, record) => (
          <Space>
            <Button
              size='small'
              theme='outline'
              loading={updatingActionId === record.id}
              onClick={() => handleUpdateActionStatus(record, 'implemented')}
            >
              {t('标记完成')}
            </Button>
            <Button
              size='small'
              theme='borderless'
              loading={updatingActionId === record.id}
              onClick={() => handleUpdateActionStatus(record, 'ignored')}
            >
              {t('标记忽略')}
            </Button>
          </Space>
        ),
      },
    ],
    [t, updatingActionId],
  );

  const contextColumns = useMemo(
    () => [
      {
        title: t('证据类型'),
        dataIndex: 'contextType',
        render: (value) => (
          <Space spacing={8}>
            <Tag color={getContextTypeColor(value)}>
              {getContextTypeLabel(value, t)}
            </Tag>
            <Text type='tertiary'>{value || '-'}</Text>
          </Space>
        ),
      },
      {
        title: t('内容预览'),
        dataIndex: 'content',
        render: (value) => {
          const formatted = formatContextContent(value);
          return formatted.length > 120
            ? `${formatted.slice(0, 120)}...`
            : formatted;
        },
      },
      {
        title: t('阅读建议'),
        dataIndex: 'contextType',
        render: (value) => getContextTypeDescription(value, t),
      },
    ],
    [t],
  );

  const statusContent = useMemo(() => {
    if (authRequired) {
      return {
        title: t('需要管理员权限'),
        message: t(
          '上游跟踪页面当前仅允许管理员访问。请使用管理员账户后再查看分析配置、周期记录和治理建议。',
        ),
      };
    }
    if (sessionExpired) {
      return {
        title: t('管理员登录态已失效'),
        message: t(
          '当前浏览器本地识别到你是管理员，但后端未识别到有效登录态。请重新登录管理员账户后再访问上游跟踪页面。',
        ),
      };
    }
    if (apiUnavailable) {
      return {
        title: t('后端接口未加载'),
        message: t(
          '当前前端页面已更新，但后端尚未加载 upstreamtracking 接口。请重启后端开发服务后再刷新本页。',
        ),
      };
    }
    return null;
  }, [authRequired, sessionExpired, apiUnavailable, t]);

  const renderOverviewTab = () => (
    <Space vertical align='start' style={{ width: '100%' }} spacing='medium'>
      <Card style={{ width: '100%' }}>
        <Title heading={5}>{t('当前跟随基线')}</Title>
        <Descriptions
          row
          data={[
            {
              key: 'startVersion',
              label: t('起始跟随版本'),
              value: overview.startVersion || '-',
            },
            {
              key: 'lastSyncedVersion',
              label: t('最近一次跟随优化版本'),
              value: overview.lastSyncedVersion || '-',
            },
            {
              key: 'intervalDays',
              label: t('跟踪周期（天）'),
              value: overview.intervalDays
                ? String(overview.intervalDays)
                : '-',
            },
            {
              key: 'repo',
              label: t('上游仓库'),
              value: overview.repo || '-',
            },
            {
              key: 'branch',
              label: t('基线分支'),
              value: overview.baseBranch || '-',
            },
          ]}
        />
      </Card>
      <Card style={{ width: '100%' }}>
        <Title heading={5}>{t('本周期执行')}</Title>
        <Text type='secondary'>
          {t(
            '创建一个新的跟踪周期后，系统会读取本周期内的 upstream 提交，并结合 ALD 知识库输出是否建议合并及合并方式。',
          )}
        </Text>
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          <Input
            value={newCycleSummary}
            onChange={setNewCycleSummary}
            placeholder={t('例如：评估 upstream 本周 relay 修复')}
            style={{ maxWidth: 480 }}
          />
          <Button
            type='primary'
            loading={creatingCycle}
            onClick={handleCreateCycle}
          >
            {t('创建周期')}
          </Button>
          <Button theme='outline' onClick={loadData}>
            {t('刷新数据')}
          </Button>
        </div>
      </Card>
      <Card style={{ width: '100%' }}>
        <Title heading={5}>{t('本次更新摘要')}</Title>
        {overview.updateSummary ||
        overview.riskSummary ||
        overview.shouldMerge ||
        latestHistoryItem ? (
          <Space
            vertical
            align='start'
            style={{ width: '100%' }}
            spacing='medium'
          >
            <Descriptions
              row
              data={[
                {
                  key: 'executedAt',
                  label: t('本次执行时间'),
                  value: formatDateTime(
                    overview.executedAt || latestHistoryItem?.executedAt || 0,
                  ),
                },
                {
                  key: 'updateSummary',
                  label: t('本次更新说明'),
                  value: overview.updateSummary || '-',
                },
                {
                  key: 'localWork',
                  label: t('是否已有类似本地优化'),
                  value: overview.hasSimilarLocalWork
                    ? t('已有，需要对照现状')
                    : t('暂无明显重复优化'),
                },
                {
                  key: 'shouldMerge',
                  label: t('是否建议合并'),
                  value: (
                    <Tag color={getMergeDecisionColor(overview.shouldMerge)}>
                      {overview.shouldMerge || t('待分析')}
                    </Tag>
                  ),
                },
                {
                  key: 'riskSummary',
                  label: t('风险摘要'),
                  value: overview.riskSummary || '-',
                },
              ]}
            />
            <div
              style={{
                width: '100%',
                padding: 16,
                background: 'var(--semi-color-fill-0)',
                border: '1px solid var(--semi-color-border)',
                borderRadius: 12,
              }}
            >
              <Text strong>{t('本地优化判断')}</Text>
              <Text type='secondary' style={{ display: 'block', marginTop: 8 }}>
                {overview.localWorkSummary || t('当前尚未沉淀本地优化摘要。')}
              </Text>
            </div>
          </Space>
        ) : (
          <Text type='tertiary'>
            {t(
              '暂无本周期分析结果，创建并执行分析后会在这里显示是否建议合并及合并方式。',
            )}
          </Text>
        )}
      </Card>
      <Card style={{ width: '100%' }}>
        <Title heading={5}>{t('合并建议')}</Title>
        {overview.mergeReason ||
        overview.mergeStrategy ||
        overview.targetFiles.length > 0 ? (
          <Space
            vertical
            align='start'
            style={{ width: '100%' }}
            spacing='medium'
          >
            <Descriptions
              row
              data={[
                {
                  key: 'mergeStrategy',
                  label: t('合并方式建议'),
                  value: overview.mergeStrategy || '-',
                },
                {
                  key: 'mergeReason',
                  label: t('合并理由'),
                  value: overview.mergeReason || '-',
                },
              ]}
            />
            <div style={{ width: '100%' }}>
              <Text strong>{t('建议修改文件')}</Text>
              <div style={{ marginTop: 8 }}>
                {renderValueList(
                  overview.targetFiles,
                  t('当前没有明确列出的建议修改文件。'),
                )}
              </div>
            </div>
            <div style={{ width: '100%' }}>
              <Text strong>{t('建议影响模块')}</Text>
              <div style={{ marginTop: 8 }}>
                {renderValueList(
                  overview.targetAreas,
                  t('当前没有明确列出的建议影响模块。'),
                )}
              </div>
            </div>
          </Space>
        ) : (
          <Text type='tertiary'>
            {t(
              '暂无合并建议，完成一次分析后会在这里汇总建议方式、理由和预计影响范围。',
            )}
          </Text>
        )}
      </Card>
    </Space>
  );

  const renderHistoryTab = () => (
    <Space vertical align='start' style={{ width: '100%' }} spacing='medium'>
      <Card style={{ width: '100%' }}>
        <Title heading={5}>{t('执行记录列表')}</Title>
        <Table
          rowKey='id'
          columns={cycleColumns}
          dataSource={historyItems}
          pagination={false}
          empty={
            <Text type='tertiary'>
              {t('暂无周期记录，后续分析结果会显示在这里')}
            </Text>
          }
        />
      </Card>
      <Card style={{ width: '100%' }}>
        <Space
          vertical
          align='start'
          spacing={6}
          style={{ width: '100%', marginBottom: 12 }}
        >
          <Title heading={5} style={{ margin: 0 }}>
            {t('执行记录详情')}
          </Title>
          <Text type='secondary'>
            {selectedHistorySummary ||
              t('在上方选择一条执行记录后，这里会显示对应的详细结论与证据。')}
          </Text>
        </Space>
        {selectedCycle ? (
          <Spin spinning={detailLoading}>
            <Space
              vertical
              align='start'
              style={{ width: '100%' }}
              spacing='large'
            >
              <Descriptions
                row
                data={[
                  {
                    key: 'executedAt',
                    label: t('执行时间'),
                    value: formatDateTime(selectedCycle.executedAt),
                  },
                  {
                    key: 'status',
                    label: t('执行状态'),
                    value: selectedCycle.status || '-',
                  },
                  {
                    key: 'shouldMerge',
                    label: t('是否建议合并'),
                    value: (
                      <Tag
                        color={getMergeDecisionColor(selectedCycle.shouldMerge)}
                      >
                        {selectedCycle.shouldMerge || t('待分析')}
                      </Tag>
                    ),
                  },
                  {
                    key: 'mergeStrategy',
                    label: t('合并方式'),
                    value: selectedCycle.mergeStrategy || '-',
                  },
                ]}
              />
              <SectionCard
                title={t('结论摘要')}
                description={t(
                  '先看这次执行得出了什么判断，再决定是否继续处理。',
                )}
                tone='muted'
              >
                <Descriptions
                  row
                  data={[
                    {
                      key: 'updateSummary',
                      label: t('本次更新说明'),
                      value: selectedCycle.updateSummary || '-',
                    },
                    {
                      key: 'localWork',
                      label: t('ALD 是否已有类似优化'),
                      value: selectedCycle.hasSimilarLocalWork
                        ? selectedCycle.localWorkSummary ||
                          t('已有类似优化，需要对照现状处理。')
                        : selectedCycle.localWorkSummary ||
                          t('暂无明显类似优化。'),
                    },
                    {
                      key: 'riskSummary',
                      label: t('失败/风险记录'),
                      value: selectedCycle.riskSummary || '-',
                    },
                  ]}
                />
              </SectionCard>
              <SectionCard
                title={t('合并建议')}
                description={t(
                  '这里说明为什么建议这样合并，以及预计会影响哪些文件和区域。',
                )}
                tone='subtle'
              >
                <Descriptions
                  row
                  data={[
                    {
                      key: 'mergeReason',
                      label: t('合并原因'),
                      value: selectedCycle.mergeReason || '-',
                    },
                    {
                      key: 'mergePlanSummary',
                      label: t('合并方式说明'),
                      value: selectedCycle.mergePlanSummary || '-',
                    },
                    {
                      key: 'targets',
                      label: t('建议修改文件/区域'),
                      value:
                        selectedCycle.targetFiles.length > 0 ||
                        selectedCycle.targetAreas.length > 0 ? (
                          <Space vertical align='start' spacing={6}>
                            <div>
                              {renderValueList(
                                selectedCycle.targetFiles,
                                t('暂无建议修改文件'),
                              )}
                            </div>
                            <div>
                              {renderValueList(
                                selectedCycle.targetAreas,
                                t('暂无建议修改区域'),
                              )}
                            </div>
                          </Space>
                        ) : (
                          '-'
                        ),
                    },
                  ]}
                />
              </SectionCard>
              <div
                style={{
                  width: '100%',
                  padding: 16,
                  border: '1px dashed var(--semi-color-border)',
                  borderRadius: 12,
                }}
              >
                <Title heading={6} style={{ marginBottom: 12 }}>
                  {t('决策与操作')}
                </Title>
                <Text
                  type='secondary'
                  style={{ display: 'block', marginBottom: 12 }}
                >
                  {t(
                    '确认建议后，在这里留下当前判断，并决定是否继续查看证据链。',
                  )}
                </Text>
                <Descriptions
                  row
                  data={[
                    {
                      key: 'decisionRecord',
                      label: t('当前决策记录'),
                      value:
                        selectedCycle.decisionStatus ||
                        selectedCycle.decisionNote ? (
                          <Space vertical align='start' spacing={4}>
                            <Text>{selectedCycle.decisionStatus || '-'}</Text>
                            <Text type='secondary'>
                              {selectedCycle.decisionNote || t('暂无补充说明')}
                            </Text>
                          </Space>
                        ) : (
                          '-'
                        ),
                    },
                  ]}
                />
                <div style={{ marginTop: 16, width: '100%' }}>
                  <Input
                    value={decisionNote}
                    onChange={setDecisionNote}
                    placeholder={t(
                      '输入本次决策记录，例如：本次建议只同步 relay 修复，不直接复制上游结构',
                    )}
                    style={{ maxWidth: 520, marginBottom: 12 }}
                  />
                  <Space>
                    <Button
                      type='primary'
                      loading={submittingDecision}
                      onClick={() => handleDecideCycle('accepted')}
                    >
                      {t('接受建议')}
                    </Button>
                    <Button
                      theme='outline'
                      loading={submittingDecision}
                      onClick={() => handleDecideCycle('partial')}
                    >
                      {t('部分接受')}
                    </Button>
                    <Button
                      theme='borderless'
                      loading={submittingDecision}
                      onClick={() => handleDecideCycle('rejected')}
                    >
                      {t('暂不跟进')}
                    </Button>
                    <Button
                      theme='outline'
                      loading={contextsLoading}
                      onClick={() => handleLoadContexts(selectedCycle.id)}
                    >
                      {t('加载上下文')}
                    </Button>
                  </Space>
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  paddingTop: 16,
                  borderTop: '1px solid var(--semi-color-border)',
                }}
              >
                <Title heading={6} style={{ marginBottom: 12 }}>
                  {t('从属事项')}
                </Title>
                <Text
                  type='secondary'
                  style={{ display: 'block', marginBottom: 12 }}
                >
                  {t('这里集中展示本次执行记录衍生出的后续处理事项。')}
                </Text>
                <Table
                  rowKey='id'
                  columns={actionColumns}
                  dataSource={selectedCycleActions}
                  pagination={false}
                  empty={
                    <Text type='tertiary'>
                      {t(
                        '暂无从属事项，后续分析建议产出的处理项会在这里集中展示。',
                      )}
                    </Text>
                  }
                />
              </div>
              <div
                style={{
                  width: '100%',
                  paddingTop: 16,
                  borderTop: '1px solid var(--semi-color-border)',
                }}
              >
                <Space
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <Title heading={6} style={{ marginBottom: 12 }}>
                    {t('本次分析证据链')}
                  </Title>
                  <Text type='secondary'>
                    {t('作为详情从属信息保留，按需展开审阅。')}
                  </Text>
                </Space>
                <Text
                  type='secondary'
                  style={{ display: 'block', marginBottom: 12 }}
                >
                  {t(
                    '证据链放在最后，方便按需核对 upstream 提交、compare、知识库和分析输出，不打断前面的结论阅读。',
                  )}
                </Text>
                <Table
                  rowKey='id'
                  columns={contextColumns}
                  dataSource={selectedCycleContexts}
                  pagination={false}
                  empty={
                    <Text type='tertiary'>
                      {t(
                        '暂无已加载证据链，点击上方“加载上下文”后可查看本次 upstream 提交、compare、知识库和分析输出。',
                      )}
                    </Text>
                  }
                />
                {selectedCycleContextGroups.length > 0 && (
                  <Space
                    vertical
                    align='start'
                    style={{ width: '100%', marginTop: 16 }}
                    spacing='medium'
                  >
                    {selectedCycleContextGroups.map((group) => (
                      <SectionCard
                        key={group.key}
                        title={getContextTypeLabel(group.key, t)}
                        description={getContextTypeDescription(group.key, t)}
                        tone='muted'
                      >
                        <Text type='tertiary'>
                          {t('该分组共 {{count}} 条证据。', {
                            count: group.items.length,
                          })}
                        </Text>
                        <Collapse style={{ width: '100%' }}>
                          {group.items.map((item) => {
                            const formattedContent = formatContextContent(
                              item.content,
                            );
                            return (
                              <Collapse.Panel
                                key={item.id}
                                itemKey={String(item.id)}
                                header={
                                  <Space
                                    vertical
                                    align='start'
                                    spacing={4}
                                    style={{ width: '100%' }}
                                  >
                                    <Space>
                                      <Tag
                                        color={getContextTypeColor(
                                          item.contextType,
                                        )}
                                      >
                                        {getContextTypeLabel(
                                          item.contextType,
                                          t,
                                        )}
                                      </Tag>
                                      <Text type='tertiary'>
                                        {item.contextType}
                                      </Text>
                                    </Space>
                                    <Text type='secondary'>
                                      {formattedContent.length > 80
                                        ? `${formattedContent.slice(0, 80)}...`
                                        : formattedContent}
                                    </Text>
                                  </Space>
                                }
                              >
                                <pre
                                  style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    margin: 0,
                                    fontSize: 12,
                                    lineHeight: 1.6,
                                    maxHeight: 360,
                                    overflowY: 'auto',
                                  }}
                                >
                                  {formattedContent}
                                </pre>
                              </Collapse.Panel>
                            );
                          })}
                        </Collapse>
                      </SectionCard>
                    ))}
                  </Space>
                )}
              </div>
            </Space>
          </Spin>
        ) : (
          <Text type='tertiary'>
            {t('暂无历史分析详情，请先在上方选择一个周期')}
          </Text>
        )}
      </Card>
    </Space>
  );

  const renderConfigTab = () => (
    <Space vertical align='start' style={{ width: '100%' }} spacing='medium'>
      <Card style={{ width: '100%' }}>
        <Title heading={5}>{t('当前使用中配置')}</Title>
        <Text type='secondary' style={{ display: 'block', marginBottom: 16 }}>
          {t('先确认当前跟随基线，再按需展开高级分析配置。')}
        </Text>
        <Descriptions
          row
          data={[
            {
              key: 'startVersion',
              label: t('起始跟随版本'),
              value: config.startVersion || '-',
            },
            {
              key: 'lastSyncedVersion',
              label: t('最近一次跟随优化版本'),
              value: config.lastSyncedVersion || '-',
            },
            {
              key: 'intervalDays',
              label: t('跟踪周期（天）'),
              value: config.intervalDays ? String(config.intervalDays) : '-',
            },
            {
              key: 'enabled',
              label: t('启用上游跟踪'),
              value: config.enabled ? t('已启用') : t('未启用'),
            },
            {
              key: 'repoOwner',
              label: t('仓库 Owner'),
              value: config.repoOwner || '-',
            },
            {
              key: 'repoName',
              label: t('仓库名称'),
              value: config.repoName || '-',
            },
            {
              key: 'baseBranch',
              label: t('基线分支'),
              value: config.baseBranch || '-',
            },
            {
              key: 'provider',
              label: t('分析提供商'),
              value: config.provider || '-',
            },
            {
              key: 'model',
              label: t('分析模型'),
              value: config.model || '-',
            },
            {
              key: 'baseUrl',
              label: t('分析 Base URL'),
              value: config.baseUrl || '-',
            },
            {
              key: 'analysisScope',
              label: t('分析范围'),
              value: config.analysisScope || '-',
            },
            {
              key: 'token',
              label: t('分析 Token'),
              value: config.configured
                ? config.maskedValue || t('已配置')
                : t('未配置'),
            },
          ]}
        />
      </Card>

      <Card style={{ width: '100%' }}>
        <Title heading={5}>{t('编辑配置')}</Title>
        <Form layout='vertical'>
          <Title heading={6}>{t('业务字段')}</Title>
          <Form.Input
            field='startVersion'
            label={t('起始跟随版本')}
            value={config.startVersion}
            placeholder={getConfigPlaceholder(config.startVersion, 'v0.12.14')}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, startVersion: value }))
            }
          />
          <Form.Input
            field='lastSyncedVersion'
            label={t('最近一次跟随优化版本')}
            value={config.lastSyncedVersion}
            placeholder={getConfigPlaceholder(
              config.lastSyncedVersion,
              'v0.12.14-5-gf995a868',
            )}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, lastSyncedVersion: value }))
            }
          />
          <Form.Input
            field='intervalDays'
            label={t('跟踪周期（天）')}
            value={config.intervalDays}
            placeholder={getConfigPlaceholder(config.intervalDays, '1')}
            onChange={(value) =>
              setConfig((prev) => ({ ...prev, intervalDays: value }))
            }
          />

          <Collapse style={{ marginTop: 16 }}>
            <Collapse.Panel itemKey='advanced' header={t('高级分析配置')}>
              <Space
                vertical
                align='start'
                style={{ width: '100%' }}
                spacing='medium'
              >
                <Form.Switch
                  field='enabled'
                  label={t('启用上游跟踪')}
                  checked={config.enabled}
                  onChange={(value) =>
                    setConfig((prev) => ({ ...prev, enabled: value }))
                  }
                />
                <Text type='tertiary'>
                  {t(
                    '关闭后会停止新的上游分析，但不会删除已有执行记录与历史结论。',
                  )}
                </Text>
                <Form.Input
                  field='repoOwner'
                  label={t('仓库 Owner')}
                  value={config.repoOwner}
                  placeholder={getConfigPlaceholder(
                    config.repoOwner,
                    'Calcium-Ion',
                  )}
                  onChange={(value) =>
                    setConfig((prev) => ({ ...prev, repoOwner: value }))
                  }
                />
                <Form.Input
                  field='repoName'
                  label={t('仓库名称')}
                  value={config.repoName}
                  placeholder={getConfigPlaceholder(config.repoName, 'new-api')}
                  onChange={(value) =>
                    setConfig((prev) => ({ ...prev, repoName: value }))
                  }
                />
                <Form.Input
                  field='baseBranch'
                  label={t('基线分支')}
                  value={config.baseBranch}
                  placeholder={getConfigPlaceholder(config.baseBranch, 'main')}
                  onChange={(value) =>
                    setConfig((prev) => ({ ...prev, baseBranch: value }))
                  }
                />
                <Form.Input
                  field='provider'
                  label={t('分析提供商')}
                  value={config.provider}
                  placeholder={getConfigPlaceholder(
                    config.provider,
                    'DeepSeek',
                  )}
                  onChange={(value) =>
                    setConfig((prev) => ({ ...prev, provider: value }))
                  }
                />
                <Form.Input
                  field='model'
                  label={t('分析模型')}
                  value={config.model}
                  placeholder={getConfigPlaceholder(
                    config.model,
                    t('当前未设置分析模型'),
                  )}
                  onChange={(value) =>
                    setConfig((prev) => ({ ...prev, model: value }))
                  }
                />
                <Form.Input
                  field='baseUrl'
                  label={t('分析 Base URL')}
                  value={config.baseUrl}
                  placeholder={getConfigPlaceholder(
                    config.baseUrl,
                    t('当前未设置分析 Base URL'),
                  )}
                  onChange={(value) =>
                    setConfig((prev) => ({ ...prev, baseUrl: value }))
                  }
                />
                <Text type='tertiary'>
                  {t(
                    '只有在你使用自定义 DeepSeek 兼容地址时才需要填写；留空则使用系统默认地址。',
                  )}
                </Text>
                <Form.Input
                  field='analysisToken'
                  label={t('分析 Token')}
                  placeholder={
                    config.configured
                      ? `${t('当前已配置')}：${config.maskedValue}`
                      : t('请输入新的分析 Token')
                  }
                  value={analysisToken}
                  onChange={setAnalysisToken}
                />
                <Text type='tertiary'>
                  {t(
                    '留空表示保持当前 Token 不变；只有输入新的完整 Token 时才会覆盖旧值。',
                  )}
                </Text>
                <Form.Select
                  field='analysisScope'
                  label={t('分析范围')}
                  value={config.analysisScope}
                  placeholder={getConfigPlaceholder(
                    config.analysisScope,
                    'commits-memory-code',
                  )}
                  optionList={[
                    {
                      label: t('提交记录 + 知识库 + 当前代码'),
                      value: 'commits-memory-code',
                    },
                    { label: t('提交记录 + 知识库'), value: 'commits-memory' },
                    { label: t('仅提交记录'), value: 'commits' },
                  ]}
                  onChange={(value) =>
                    setConfig((prev) => ({ ...prev, analysisScope: value }))
                  }
                />
                <Text type='tertiary'>
                  {t('范围越大，分析更完整，但会消耗更多上下文与执行时间。')}
                </Text>
              </Space>
            </Collapse.Panel>
          </Collapse>

          <Button type='primary' loading={saving} onClick={handleSaveConfig}>
            {t('保存配置')}
          </Button>
        </Form>
      </Card>
    </Space>
  );

  return (
    <div className='mt-[60px] px-2'>
      <Spin spinning={loading}>
        <Space
          vertical
          align='start'
          style={{ width: '100%' }}
          spacing='medium'
        >
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <div>
                <Title heading={3}>{t('上游跟踪与同步评估')}</Title>
                <Text type='secondary'>
                  {t(
                    '该页面用于周期性跟踪 new-api 上游更新，并结合 ALD 本地记忆体系生成同步建议。',
                  )}
                </Text>
              </div>
              <Button
                theme='outline'
                type='primary'
                onClick={() => window.location.reload(true)}
              >
                {t('强制刷新')}
              </Button>
            </div>
          </div>
          <Banner
            type='info'
            fullMode={false}
            description={t(
              '系统只做治理分析与决策支持，不会直接自动拷贝或自动合并上游代码。',
            )}
          />
          <Card style={{ width: '100%' }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} type='line'>
              <TabPane itemKey='overview' tab={t('分析概览')}>
                {statusContent ? (
                  <StateMessageCard
                    title={statusContent.title}
                    message={statusContent.message}
                  />
                ) : (
                  renderOverviewTab()
                )}
              </TabPane>
              <TabPane itemKey='history' tab={t('分析历史')}>
                {statusContent ? (
                  <StateMessageCard
                    title={statusContent.title}
                    message={statusContent.message}
                  />
                ) : (
                  renderHistoryTab()
                )}
              </TabPane>
              <TabPane itemKey='config' tab={t('分析配置')}>
                {statusContent ? (
                  <StateMessageCard
                    title={statusContent.title}
                    message={statusContent.message}
                  />
                ) : (
                  renderConfigTab()
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Space>
      </Spin>
    </div>
  );
}
