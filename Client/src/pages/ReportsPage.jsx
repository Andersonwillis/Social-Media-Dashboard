import React, { useState } from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function ReportsPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['all']);

  // Mock report templates
  const reportTemplates = [
    {
      id: 1,
      name: 'Monthly Performance Summary',
      description: 'Comprehensive overview of all metrics across platforms',
      icon: '📊',
      estimatedSize: '2.3 MB',
      lastGenerated: '2024-12-01',
      type: 'summary'
    },
    {
      id: 2,
      name: 'Engagement Deep Dive',
      description: 'Detailed analysis of likes, comments, shares, and interactions',
      icon: '💬',
      estimatedSize: '1.8 MB',
      lastGenerated: '2024-12-01',
      type: 'engagement'
    },
    {
      id: 3,
      name: 'Follower Growth Report',
      description: 'Track follower acquisition and retention trends',
      icon: '📈',
      estimatedSize: '1.2 MB',
      lastGenerated: '2024-11-30',
      type: 'growth'
    },
    {
      id: 4,
      name: 'Platform Comparison',
      description: 'Side-by-side comparison of all social media platforms',
      icon: '⚖️',
      estimatedSize: '1.5 MB',
      lastGenerated: '2024-12-01',
      type: 'comparison'
    },
    {
      id: 5,
      name: 'Content Performance',
      description: 'Analysis of top-performing posts and content types',
      icon: '🎯',
      estimatedSize: '2.1 MB',
      lastGenerated: '2024-12-01',
      type: 'content'
    },
    {
      id: 6,
      name: 'Executive Summary',
      description: 'High-level overview for stakeholders and executives',
      icon: '👔',
      estimatedSize: '800 KB',
      lastGenerated: '2024-12-01',
      type: 'executive'
    }
  ];

  // Recent reports history
  const recentReports = [
    {
      id: 1,
      name: 'November 2024 - Full Report',
      date: '2024-12-01',
      format: 'PDF',
      size: '2.3 MB',
      platforms: ['Facebook', 'Instagram', 'Twitter', 'YouTube']
    },
    {
      id: 2,
      name: 'Q3 2024 Summary',
      date: '2024-10-01',
      format: 'Excel',
      size: '1.9 MB',
      platforms: ['All Platforms']
    },
    {
      id: 3,
      name: 'Instagram Deep Dive - Oct',
      date: '2024-10-15',
      format: 'PDF',
      size: '1.4 MB',
      platforms: ['Instagram']
    },
    {
      id: 4,
      name: 'Weekly Summary - Week 48',
      date: '2024-11-28',
      format: 'PDF',
      size: '950 KB',
      platforms: ['All Platforms']
    }
  ];

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'youtube', name: 'YouTube', icon: '▶️' }
  ];

  const handleGenerateReport = (reportType, format) => {
    const platformText = selectedPlatforms.includes('all') 
      ? 'All Platforms' 
      : selectedPlatforms.map(p => platforms.find(pl => pl.id === p)?.name).join(', ');
    
    alert(`✅ Generating ${reportType}\n\n📅 Period: ${selectedPeriod.toUpperCase()}\n🌐 Platforms: ${platformText}\n📄 Format: ${format}\n\n⏳ This would download a real ${format} file in production!`);
  };

  const handleDownloadReport = (reportName) => {
    alert(`⬇️ Downloading: ${reportName}\n\nThis would download the actual file in production!`);
  };

  const togglePlatform = (platformId) => {
    if (platformId === 'all') {
      setSelectedPlatforms(['all']);
    } else {
      const filtered = selectedPlatforms.filter(p => p !== 'all');
      if (filtered.includes(platformId)) {
        const newSelection = filtered.filter(p => p !== platformId);
        setSelectedPlatforms(newSelection.length === 0 ? ['all'] : newSelection);
      } else {
        setSelectedPlatforms([...filtered, platformId]);
      }
    }
  };

  // Filter report templates based on selected period and platforms
  const getFilteredTemplates = () => {
    // Base size multipliers based on period
    let periodMultiplier = 1;
    if (selectedPeriod === 'year') periodMultiplier = 4;
    else if (selectedPeriod === 'quarter') periodMultiplier = 2;
    else if (selectedPeriod === 'week') periodMultiplier = 0.25;
    
    // Platform multiplier (fewer platforms = smaller files)
    let platformMultiplier = 1;
    if (!selectedPlatforms.includes('all')) {
      platformMultiplier = selectedPlatforms.length / 4; // 4 total platforms
    }
    
    return reportTemplates.map(template => {
      const baseSize = parseFloat(template.estimatedSize);
      const finalSize = baseSize * periodMultiplier * platformMultiplier;
      
      return {
        ...template,
        estimatedSize: finalSize >= 1 
          ? `${finalSize.toFixed(1)} MB` 
          : `${(finalSize * 1024).toFixed(0)} KB`,
        recommended: selectedPeriod === 'month' && template.type === 'summary' ||
                     selectedPeriod === 'year' && template.type === 'executive' ||
                     selectedPeriod === 'week' && template.type === 'engagement'
      };
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <SignedOut>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2 className="title" style={{ marginBottom: '1rem' }}>
            Reports & Exports
          </h2>
          <p className="subtitle" style={{ marginBottom: '2rem' }}>
            Please sign in to generate and download reports.
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
            Reports & Exports
          </h1>
          <p className="subtitle" style={{ marginBottom: '2rem' }}>
            Generate and download comprehensive reports of your social media performance
          </p>

          {/* Report Configuration */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
              Report Settings
            </h2>
            
            {/* Time Period Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.75rem' }}>
                Time Period
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {['week', 'month', 'quarter', 'year', 'custom'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: selectedPeriod === period ? '1px solid #3b82f6' : '1px solid #334155',
                      backgroundColor: selectedPeriod === period ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      color: selectedPeriod === period ? '#3b82f6' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize'
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.75rem' }}>
                Platforms
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: selectedPlatforms.includes(platform.id) ? '1px solid #3b82f6' : '1px solid #334155',
                      backgroundColor: selectedPlatforms.includes(platform.id) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      color: selectedPlatforms.includes(platform.id) ? '#3b82f6' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>{platform.icon}</span>
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #334155' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  Total Reports Generated
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                  247
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  This Month
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                  18
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  Last Generated
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                  2h ago
                </p>
              </div>
            </div>
          </div>

          {/* Report Templates */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                Report Templates
              </h2>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Showing {getFilteredTemplates().length} templates for <span style={{ color: '#3b82f6', fontWeight: '600' }}>{selectedPeriod}</span> period
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {getFilteredTemplates().map((template) => (
                <div
                  key={template.id}
                  className="card"
                  style={{ 
                    padding: '1.5rem', 
                    transition: 'all 0.2s',
                    border: template.recommended ? '2px solid #3b82f6' : 'none',
                    position: 'relative'
                  }}
                >
                  {template.recommended && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '-10px', 
                      right: '10px', 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      ⭐ Recommended
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>{template.icon}</div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                      color: '#3b82f6', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      {template.type}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {template.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                    {template.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                    <span>~{template.estimatedSize}</span>
                    <span>Last: {new Date(template.lastGenerated).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleGenerateReport(template.name, 'PDF')}
                      style={{
                        flex: 1,
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={() => handleGenerateReport(template.name, 'CSV')}
                      style={{
                        flex: 1,
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                      📊 CSV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
              Recent Reports
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="card"
                  style={{ 
                    padding: '1.5rem',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Icon */}
                  <div style={{ 
                    fontSize: '2rem',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '0.5rem'
                  }}>
                    📄
                  </div>

                  {/* Report Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                        {report.name}
                      </h3>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        backgroundColor: 'rgba(139, 92, 246, 0.15)', 
                        color: '#8b5cf6', 
                        padding: '3px 10px', 
                        borderRadius: '12px',
                        fontWeight: '600'
                      }}>
                        {report.format}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                      <span>📅 {new Date(report.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                      <span>💾 {report.size}</span>
                      <span>🌐 {report.platforms.join(', ')}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownloadReport(report.name)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                      e.currentTarget.style.color = '#3b82f6';
                    }}
                  >
                    <span>⬇</span>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Reports Section */}
          <div className="card" style={{ 
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ 
                fontSize: '3rem',
                width: '4rem',
                height: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                borderRadius: '1rem',
                flexShrink: 0
              }}>
                ⏰
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="section-title" style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>
                  Scheduled Reports
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Automatically generate and email reports on a regular schedule. Perfect for weekly team updates or monthly executive summaries.
                </p>
                <button
                  onClick={() => alert('📅 Schedule Reports\n\nThis feature would allow you to:\n• Set up recurring reports (daily, weekly, monthly)\n• Choose recipients and email templates\n• Customize report content and format\n• Track delivery history\n\nThis would open a scheduling interface in production!')}
                  style={{
                    padding: '0.875rem 1.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>+</span>
                  Set Up Scheduled Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default ReportsPage;
