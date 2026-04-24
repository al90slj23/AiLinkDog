import React, { useState, useEffect, useContext } from 'react';
import { SplineScene } from '../../../components/ui/spline-scene';
import { StatusContext } from '../../../context/Status';
import { API, showError, showSuccess } from '../../../helpers';
import {
  Button,
  Slider,
  Typography,
  Card,
  Space,
  InputNumber,
  Switch,
} from '@douyinfe/semi-ui';

function HeroRobotScene({
  children,
  isDesktop = true,
  shouldLoadScene = true,
}) {
  const [statusState] = useContext(StatusContext);
  const showScene = isDesktop && shouldLoadScene;
  const isDebugEnabled = statusState?.status?.home_page_robot_debugger_enabled;

  const [localTransform, setLocalTransform] = useState({
    scale: 0.79,
    x: 0,
    y: -129,
    width: 68,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (statusState?.status) {
      setLocalTransform({
        scale: parseFloat(statusState.status.home_page_robot_scale || 0.79),
        x: parseInt(statusState.status.home_page_robot_x || 0, 10),
        y: parseInt(statusState.status.home_page_robot_y || -129, 10),
        width: parseInt(statusState.status.home_page_robot_width || 68, 10),
      });
    }
  }, [statusState?.status]);

  const handleSaveAndClose = async () => {
    setIsSaving(true);
    try {
      const updates = [
        { key: 'HomePageRobotScale', value: String(localTransform.scale) },
        { key: 'HomePageRobotX', value: String(localTransform.x) },
        { key: 'HomePageRobotY', value: String(localTransform.y) },
        { key: 'HomePageRobotWidth', value: String(localTransform.width) },
        { key: 'HomePageRobotDebuggerEnabled', value: 'false' },
      ];

      const requestQueue = updates.map((item) => API.put('/api/option/', item));
      await Promise.all(requestQueue);

      showSuccess('保存成功，调试器已关闭。请刷新页面查看最终效果。');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      showError('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const styleOverride = {
    flex: `0 0 ${localTransform.width}%`,
    transform: `translate3d(${localTransform.x}px, ${localTransform.y}px, 50px) scale(${localTransform.scale})`,
  };

  return (
    <div
      className={`ald-home-robot-bg ${showScene ? 'ald-home-robot-bg--active' : 'ald-home-robot-bg--idle'}`}
    >
      <div className='ald-home-robot-bg__gradient' aria-hidden='true' />
      {children ? (
        <div className='ald-home-robot-bg__mid-layer'>{children}</div>
      ) : null}
      <div className='ald-home-robot-bg__scene'>
        {showScene ? (
          <SplineScene
            scene='/ald-robot.scene.splinecode'
            className='ald-home-robot-bg__canvas'
            style={styleOverride}
          />
        ) : (
          <div
            className='ald-home-robot-bg__placeholder'
            aria-hidden='true'
            style={styleOverride}
          >
            <div className='ald-home-robot-bg__orb' />
            <div className='ald-home-robot-bg__halo' />
            <div className='ald-home-robot-bg__core' />
          </div>
        )}
      </div>

      {isDebugEnabled && (
        <Card
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 9999,
            width: 320,
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}
          title='机器人位置调试器'
        >
          <Space vertical align='start' style={{ width: '100%' }}>
            <Typography.Text strong>
              缩放比例 (Scale): {localTransform.scale}
            </Typography.Text>
            <Slider
              step={0.01}
              min={0.1}
              max={2.0}
              value={localTransform.scale}
              onChange={(v) => setLocalTransform((p) => ({ ...p, scale: v }))}
            />

            <Typography.Text strong>
              水平偏移 (X px): {localTransform.x}
            </Typography.Text>
            <Slider
              step={1}
              min={-1000}
              max={1000}
              value={localTransform.x}
              onChange={(v) => setLocalTransform((p) => ({ ...p, x: v }))}
            />

            <Typography.Text strong>
              垂直偏移 (Y px): {localTransform.y}
            </Typography.Text>
            <Slider
              step={1}
              min={-1000}
              max={1000}
              value={localTransform.y}
              onChange={(v) => setLocalTransform((p) => ({ ...p, y: v }))}
            />

            <Typography.Text strong>
              宽度占比 (Width %): {localTransform.width}
            </Typography.Text>
            <Slider
              step={1}
              min={10}
              max={150}
              value={localTransform.width}
              onChange={(v) => setLocalTransform((p) => ({ ...p, width: v }))}
            />

            <Button
              theme='solid'
              type='primary'
              block
              loading={isSaving}
              onClick={handleSaveAndClose}
              style={{ marginTop: 16 }}
            >
              保存并关闭调试器
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
}

export default HeroRobotScene;
