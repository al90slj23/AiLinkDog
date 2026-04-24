import React, { useEffect, useState } from 'react';
import { Banner, Button, Space, Typography } from '@douyinfe/semi-ui';
import { useNavigate, useParams } from 'react-router-dom';
import MonitorTargetForm from '../../components/monitor/MonitorTargetForm';
import { API, showError, showSuccess } from '../../helpers';

export default function EditMonitorTarget() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      if (!isEdit) {
        return;
      }
      try {
        const res = await API.get(`/api/monitor/user/targets/${id}`, {
          skipErrorHandler: true,
        });
        if (!res.data?.success) {
          throw new Error(res.data?.message || '获取监控详情失败');
        }
        setInitialValues({ ...res.data.data, api_key: '' });
      } catch (error) {
        const message = error?.message || '获取监控详情失败';
        setError(message);
        showError(message);
      } finally {
        setInitLoading(false);
      }
    };

    loadDetail();
  }, [id, isEdit]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: values.name,
        channel_type: values.channel_type,
        base_url: values.base_url,
        api_key: values.api_key,
        model: values.model,
        group_name: values.group_name,
        tag: values.tag,
        probe_interval_seconds: values.probe_interval_seconds,
        enabled: values.enabled,
      };

      let res;
      if (isEdit) {
        res = await API.put(`/api/monitor/user/targets/${id}`, payload);
      } else {
        res = await API.post('/api/monitor/user/targets', {
          ...payload,
          api_key: values.api_key,
        });
      }

      if (!res.data?.success) {
        throw new Error(res.data?.message || '保存监控失败');
      }
      showSuccess(isEdit ? '监控已更新' : '监控已创建');
      navigate(`/console/monitor-targets/${res.data.data.id || id}`);
    } catch (error) {
      const message = error?.message || '保存监控失败';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-4 py-6 md:px-6'>
      <Space vertical spacing='large' style={{ width: '100%' }}>
        <div>
          <Typography.Title heading={3}>{isEdit ? '编辑监控' : '新建监控'}</Typography.Title>
          <Typography.Paragraph>
            {isEdit ? '修改监控配置，API Key 不回显，留空表示保持不变。' : '创建一个自定义用户监控目标。'}
          </Typography.Paragraph>
        </div>
        {error ? <Banner type='danger' description={error} /> : null}
        {initLoading ? <Typography.Text>loading</Typography.Text> : null}
        {!initLoading ? (
          <>
            <MonitorTargetForm
              initialValues={initialValues}
              loading={loading}
              error={error}
              submitLabel={isEdit ? '保存修改' : '创建监控'}
              onSubmit={handleSubmit}
            />
            <Button onClick={() => navigate('/console/monitor-targets')}>返回列表</Button>
          </>
        ) : null}
      </Space>
    </div>
  );
}
