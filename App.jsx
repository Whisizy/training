import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// 训练部位数据
const TRAINING_ZONES = [
  { id: 'chest', name: '胸部', emoji: '💪', icon: '🏋️' },
  { id: 'back', name: '背部', emoji: '🔙', icon: '🏋️' },
  { id: 'shoulders', name: '肩部', emoji: '🦾', icon: '🏋️' },
  { id: 'arms', name: '手臂', emoji: '💪', icon: '🏋️' },
  { id: 'legs', name: '腿部', emoji: '🦵', icon: '🏋️' },
  { id: 'core', name: '核心', emoji: '🎯', icon: '🏋️' },
  { id: 'cardio', name: '有氧', emoji: '🏃', icon: '❤️' },
  { id: 'rest', name: '休息', emoji: '😴', icon: '🛌' },
];

// 训练动作库
const EXERCISE_LIBRARY = {
  chest: [
    { name: '杠铃卧推', sets: '4组 x 8-12次', weight: '中等重量', tip: '肩胛骨收紧，控制离心' },
    { name: '哑铃飞鸟', sets: '3组 x 12-15次', weight: '轻中重量', tip: '感受胸部拉伸与收缩' },
    { name: '上斜哑铃推举', sets: '4组 x 8-12次', weight: '中等重量', tip: '针对上胸，斜板30-45度' },
    { name: '绳索夹胸', sets: '3组 x 12-15次', weight: '轻重量', tip: '顶峰收缩1-2秒' },
    { name: '双杠臂屈伸', sets: '3组 x 力竭', weight: '自重', tip: '身体前倾，感受下胸' },
  ],
  back: [
    { name: '引体向上', sets: '4组 x 力竭', weight: '自重/负重', tip: '全程控制，避免借力' },
    { name: '杠铃划船', sets: '4组 x 8-12次', weight: '中等重量', tip: '保持背部平直，肘部贴紧身体' },
    { name: '高位下拉', sets: '4组 x 10-12次', weight: '中等重量', tip: '感受背阔肌收缩' },
    { name: '坐姿划船', sets: '3组 x 10-12次', weight: '中等重量', tip: '顶峰收缩挤压背部' },
    { name: '硬拉', sets: '3组 x 6-8次', weight: '大重量', tip: '保持脊柱中立，核心收紧' },
  ],
  shoulders: [
    { name: '站姿杠铃推举', sets: '4组 x 8-10次', weight: '中等重量', tip: '核心收紧，避免过度后仰' },
    { name: '哑铃侧平举', sets: '4组 x 12-15次', weight: '轻重量', tip: '沉肩，感受中束发力' },
    { name: '面拉', sets: '3组 x 15-20次', weight: '轻重量', tip: '改善肩部健康，预防伤病' },
    { name: '哑铃前平举', sets: '3组 x 12-15次', weight: '轻重量', tip: '交替进行，控制节奏' },
    { name: '俯身飞鸟', sets: '3组 x 12-15次', weight: '轻重量', tip: '针对后束，避免耸肩' },
  ],
  arms: [
    { name: '杠铃弯举', sets: '4组 x 10-12次', weight: '中等重量', tip: '控制离心，避免借力' },
    { name: '窄距卧推', sets: '4组 x 8-12次', weight: '中等重量', tip: '肘部贴紧身体，刺激三头' },
    { name: '锤式弯举', sets: '3组 x 12次', weight: '中等重量', tip: '针对肱肌和肱桡肌' },
    { name: '绳索下压', sets: '3组 x 12-15次', weight: '轻中重量', tip: '顶峰收缩挤压三头' },
    { name: '集中弯举', sets: '3组 x 12-15次', weight: '轻重量', tip: '孤立训练肱二头肌' },
  ],
  legs: [
    { name: '杠铃深蹲', sets: '4组 x 8-10次', weight: '大重量', tip: '深度至少平行，膝盖不内扣' },
    { name: '罗马尼亚硬拉', sets: '3组 x 10-12次', weight: '中等重量', tip: '感受腘绳肌拉伸' },
    { name: '保加利亚分腿蹲', sets: '3组 x 10-12次/腿', weight: '中等重量', tip: '前腿发力为主，稳定核心' },
    { name: '腿举', sets: '4组 x 10-12次', weight: '大重量', tip: '全幅动作，控制离心' },
    { name: '小腿提踵', sets: '4组 x 15-20次', weight: '中等重量', tip: '顶峰停顿，充分拉伸' },
  ],
  core: [
    { name: '平板支撑', sets: '3组 x 45-60秒', weight: '自重', tip: '保持身体一条直线' },
    { name: '悬垂举腿', sets: '3组 x 12-15次', weight: '自重', tip: '控制节奏，避免摆动' },
    { name: '俄罗斯转体', sets: '3组 x 20次/侧', weight: '自重/轻球', tip: '双脚离地增加难度' },
    { name: '卷腹', sets: '3组 x 15-20次', weight: '自重', tip: '下巴微收，避免拉脖子' },
    { name: '农夫行走', sets: '3组 x 30秒', weight: '大重量', tip: '核心抗旋转，保持稳定' },
  ],
  cardio: [
    { name: 'HIIT间歇跑', sets: '20分钟', weight: '—', tip: '冲刺30秒+慢走60秒循环' },
    { name: '跳绳', sets: '15分钟', weight: '—', tip: '变化节奏，混合双摇和单摇' },
    { name: '战绳', sets: '4组 x 30秒', weight: '—', tip: '全力输出，组间休息60秒' },
    { name: '划船机', sets: '20分钟', weight: '—', tip: '保持稳定配速' },
    { name: '动感单车', sets: '30分钟', weight: '—', tip: '间歇变速骑行' },
  ],
  rest: [
    { name: '泡沫轴放松', sets: '15分钟', weight: '—', tip: '重点放松紧张肌群' },
    { name: '静态拉伸', sets: '10-15分钟', weight: '—', tip: '每个动作保持30秒' },
    { name: '瑜伽', sets: '30分钟', weight: '—', tip: '关注呼吸与身体感知' },
    { name: '散步', sets: '30-45分钟', weight: '—', tip: '轻松节奏，促进恢复' },
  ],
};

// 初始身体数据
const DEFAULT_BODY_DATA = {
  date: new Date().toISOString().split('T')[0],
  weight: 75,
  leftArm: 35,
  rightArm: 35.5,
  leftLeg: 55,
  rightLeg: 55.5,
  chest_cm: 100,
  waist: 82,
  hip: 96,
};

// 智能训练计划生成
function generateWeeklyPlan(bodyData) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=周日, 1=周一...

  // 推拉腿分割计划
  const weeklySchedule = [
    { day: '周一', zones: ['chest', 'shoulders', 'arms'], focus: '推力训练日' },
    { day: '周二', zones: ['back', 'arms'], focus: '拉力训练日' },
    { day: '周三', zones: ['legs', 'core'], focus: '腿部训练日' },
    { day: '周四', zones: ['chest', 'back'], focus: '上下肢混合日' },
    { day: '周五', zones: ['shoulders', 'arms', 'core'], focus: '上肢+核心日' },
    { day: '周六', zones: ['legs', 'cardio'], focus: '腿部+有氧日' },
    { day: '周日', zones: ['rest'], focus: '休息恢复日' },
  ];

  // 根据臂围/腿围调整重点
  const armAvg = (bodyData.leftArm + bodyData.rightArm) / 2;
  const legAvg = (bodyData.leftLeg + bodyData.rightLeg) / 2;

  let recommendations = [];
  if (armAvg < 37) {
    recommendations.push('💡 手臂围度偏小，建议增加手臂孤立训练频次');
  }
  if (legAvg < 56) {
    recommendations.push('💡 腿部围度有提升空间，深蹲日可适当增加容量');
  }

  const todaySchedule = weeklySchedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1];

  return {
    weeklySchedule,
    todaySchedule,
    recommendations,
    armAvg,
    legAvg,
  };
}

// 获取模拟历史数据
function generateHistoryData() {
  const data = [];
  const baseData = { ...DEFAULT_BODY_DATA };
  const today = new Date();

  for (let i = 90; i >= 0; i -= 7) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const week = Math.floor((90 - i) / 7);
    data.push({
      date: d.toISOString().split('T')[0],
      weight: Math.round((baseData.weight - week * 0.3 + Math.random() * 0.5) * 10) / 10,
      leftArm: Math.round((baseData.leftArm + week * 0.08 + Math.random() * 0.1) * 10) / 10,
      rightArm: Math.round((baseData.rightArm + week * 0.08 + Math.random() * 0.1) * 10) / 10,
      leftLeg: Math.round((baseData.leftLeg + week * 0.12 + Math.random() * 0.15) * 10) / 10,
      rightLeg: Math.round((baseData.rightLeg + week * 0.12 + Math.random() * 0.15) * 10) / 10,
    });
  }
  return data;
}

// 简易折线图组件
function MiniLineChart({ data, label, color, unit = 'cm' }) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 1;
  const height = 100;
  const width = 280;
  const padding = { top: 10, bottom: 20, left: 10, right: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.value - minVal) / range) * chartH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="mini-chart">
      <div className="mini-chart-label">
        {label}: {data[data.length - 1].value}{unit}
        {data.length >= 2 && (
          <span className={`trend ${data[data.length - 1].value >= data[0].value ? 'up' : 'down'}`}>
            {data[data.length - 1].value >= data[0].value ? ' ↑' : ' ↓'}
            {Math.abs(Math.round((data[data.length - 1].value - data[0].value) * 10) / 10)}{unit}
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon
          points={`${padding.left},${padding.top + chartH} ${points} ${padding.left + chartW},${padding.top + chartH}`}
          fill={`url(#grad-${label})`}
        />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = padding.left + (i / (data.length - 1)) * chartW;
          const y = padding.top + chartH - ((d.value - minVal) / range) * chartH;
          return (
            <circle key={i} cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="2" />
          );
        })}
      </svg>
    </div>
  );
}

// 身体数据输入表单
function BodyDataForm({ bodyData, onSave, onCancel }) {
  const [form, setForm] = useState(bodyData);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>📊 更新身体数据</h3>
        <div className="form-grid">
          {[
            { key: 'weight', label: '体重 (kg)', min: 30, max: 200, step: 0.1 },
            { key: 'leftArm', label: '左臂围 (cm)', min: 20, max: 60, step: 0.1 },
            { key: 'rightArm', label: '右臂围 (cm)', min: 20, max: 60, step: 0.1 },
            { key: 'leftLeg', label: '左腿围 (cm)', min: 30, max: 80, step: 0.1 },
            { key: 'rightLeg', label: '右腿围 (cm)', min: 30, max: 80, step: 0.1 },
            { key: 'chest_cm', label: '胸围 (cm)', min: 60, max: 150, step: 0.1 },
            { key: 'waist', label: '腰围 (cm)', min: 50, max: 130, step: 0.1 },
            { key: 'hip', label: '臀围 (cm)', min: 60, max: 140, step: 0.1 },
          ].map(f => (
            <div className="form-field" key={f.key}>
              <label>{f.label}</label>
              <input
                type="number"
                value={form[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                min={f.min}
                max={f.max}
                step={f.step}
              />
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>取消</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>保存数据</button>
        </div>
      </div>
    </div>
  );
}

// 主应用
export default function App() {
  const [bodyData, setBodyData] = useState(() => {
    const saved = localStorage.getItem('fitness_body_data');
    return saved ? JSON.parse(saved) : DEFAULT_BODY_DATA;
  });
  const [historyData, setHistoryData] = useState(() => {
    const saved = localStorage.getItem('fitness_history');
    return saved ? JSON.parse(saved) : generateHistoryData();
  });
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('today');

  const plan = generateWeeklyPlan(bodyData);

  // 保存数据
  useEffect(() => {
    localStorage.setItem('fitness_body_data', JSON.stringify(bodyData));
  }, [bodyData]);

  useEffect(() => {
    localStorage.setItem('fitness_history', JSON.stringify(historyData));
  }, [historyData]);

  const handleSaveBodyData = useCallback((newData) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedData = { ...newData, date: todayStr };
    setBodyData(updatedData);
    setHistoryData(prev => {
      const filtered = prev.filter(d => d.date !== todayStr);
      return [...filtered, updatedData].sort((a, b) => a.date.localeCompare(b.date));
    });
    setShowForm(false);
  }, []);

  // 构建图表数据
  const armChartData = historyData.map(d => ({
    date: d.date,
    value: Math.round(((d.leftArm + d.rightArm) / 2) * 10) / 10,
  }));
  const legChartData = historyData.map(d => ({
    date: d.date,
    value: Math.round(((d.leftLeg + d.rightLeg) / 2) * 10) / 10,
  }));
  const weightChartData = historyData.map(d => ({
    date: d.date,
    value: d.weight,
  }));

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🏋️ 智能健身推荐</h1>
          <p className="subtitle">AI驱动 · 科学训练 · 数据追踪</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-nav">
        {[
          { id: 'today', label: '今日训练', icon: '📋' },
          { id: 'weekly', label: '周计划', icon: '📅' },
          { id: 'tracking', label: '数据追踪', icon: '📈' },
          { id: 'library', label: '动作库', icon: '📚' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Tab: 今日训练 */}
        {activeTab === 'today' && (
          <section className="tab-content fade-in">
            <div className="today-header">
              <div className="today-badge">
                <span className="day-icon">{plan.todaySchedule.zones[0] === 'rest' ? '🛌' : '🔥'}</span>
                <div>
                  <h2>{plan.todaySchedule.day} · {plan.todaySchedule.focus}</h2>
                  <p className="today-date">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                ✏️ 更新身体数据
              </button>
            </div>

            {/* 当前身体数据概览 */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon">💪</div>
                <div className="stat-info">
                  <span className="stat-label">平均臂围</span>
                  <span className="stat-value">{((bodyData.leftArm + bodyData.rightArm) / 2).toFixed(1)} <small>cm</small></span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🦵</div>
                <div className="stat-info">
                  <span className="stat-label">平均腿围</span>
                  <span className="stat-value">{((bodyData.leftLeg + bodyData.rightLeg) / 2).toFixed(1)} <small>cm</small></span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚖️</div>
                <div className="stat-info">
                  <span className="stat-label">体重</span>
                  <span className="stat-value">{bodyData.weight} <small>kg</small></span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📐</div>
                <div className="stat-info">
                  <span className="stat-label">腰围</span>
                  <span className="stat-value">{bodyData.waist} <small>cm</small></span>
                </div>
              </div>
            </div>

            {/* 智能建议 */}
            {plan.recommendations.length > 0 && (
              <div className="recommendations">
                <h3>🧠 AI 智能建议</h3>
                {plan.recommendations.map((r, i) => (
                  <p key={i} className="rec-item">{r}</p>
                ))}
              </div>
            )}

            {/* 今日训练部位 */}
            <div className="training-zones">
              <h3>🎯 今日训练部位</h3>
              <div className="zones-grid">
                {plan.todaySchedule.zones.map(zoneId => {
                  const zone = TRAINING_ZONES.find(z => z.id === zoneId);
                  return (
                    <div key={zoneId} className={`zone-card ${zoneId}`}>
                      <span className="zone-emoji">{zone.emoji}</span>
                      <span className="zone-name">{zone.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 今日推荐动作 */}
            {plan.todaySchedule.zones[0] !== 'rest' && (
              <div className="exercises-section">
                <h3>📋 今日推荐训练动作</h3>
                <div className="exercise-list">
                  {plan.todaySchedule.zones.flatMap(zoneId =>
                    (EXERCISE_LIBRARY[zoneId] || []).slice(0, 2).map((ex, i) => (
                      <div key={`${zoneId}-${i}`} className="exercise-card">
                        <div className="exercise-header">
                          <span className="exercise-name">{ex.name}</span>
                          <span className="exercise-sets">{ex.sets}</span>
                        </div>
                        <div className="exercise-detail">
                          <span className="exercise-weight">🏋️ {ex.weight}</span>
                          <span className="exercise-tip">💡 {ex.tip}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {plan.todaySchedule.zones[0] === 'rest' && (
              <div className="rest-day-card">
                <span className="rest-emoji">😴</span>
                <h3>今天是休息日！</h3>
                <p>充分的休息是肌肉生长的关键。可以做一些轻度拉伸或散步促进恢复。</p>
                <div className="rest-tips">
                  <div className="rest-tip">💧 多喝水，保持水分</div>
                  <div className="rest-tip">🥩 摄入充足蛋白质</div>
                  <div className="rest-tip">😴 保证8小时睡眠</div>
                  <div className="rest-tip">🧘 泡沫轴放松肌肉</div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab: 周计划 */}
        {activeTab === 'weekly' && (
          <section className="tab-content fade-in">
            <h2 className="section-title">📅 本周训练计划</h2>
            <div className="weekly-grid">
              {plan.weeklySchedule.map((day, index) => {
                const today = new Date().getDay();
                const dayNum = index + 1;
                const isToday = (today === 0 ? 7 : today) === dayNum;
                return (
                  <div key={day.day} className={`weekly-card ${isToday ? 'today' : ''}`}>
                    <div className="weekly-day-header">
                      <span className="weekly-day">{day.day}</span>
                      {isToday && <span className="today-tag">今天</span>}
                    </div>
                    <p className="weekly-focus">{day.focus}</p>
                    <div className="weekly-zones">
                      {day.zones.map(zoneId => {
                        const zone = TRAINING_ZONES.find(z => z.id === zoneId);
                        return (
                          <span key={zoneId} className="weekly-zone-tag">{zone.emoji} {zone.name}</span>
                        );
                      })}
                    </div>
                    {day.zones[0] !== 'rest' && (
                      <div className="weekly-exercise-count">
                        {day.zones.reduce((sum, z) => sum + (EXERCISE_LIBRARY[z] || []).length, 0)} 个推荐动作
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 训练原则 */}
            <div className="principles-card">
              <h3>📖 训练原则</h3>
              <div className="principles-grid">
                <div className="principle">
                  <strong>渐进超负荷</strong>
                  <p>每周逐步增加重量、次数或组数</p>
                </div>
                <div className="principle">
                  <strong>分化训练</strong>
                  <p>推拉腿分割，每个肌群充分休息48-72小时</p>
                </div>
                <div className="principle">
                  <strong>复合动作为主</strong>
                  <p>深蹲、卧推、硬拉等复合动作效率最高</p>
                </div>
                <div className="principle">
                  <strong>营养支持</strong>
                  <p>训练日保证每公斤体重1.6-2.2g蛋白质摄入</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab: 数据追踪 */}
        {activeTab === 'tracking' && (
          <section className="tab-content fade-in">
            <div className="tracking-header">
              <h2 className="section-title">📈 身体数据追踪</h2>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                ✏️ 更新数据
              </button>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <MiniLineChart data={armChartData} label="平均臂围" color="#FF6B6B" />
              </div>
              <div className="chart-card">
                <MiniLineChart data={legChartData} label="平均腿围" color="#4ECDC4" />
              </div>
              <div className="chart-card">
                <MiniLineChart data={weightChartData} label="体重" color="#45B7D1" unit="kg" />
              </div>
            </div>

            {/* 围度对比 */}
            <div className="comparison-section">
              <h3>📏 左右对称性对比</h3>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <div className="comparison-header">💪 臂围对比</div>
                  <div className="comparison-bars">
                    <div className="bar-item">
                      <span className="bar-label">左臂</span>
                      <div className="bar-track">
                        <div className="bar-fill left" style={{ width: `${(bodyData.leftArm / 45) * 100}%` }}>
                          {bodyData.leftArm} cm
                        </div>
                      </div>
                    </div>
                    <div className="bar-item">
                      <span className="bar-label">右臂</span>
                      <div className="bar-track">
                        <div className="bar-fill right" style={{ width: `${(bodyData.rightArm / 45) * 100}%` }}>
                          {bodyData.rightArm} cm
                        </div>
                      </div>
                    </div>
                    <div className="bar-diff">
                      差距: {Math.abs(bodyData.leftArm - bodyData.rightArm).toFixed(1)} cm
                    </div>
                  </div>
                </div>
                <div className="comparison-card">
                  <div className="comparison-header">🦵 腿围对比</div>
                  <div className="comparison-bars">
                    <div className="bar-item">
                      <span className="bar-label">左腿</span>
                      <div className="bar-track">
                        <div className="bar-fill left" style={{ width: `${(bodyData.leftLeg / 65) * 100}%` }}>
                          {bodyData.leftLeg} cm
                        </div>
                      </div>
                    </div>
                    <div className="bar-item">
                      <span className="bar-label">右腿</span>
                      <div className="bar-track">
                        <div className="bar-fill right" style={{ width: `${(bodyData.rightLeg / 65) * 100}%` }}>
                          {bodyData.rightLeg} cm
                        </div>
                      </div>
                    </div>
                    <div className="bar-diff">
                      差距: {Math.abs(bodyData.leftLeg - bodyData.rightLeg).toFixed(1)} cm
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 历史数据表 */}
            <div className="history-table-section">
              <h3>📋 历史记录</h3>
              <div className="table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>体重</th>
                      <th>左臂围</th>
                      <th>右臂围</th>
                      <th>左腿围</th>
                      <th>右腿围</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...historyData].reverse().slice(0, 10).map((d, i) => (
                      <tr key={i}>
                        <td>{d.date}</td>
                        <td>{d.weight} kg</td>
                        <td>{d.leftArm} cm</td>
                        <td>{d.rightArm} cm</td>
                        <td>{d.leftLeg} cm</td>
                        <td>{d.rightLeg} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab: 动作库 */}
        {activeTab === 'library' && (
          <section className="tab-content fade-in">
            <h2 className="section-title">📚 训练动作库</h2>
            <div className="library-grid">
              {Object.entries(EXERCISE_LIBRARY).map(([zoneId, exercises]) => {
                const zone = TRAINING_ZONES.find(z => z.id === zoneId);
                if (!zone) return null;
                return (
                  <div key={zoneId} className="library-zone">
                    <h3 className="library-zone-title">
                      {zone.emoji} {zone.name}
                    </h3>
                    <div className="library-exercises">
                      {exercises.map((ex, i) => (
                        <div key={i} className="library-exercise-card">
                          <div className="lib-ex-name">{ex.name}</div>
                          <div className="lib-ex-meta">
                            <span>{ex.sets}</span>
                            <span>{ex.weight}</span>
                          </div>
                          <div className="lib-ex-tip">💡 {ex.tip}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* 底部 */}
      <footer className="app-footer">
        <p>🏋️ 智能健身推荐系统 · 坚持训练，遇见更好的自己！</p>
      </footer>

      {/* 弹窗表单 */}
      {showForm && (
        <BodyDataForm
          bodyData={bodyData}
          onSave={handleSaveBodyData}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
