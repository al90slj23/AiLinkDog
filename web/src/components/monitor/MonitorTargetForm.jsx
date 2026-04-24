import React, { useEffect, useMemo, useState } from 'react';
import { Banner, Button, Card, Form, Space } from '@douyinfe/semi-ui';

const CHANNEL_TEMPLATES = {
  openai: {
    name: 'OpenAI 主监控',
    base_url: 'https://api.openai.com',
    model: 'gpt-4.1-mini',
    tag: 'prod',
  },
  anthropic: {
    name: 'Anthropic 主监控',
    base_url: 'https://api.anthropic.com',
    model: 'claude-3-5-sonnet-latest',
    tag: 'prod',
  },
  gemini: {
    name: 'Gemini 主监控',
    base_url: 'https://generativelanguage.googleapis.com',
    model: 'gemini-2.5-flash',
    tag: 'prod',
  },
};

const DEFAULT_VALUES = {
  name: '',
  channel_type: 'openai',
  base_url: '',
  api_key: '',
  model: '',
  group_name: '',
  tag: '',
  probe_interval_seconds: 300,
  enabled: true,
};

export default function MonitorTargetForm({
  initialValues,
  loading = false,
  submitLabel = '保存',
  error = '',
  onSubmit,
}) {
  const [values, setValues] = useState(DEFAULT_VALUES);

  const mergedValues = useMemo(
    () => ({ ...DEFAULT_VALUES, ...(initialValues || {}) }),
    [initialValues],
  );

  useEffect(() => {
    setValues(mergedValues);
  }, [mergedValues]);

  useEffect(() => {
    if (initialValues) {
      return;
    }
    const template = CHANNEL_TEMPLATES[mergedValues.channel_type] || {};
    setValues((current) => ({
      ...current,
      name: current.name || template.name || '',
      base_url: current.base_url || template.base_url || '',
      model: current.model || template.model || '',
      tag: current.tag || template.tag || '',
    }));
  }, [initialValues, mergedValues.channel_type]);

  const updateField = (field) => (value) => {
    setValues((current) => {
      const nextValues = { ...current, [field]: value };
      if (field !== 'channel_type') {
        return nextValues;
      }
      const template = CHANNEL_TEMPLATES[value] || {};
      return {
        ...nextValues,
        name: current.name || template.name || nextValues.name,
        base_url: current.base_url || template.base_url || nextValues.base_url,
        model: current.model || template.model || nextValues.model,
        tag: current.tag || template.tag || nextValues.tag,
      };
    });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Card>
      <Space vertical align='start' style={{ width: '100%' }}>
        {error ? <Banner type='danger' description={error} /> : null}
        <Form values={values} style={{ width: '100%' }}>
          <Form.Input
            field='name'
            label='名称'
            value={values.name}
            onChange={updateField('name')}
            placeholder='例如：OpenAI 主监控'
          />
          <Form.Input
            field='channel_type'
            label='Channel Type'
            value={values.channel_type}
            onChange={updateField('channel_type')}
            placeholder='例如：openai'
          />
          <Form.Input
            field='base_url'
            label='Base URL'
            value={values.base_url}
            onChange={updateField('base_url')}
            placeholder='https://api.openai.com'
          />
          <Form.Input
            field='api_key'
            label='API Key'
            value={values.api_key}
            onChange={updateField('api_key')}
            type='password'
            autoComplete='new-password'
            placeholder={initialValues?.id ? '留空则保持不变' : '请输入监控使用的 Key'}
          />
          <Form.Input
            field='model'
            label='Model'
            value={values.model}
            onChange={updateField('model')}
            placeholder='例如：gpt-4.1-mini'
          />
          <Form.Input
            field='group_name'
            label='分组'
            value={values.group_name}
            onChange={updateField('group_name')}
            placeholder='可选'
          />
          <Form.Input
            field='tag'
            label='Tag'
            value={values.tag}
            onChange={updateField('tag')}
            placeholder='例如：prod'
          />
          <Form.InputNumber
            field='probe_interval_seconds'
            label='探测间隔（秒）'
            value={values.probe_interval_seconds}
            min={60}
            max={86400}
            onChange={updateField('probe_interval_seconds')}
          />
          <Form.Switch
            field='enabled'
            label='启用监控'
            checked={Boolean(values.enabled)}
            onChange={updateField('enabled')}
          />
        </Form>
        <Button theme='solid' loading={loading} onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </Space>
    </Card>
  );
}
