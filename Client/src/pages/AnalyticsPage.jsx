import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getFollowers, getOverview } from '../api';

export default function AnalyticsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ followers: [], overview: [] });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('inception');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Load data regardless of sign-in status (view-only mode)
  useEffect(() => {
    (async () => {
      try {
        const [f, o] = await Promise.all([getFollowers(), getOverview()]);
        setData({ followers: f, overview: o });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch analytics data when timeRange changes
  useEffect(() => {
    
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/analytics?range=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsResult = await response.json();
        setAnalyticsData(analyticsResult);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Keep using the hardcoded data as fallback
        setAnalyticsData(null);
      }
    };
    
    fetchAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  // Historical data showing dramatic growth over time for each platform
  const generateTrendData = (range) => {
    // Use fetched data if available, otherwise fallback to hardcoded data
    if (analyticsData) {
      const total = analyticsData.labels.map((_, i) => 
        analyticsData.facebook[i] + 
        analyticsData.instagram[i] + 
        analyticsData.twitter[i] + 
        analyticsData.youtube[i]
      );
      
      return {
        labels: analyticsData.labels,
        datasets: [
          { name: 'Facebook', color: '#1877f2', values: analyticsData.facebook },
          { name: 'Instagram', color: '#e4405f', values: analyticsData.instagram },
          { name: 'Twitter', color: '#1da1f2', values: analyticsData.twitter },
          { name: 'YouTube', color: '#ff0000', values: analyticsData.youtube },
          { name: 'Total', color: '#8b5cf6', values: total }
        ]
      };
    }
    
    // Fallback to hardcoded data
    const historicalData = {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        facebook: [43200, 43850, 43500, 44100, 44650, 44200, 45234],
        instagram: [152000, 153500, 151800, 154200, 156000, 155100, 157890],
        twitter: [28100, 28450, 28200, 28700, 29100, 28800, 29567],
        youtube: [86945, 87650, 87400, 88780, 89240, 88460, 90234]
      },
      month: {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        facebook: [
          40200, 40450, 40100, 40800, 41200, 40900, 41500,
          41800, 41500, 42100, 42400, 42100, 42700, 42400,
          43000, 43300, 43000, 43600, 43900, 43600, 44200,
          44500, 44200, 44700, 45000, 44700, 45300, 45100, 45234
        ].slice(0, 30),
        instagram: [
          140000, 141200, 139800, 142500, 144000, 142800, 145200,
          147000, 145800, 148500, 150200, 149000, 151800, 150600,
          153400, 154800, 153200, 155600, 156800, 155400, 157200,
          158400, 157200, 159000, 160200, 159000, 160800, 159600, 157890
        ].slice(0, 30),
        twitter: [
          26500, 26700, 26400, 26900, 27200, 27000, 27400,
          27600, 27400, 27800, 28000, 27800, 28200, 28000,
          28400, 28600, 28400, 28800, 29000, 28800, 29200,
          29400, 29200, 29600, 29800, 29600, 30000, 29800, 29567
        ].slice(0, 30),
        youtube: [
          73750, 74500, 73200, 75100, 76300, 75200, 77000,
          78200, 77100, 79000, 80200, 79100, 81000, 80000,
          82100, 83200, 82100, 84100, 85300, 84200, 86100,
          87200, 86200, 88100, 89400, 88300, 90200, 89100, 90234
        ].slice(0, 30)
      },
      year: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        facebook: [35000, 36500, 35800, 37800, 39200, 38500, 40100, 41500, 40800, 42600, 43800, 45234],
        instagram: [110000, 118000, 112000, 125000, 135000, 128000, 138000, 145000, 141000, 150000, 154000, 157890],
        twitter: [22000, 23500, 22800, 24500, 26000, 25200, 26800, 28000, 27300, 28900, 29400, 29567],
        youtube: [28000, 40000, 34400, 57700, 68800, 63300, 73100, 80500, 76900, 83500, 89800, 90234]
      },
      inception: {
        labels: ['Q1 Y1', 'Q2 Y1', 'Q3 Y1', 'Q4 Y1', 
                 'Q1 Y2', 'Q2 Y2', 'Q3 Y2', 'Q4 Y2',
                 'Q1 Y3', 'Q2 Y3', 'Q3 Y3', 'Q4 Y3',
                 'Q1 Y4', 'Q2 Y4', 'Q3 Y4', 'Q4 Y4',
                 'Q1 Y5', 'Q2 Y5', 'Q3 Y5', 'Q4 Y5',
                 'Q1 Y6', 'Q2 Y6', 'Q3 Y6', 'Q4 Y6'],
        facebook: [
          3000, 4500, 6200, 8500, 7800, 11200, 14500, 14000,
          17800, 21200, 20500, 25000, 28500, 27800, 32000, 34500,
          35000, 36500, 37800, 39200, 40100, 41500, 42600, 45234
        ],
        instagram: [
          2500, 5200, 11000, 18000, 16500, 23500, 32000, 30500,
          40000, 51000, 48000, 63000, 78000, 75000, 92000, 103000,
          110000, 118000, 125000, 135000, 138000, 145000, 150000, 157890
        ],
        twitter: [
          1500, 2800, 4500, 6800, 6200, 8900, 11500, 11000,
          13800, 16500, 15900, 20000, 23500, 22800, 26500, 28800,
          22000, 23500, 24500, 26000, 26800, 28000, 28900, 29567
        ],
        youtube: [
          1500, 2700, 6700, 8700, 8000, 12200, 13200, 13400,
          13800, 13500, 12100, 17000, 18000, 17000, 21500, 21900,
          28000, 40000, 57700, 68800, 73100, 80500, 83500, 90234
        ]
      }
    };
    
    const data = historicalData[range] || historicalData.week;
    
    // Calculate totals for each time point
    const totals = data.labels.map((_, idx) => 
      data.facebook[idx] + data.instagram[idx] + data.twitter[idx] + data.youtube[idx]
    );
    
    return {
      labels: data.labels,
      datasets: [
        { name: 'Facebook', color: '#1877f2', values: data.facebook },
        { name: 'Instagram', color: '#e4405f', values: data.instagram },
        { name: 'Twitter', color: '#1da1f2', values: data.twitter },
        { name: 'YouTube', color: '#ff0000', values: data.youtube },
        { name: 'Total', color: '#8b5cf6', values: totals, strokeWidth: 3 }
      ]
    };
  };

  const trendData = generateTrendData(timeRange);
  
  // Find min and max across all datasets
  const allValues = trendData.datasets.flatMap(d => d.values);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);

  // Calculate analytics
  const totalFollowers = data.followers.reduce((sum, f) => sum + f.count, 0);
  const totalGrowth = data.followers.reduce((sum, f) => sum + (f.deltaValue || 0), 0);
  const growthRate = totalFollowers > 0 ? ((totalGrowth / totalFollowers) * 100).toFixed(2) : 0;
  
  const platformStats = data.followers.map(f => ({
    name: f.displayName || f.handle || f.brand,
    platform: f.brand,
    label: f.label || 'Followers',
    followers: f.count,
    growth: f.deltaValue || 0,
    percentage: ((f.count / totalFollowers) * 100).toFixed(1),
    growthPercent: f.count > 0 ? (((f.deltaValue || 0) / f.count) * 100).toFixed(2) : 0
  }));

  // Best and worst performing platforms
  const bestPlatform = [...platformStats].sort((a, b) => b.growth - a.growth)[0];
  const worstPlatform = [...platformStats].sort((a, b) => a.growth - b.growth)[0];

  // Total engagement
  const totalEngagement = data.overview.reduce((sum, m) => sum + (m.value || m.count || 0), 0);

  const topMetrics = data.overview
    .sort((a, b) => (b.value || b.count || 0) - (a.value || a.count || 0))
    .slice(0, 5);

  const bottomMetrics = data.overview
    .sort((a, b) => (a.value || a.count || 0) - (b.value || b.count || 0))
    .slice(0, 5);

  // Platform-specific breakdown
  const platformBreakdown = {};
  data.overview.forEach(metric => {
    if (!platformBreakdown[metric.brand]) {
      platformBreakdown[metric.brand] = [];
    }
    platformBreakdown[metric.brand].push(metric);
  });

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      {/* View-Only Banner */}
      {!isSignedIn && (
        <div style={{
          backgroundColor: '#1e293b',
          border: '2px solid #3b82f6',
          borderRadius: '0.5rem',
          padding: '1rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
            👁️ <strong style={{ color: '#e2e8f0' }}>View-Only Mode</strong> - 
            <button
              onClick={() => navigate('/sign-in')}
              style={{
                marginLeft: '0.5rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Sign In
            </button>
            {' '}to track goals and customize your dashboard
          </p>
        </div>
      )}

      <h1 className="title" style={{ marginBottom: '2rem' }}>Analytics Dashboard</h1>

      {/* Growth Trend Graph */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">Follower Growth Trends</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['inception', 'year', 'month', 'week'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: timeRange === range ? '1px solid #3b82f6' : '1px solid #334155',
                  backgroundColor: timeRange === range ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: timeRange === range ? '#3b82f6' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (timeRange !== range) {
                    e.currentTarget.style.borderColor = '#475569';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
                onMouseOut={(e) => {
                  if (timeRange !== range) {
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                {range === 'inception' ? 'All Time' : range}
              </button>
            ))}
          </div>
        </div>
        
        <div className="card" style={{ padding: '2rem', backgroundColor: '#0f172a' }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {trendData.datasets.map(dataset => (
              <div key={dataset.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '16px', 
                  height: dataset.strokeWidth || 2, 
                  backgroundColor: dataset.color,
                  borderRadius: '2px'
                }}></div>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: dataset.name === 'Total' ? '600' : '400' }}>
                  {dataset.name}
                </span>
              </div>
            ))}
          </div>

          {/* Line Graph */}
          <div style={{ position: 'relative', height: '350px', padding: '1rem 2rem 2rem 3rem' }}>
            {/* Grid lines */}
            <svg style={{ position: 'absolute', top: '1rem', left: '3rem', right: '2rem', height: '300px', width: 'calc(100% - 5rem)' }}>
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 75}
                  x2="100%"
                  y2={i * 75}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              ))}
            </svg>

            {/* Y-axis labels */}
            <div style={{ position: 'absolute', left: 0, top: '1rem', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '0.5rem' }}>
              {[4, 3, 2, 1, 0].map(i => (
                <span key={i} style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {Math.round(minValue + ((maxValue - minValue) / 4) * i).toLocaleString()}
                </span>
              ))}
            </div>

            {/* Line chart SVG */}
            <svg 
              style={{ position: 'relative', width: 'calc(100% - 5rem)', height: '300px', marginLeft: '3rem' }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {trendData.datasets.map(dataset => {
                const points = dataset.values.map((value, i) => {
                  const x = (i / (dataset.values.length - 1)) * 100;
                  const y = 100 - ((value - minValue) / (maxValue - minValue)) * 100;
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <g key={dataset.name}>
                    {/* Line */}
                    <polyline
                      points={points}
                      fill="none"
                      stroke={dataset.color}
                      strokeWidth={dataset.strokeWidth ? dataset.strokeWidth / 20 : 0.15}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      style={{ filter: `drop-shadow(0 1px 2px ${dataset.color}80)` }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Data points overlay - using absolute positioning for perfect circles */}
            <div style={{ position: 'absolute', top: '1rem', left: '3rem', width: 'calc(100% - 5rem)', height: '300px', pointerEvents: 'none' }}>
              {trendData.datasets.map(dataset => {
                return dataset.values.map((value, i) => {
                  const xPercent = (i / (dataset.values.length - 1)) * 100;
                  const yPercent = 100 - ((value - minValue) / (maxValue - minValue)) * 100;
                  const radius = dataset.name === 'Total' ? 5 : 4;
                  
                  return (
                    <div
                      key={`${dataset.name}-${i}`}
                      style={{
                        position: 'absolute',
                        left: `${xPercent}%`,
                        top: `${yPercent}%`,
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                        borderRadius: '50%',
                        backgroundColor: dataset.color,
                        border: '2px solid #0f172a',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        pointerEvents: 'all',
                        boxShadow: `0 0 4px ${dataset.color}80`
                      }}
                      title={`${dataset.name}: ${value.toLocaleString()}`}
                    />
                  );
                });
              })}
            </div>

            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', marginLeft: '3rem', paddingRight: '2rem' }}>
              {trendData.labels.map((label, i) => {
                // Show fewer labels if there are many data points
                const showLabel = trendData.labels.length <= 12 || i % Math.ceil(trendData.labels.length / 12) === 0 || i === trendData.labels.length - 1;
                return (
                  <span 
                    key={i} 
                    style={{ 
                      fontSize: '0.75rem', 
                      color: '#64748b',
                      visibility: showLabel ? 'visible' : 'hidden',
                      flex: 1,
                      textAlign: 'center'
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #334155'
          }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Min: </span>
              <span style={{ fontWeight: '600' }}>{minValue.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Max: </span>
              <span style={{ fontWeight: '600' }}>{maxValue.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Growth: </span>
              <span style={{ fontWeight: '600', color: '#1db954' }}>
                +{((maxValue - minValue) / minValue * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', textAlign: 'center' }}>
            *Example trend data for demonstration purposes
          </p>
        </div>
      </section>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Followers</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalFollowers.toLocaleString()}</p>
        </div>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Today's Growth</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: totalGrowth >= 0 ? '#1db954' : '#dc2626' }}>
            {totalGrowth > 0 ? '+' : ''}{totalGrowth}
          </p>
        </div>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Growth Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{growthRate}%</p>
        </div>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Engagement</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalEngagement.toLocaleString()}</p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>*Example with mock data</p>
        </div>
      </div>

      {/* Best/Worst Performers */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #1db954' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem' }}>🏆 Best Performing Platform</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{bestPlatform.platform}</p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            {bestPlatform.name} • <span style={{ color: '#1db954' }}>+{bestPlatform.growth}</span> ({bestPlatform.growthPercent}%)
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>*Example calculation</p>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #dc2626' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem' }}>📉 Needs Attention</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{worstPlatform.platform}</p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            {worstPlatform.name} • <span style={{ color: worstPlatform.growth >= 0 ? '#1db954' : '#dc2626' }}>
              {worstPlatform.growth > 0 ? '+' : ''}{worstPlatform.growth}
            </span> ({worstPlatform.growthPercent}%)
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>*Example calculation</p>
        </div>
      </div>

      {/* Platform Breakdown */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Platform Distribution</h2>
        <div className="card" style={{ padding: '2rem' }}>
          {platformStats.map(stat => (
            <div key={stat.platform} style={{ 
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: '600', textTransform: 'capitalize', fontSize: '1.1rem' }}>{stat.platform}</span>
                  <span style={{ color: '#64748b', marginLeft: '0.75rem', fontSize: '0.875rem' }}>
                    {stat.name}
                  </span>
                </div>
                <span style={{ color: '#64748b', fontWeight: '500' }}>{stat.percentage}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  flex: 1, 
                  height: '8px', 
                  backgroundColor: '#1e293b', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${stat.percentage}%`, 
                    height: '100%', 
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ minWidth: '180px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8', marginRight: '0.5rem' }}>
                    {stat.label}:
                  </span>
                  <span style={{ fontWeight: '600' }}>{stat.followers.toLocaleString()}</span>
                  <span style={{ 
                    marginLeft: '0.5rem',
                    color: stat.growth >= 0 ? '#1db954' : '#dc2626',
                    fontSize: '0.875rem'
                  }}>
                    ({stat.growth > 0 ? '+' : ''}{stat.growth})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform-Specific Breakdown */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Platform-Specific Metrics</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {Object.keys(platformBreakdown).map(platform => (
            <div key={platform} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <img src={`/images/icon-${platform}.svg`} alt={platform} style={{ width: '24px', height: '24px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', textTransform: 'capitalize' }}>{platform}</h3>
              </div>
              {platformBreakdown[platform].map(metric => (
                <div key={metric.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #1e293b'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{metric.metric}</span>
                  <span style={{ fontWeight: '600' }}>{(metric.value || metric.count || 0).toLocaleString()}</span>
                </div>
              ))}
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.75rem' }}>*Example data</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Performing Metrics */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Top 5 Performing Metrics</h2>
        <div className="grid grid--overview">
          {topMetrics.map(metric => (
            <article key={metric.id} className="card card--overview" data-brand={metric.brand}>
              <p className="metric">{metric.metric}</p>
              <img className="brand" src={`/images/icon-${metric.brand}.svg`} alt="" />
              <p className="value">{metric.value?.toLocaleString() || metric.count?.toLocaleString()}</p>
              <p className={`delta ${metric.deltaDirection === 'up' ? 'delta--up' : 'delta--down'}`}>
                <img src={`/images/icon-${metric.deltaDirection}.svg`} alt="" />
                <span>{metric.deltaPercent || metric.change}%</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom 5 Metrics - Needs Improvement */}
      <section>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Bottom 5 Metrics - Focus Areas</h2>
        <div className="grid grid--overview">
          {bottomMetrics.map(metric => (
            <article key={metric.id} className="card card--overview" data-brand={metric.brand} style={{ opacity: 0.8 }}>
              <p className="metric">{metric.metric}</p>
              <img className="brand" src={`/images/icon-${metric.brand}.svg`} alt="" />
              <p className="value">{metric.value?.toLocaleString() || metric.count?.toLocaleString()}</p>
              <p className={`delta ${metric.deltaDirection === 'up' ? 'delta--up' : 'delta--down'}`}>
                <img src={`/images/icon-${metric.deltaDirection}.svg`} alt="" />
                <span>{metric.deltaPercent || metric.change}%</span>
              </p>
            </article>
          ))}
        </div>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '1rem', textAlign: 'center' }}>
          *All analytics are examples using mock data for demonstration purposes
        </p>
      </section>
    </div>
  );
}
