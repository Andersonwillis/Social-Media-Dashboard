import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { useRole } from '../hooks/useRole';
import { useNavigate } from 'react-router-dom';
import { getFollowers, getOverview } from '../api';

function GoalsPage() {
  const { isSignedIn } = useAuth();
  const { can } = useRole();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({ followers: [], overview: [] });
  const [newGoal, setNewGoal] = useState({
    platform: 'Facebook',
    metric: 'Followers',
    current: 0,
    target: 10000,
    deadline: ''
  });

  // Fetch dashboard data for auto-filling current values
  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        try {
          const [followers, overview] = await Promise.all([getFollowers(), getOverview()]);
          setDashboardData({ followers, overview });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      })();
    }
  }, [isSignedIn]);

  // Auto-fill current value based on platform and metric selection
  useEffect(() => {
    const getCurrentValue = () => {
      const platform = newGoal.platform;
      const metric = newGoal.metric;

      // Map platform names to data IDs
      const platformMap = {
        'Facebook': 'fb',
        'Instagram': 'ig',
        'Twitter': 'tw',
        'YouTube': 'yt'
      };

      const platformId = platformMap[platform];

      // Handle follower counts
      if (metric === 'Followers' || metric === 'Subscribers') {
        const followerData = dashboardData.followers.find(f => f.id === platformId);
        if (followerData) {
          return followerData.count;
        }
      }

      // Handle specific metrics from overview
      if (platform !== 'All Platforms') {
        const metricMap = {
          'Likes': 'likes',
          'Views': 'views',
          'Engagement': 'engagement'
        };

        const metricKey = metricMap[metric];
        if (metricKey) {
          const overviewItem = dashboardData.overview.find(
            item => item.brand === platform.toLowerCase() && 
                    item.metric.toLowerCase().includes(metricKey)
          );
          if (overviewItem) {
            return overviewItem.value;
          }
        }
      }

      // Handle "All Platforms" total engagement
      if (platform === 'All Platforms' && metric === 'Total Engagement') {
        const totalFollowers = dashboardData.followers.reduce((sum, f) => sum + f.count, 0);
        return totalFollowers;
      }

      return 0;
    };

    const currentValue = getCurrentValue();
    setNewGoal(prev => ({ ...prev, current: currentValue }));
  }, [newGoal.platform, newGoal.metric, dashboardData]);

  // Mock goals data - this would come from an API in a real app
  const [goals, setGoals] = useState([
    {
      id: 1,
      platform: 'Facebook',
      icon: '/images/icon-facebook.svg',
      color: 'bg-blue-500',
      metric: 'Followers',
      current: 45234,
      target: 50000,
      deadline: '2026-03-31',
      status: 'on-track'
    },
    {
      id: 2,
      platform: 'Instagram',
      icon: '/images/icon-instagram.svg',
      color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
      metric: 'Followers',
      current: 157890,
      target: 200000,
      deadline: '2026-06-30',
      status: 'on-track'
    },
    {
      id: 3,
      platform: 'Twitter',
      icon: '/images/icon-twitter.svg',
      color: 'bg-sky-500',
      metric: 'Followers',
      current: 29567,
      target: 35000,
      deadline: '2026-02-28',
      status: 'on-track'
    },
    {
      id: 4,
      platform: 'YouTube',
      icon: '/images/icon-youtube.svg',
      color: 'bg-red-600',
      metric: 'Subscribers',
      current: 90234,
      target: 100000,
      deadline: '2026-04-30',
      status: 'on-track'
    },
    {
      id: 5,
      platform: 'All Platforms',
      icon: null,
      color: 'bg-purple-600',
      metric: 'Total Engagement',
      current: 8945000,
      target: 10000000,
      deadline: '2026-12-31',
      status: 'on-track'
    },
    {
      id: 6,
      platform: 'Instagram',
      icon: '/images/icon-instagram.svg',
      color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
      metric: 'Average Likes',
      current: 12450,
      target: 15000,
      deadline: '2026-05-31',
      status: 'on-track'
    }
  ]);

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusColorInline = (status) => {
    switch (status) {
      case 'ahead':
        return '#10b981';
      case 'on-track':
        return '#3b82f6';
      case 'at-risk':
        return '#f59e0b';
      case 'behind':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Facebook':
        return '#1877f2';
      case 'Instagram':
        return '#e4405f';
      case 'Twitter':
        return '#1da1f2';
      case 'YouTube':
        return '#ff0000';
      case 'All Platforms':
        return '#8b5cf6';
      default:
        return '#3b82f6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ahead':
        return '🎉 Ahead of Schedule';
      case 'on-track':
        return '✓ On Track';
      case 'at-risk':
        return '⚠️ At Risk';
      case 'behind':
        return '⚠ Behind Schedule';
      default:
        return 'Unknown';
    }
  };

  // Calculate days until deadline
  const getDaysUntil = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle marking goal as complete
  const markGoalComplete = (goalId) => {
    setGoals(goals.map(g => 
      g.id === goalId ? { ...g, current: g.target, status: 'ahead' } : g
    ));
  };

  // Handle increasing goal progress
  const boostGoal = (goalId, amount) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        const newCurrent = Math.min(g.current + amount, g.target);
        const progress = (newCurrent / g.target) * 100;
        const newStatus = progress >= 100 ? 'ahead' : 
                         progress >= 80 ? 'on-track' : 
                         progress >= 50 ? 'at-risk' : 'behind';
        return { ...g, current: newCurrent, status: newStatus };
      }
      return g;
    }));
  };

  // Handle removing a goal
  const removeGoal = (goalId) => {
    if (confirm('Are you sure you want to remove this goal?')) {
      setGoals(goals.filter(g => g.id !== goalId));
    }
  };

  // Handle adding a new goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newGoal.deadline) {
      alert('Please select a deadline date');
      return;
    }
    
    if (newGoal.target <= newGoal.current) {
      alert('Target must be greater than current value');
      return;
    }
    
    // Calculate initial status
    const progress = (newGoal.current / newGoal.target) * 100;
    const status = progress >= 100 ? 'ahead' : 
                   progress >= 80 ? 'on-track' : 
                   progress >= 50 ? 'at-risk' : 'behind';
    
    // Get platform icon
    const platformIcons = {
      'Facebook': '/images/icon-facebook.svg',
      'Instagram': '/images/icon-instagram.svg',
      'Twitter': '/images/icon-twitter.svg',
      'YouTube': '/images/icon-youtube.svg',
      'All Platforms': null
    };
    
    // Create new goal
    const goal = {
      id: Math.max(...goals.map(g => g.id), 0) + 1,
      platform: newGoal.platform,
      icon: platformIcons[newGoal.platform],
      color: 'bg-blue-500', // Not used anymore, kept for compatibility
      metric: newGoal.metric,
      current: parseInt(newGoal.current),
      target: parseInt(newGoal.target),
      deadline: newGoal.deadline,
      status: status
    };
    
    setGoals([...goals, goal]);
    
    // Reset form and close modal
    setNewGoal({
      platform: 'Facebook',
      metric: 'Followers',
      current: 0,
      target: 10000,
      deadline: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <SignedOut>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2 className="title" style={{ marginBottom: '1rem' }}>
            Goals & Targets
          </h2>
          <p className="subtitle" style={{ marginBottom: '2rem' }}>
            Please sign in to view and manage your goals.
          </p>
          <button
            onClick={() => navigate('/sign-in')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
        </div>
      </SignedOut>

      <SignedIn>
        <div>
          <h1 className="title" style={{ marginBottom: '0.5rem' }}>
            Goals & Targets
          </h1>
          <p className="subtitle" style={{ marginBottom: '2rem' }}>
            Track your progress towards key milestones across all platforms
          </p>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    Active Goals
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: '700' }}>
                    {goals.length}
                  </p>
                </div>
                <div style={{ fontSize: '2.5rem' }}>🎯</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    On Track
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                    {goals.filter(g => g.status === 'on-track' || g.status === 'ahead').length}
                  </p>
                </div>
                <div style={{ fontSize: '2.5rem' }}>✓</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    Need Attention
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
                    {goals.filter(g => g.status === 'at-risk' || g.status === 'behind').length}
                  </p>
                </div>
                <div style={{ fontSize: '2.5rem' }}>⚠️</div>
              </div>
            </div>
          </div>

          {/* Goals List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current, goal.target);
              const daysUntil = getDaysUntil(goal.deadline);
              const remaining = goal.target - goal.current;

              return (
                <div
                  key={goal.id}
                  className="card"
                  style={{ padding: '1.5rem', transition: 'all 0.2s' }}
                >
                  {/* Header Section */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {goal.icon && (
                        <div style={{ 
                          width: '3.5rem', 
                          height: '3.5rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '0.75rem',
                          backgroundColor: getPlatformColor(goal.platform)
                        }}>
                          <img src={goal.icon} alt={goal.platform} style={{ width: '1.75rem', height: '1.75rem' }} />
                        </div>
                      )}
                      {!goal.icon && (
                        <div style={{ 
                          width: '3.5rem', 
                          height: '3.5rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '0.75rem',
                          backgroundColor: '#8b5cf6'
                        }}>
                          <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>∑</span>
                        </div>
                      )}
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                          {goal.platform} - {goal.metric}
                        </h3>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: getStatusColorInline(goal.status) }}>
                          {getStatusText(goal.status)}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                        Deadline
                      </p>
                      <p style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        {new Date(goal.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {daysUntil > 0 ? `${daysUntil} days left` : 'Overdue'}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Progress
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#1e293b', 
                      borderRadius: '9999px', 
                      height: '0.75rem',
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{ 
                          width: `${progress}%`,
                          height: '0.75rem',
                          borderRadius: '9999px',
                          backgroundColor: getPlatformColor(goal.platform),
                          transition: 'width 0.5s ease'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                        Current
                      </p>
                      <p style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                        {formatNumber(goal.current)}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                        Target
                      </p>
                      <p style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                        {formatNumber(goal.target)}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                        Remaining
                      </p>
                      <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#3b82f6' }}>
                        {formatNumber(remaining)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {can('edit') && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                      <button
                        onClick={() => boostGoal(goal.id, Math.floor(goal.target * 0.1))}
                        style={{
                          flex: 1,
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #10b981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'}
                      >
                        📈 Boost +10%
                      </button>
                      <button
                        onClick={() => markGoalComplete(goal.id)}
                        disabled={progress >= 100}
                        style={{
                          flex: 1,
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #3b82f6',
                          backgroundColor: progress >= 100 ? '#334155' : 'rgba(59, 130, 246, 0.1)',
                          color: progress >= 100 ? '#64748b' : '#3b82f6',
                          cursor: progress >= 100 ? 'not-allowed' : 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          if (progress < 100) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseOut={(e) => {
                          if (progress < 100) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        }}
                      >
                        {progress >= 100 ? '✓ Complete' : '✓ Mark Complete'}
                      </button>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #ef4444',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Goal Button (for Admins/Editors) */}
          {can('edit') && (
            <div style={{ marginTop: '3rem' }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '2px dashed #3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ 
                  fontSize: '1.5rem', 
                  width: '2rem', 
                  height: '2rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  fontWeight: '300'
                }}>+</span>
                <span>Add New Goal</span>
              </button>
            </div>
          )}

          {/* Add Goal Modal */}
          {showAddModal && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
              }}
              onClick={() => setShowAddModal(false)}
            >
              <div 
                className="card"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '2rem',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                    🎯 Add New Goal
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: '#64748b',
                      padding: '0.25rem',
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddGoal}>
                  {/* Platform */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      Platform
                    </label>
                    <select
                      value={newGoal.platform}
                      onChange={(e) => setNewGoal({ ...newGoal, platform: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: 'white',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Twitter">Twitter</option>
                      <option value="YouTube">YouTube</option>
                      <option value="All Platforms">All Platforms</option>
                    </select>
                  </div>

                  {/* Metric */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      Metric
                    </label>
                    <select
                      value={newGoal.metric}
                      onChange={(e) => setNewGoal({ ...newGoal, metric: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: 'white',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Followers">Followers</option>
                      <option value="Subscribers">Subscribers</option>
                      <option value="Likes">Likes</option>
                      <option value="Views">Views</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Total Engagement">Total Engagement</option>
                    </select>
                  </div>

                  {/* Current Value - Auto-filled */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      Current Value <span style={{ color: '#10b981', fontSize: '0.75rem' }}>✓ Auto-filled from dashboard</span>
                    </label>
                    <div style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ color: '#10b981' }}>📊</span>
                      <span>{formatNumber(newGoal.current)}</span>
                      <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '400' }}>
                        ({newGoal.current.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Target Value */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      Target Value
                    </label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                      min="1"
                      required
                    />
                  </div>

                  {/* Deadline */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #334155',
                        backgroundColor: 'transparent',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                      Add Goal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}

export default GoalsPage;
