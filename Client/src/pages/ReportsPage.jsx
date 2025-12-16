import React, { useState } from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function ReportsPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['all']);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: 'Weekly Team Update',
      frequency: 'weekly',
      day: 'Monday',
      time: '09:00',
      recipients: 'team@company.com',
      reportType: 'summary',
      platforms: ['all'],
      status: 'active'
    }
  ]);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'weekly',
    day: 'Monday',
    time: '09:00',
    recipients: '',
    reportType: 'summary',
    platforms: ['all']
  });

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
    
    // Generate report content
    const reportContent = generateReportContent(reportType, platformText);
    
    // Create filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `${reportType.replace(/\s+/g, '_')}_${selectedPeriod}_${date}`;
    
    // Download based on format
    if (format === 'PDF') {
      downloadAsPDF(reportContent, filename);
    } else if (format === 'Excel') {
      downloadAsExcel(reportContent, filename);
    } else if (format === 'CSV') {
      downloadAsCSV(reportContent, filename);
    }
  };

  const handleDownloadReport = (report) => {
    // Generate content for existing report
    const reportContent = generateReportContent(report.name, report.platforms.join(', '));
    
    // Download based on format
    if (report.format === 'PDF') {
      downloadAsPDF(reportContent, report.name.replace(/\s+/g, '_'));
    } else if (report.format === 'Excel') {
      downloadAsExcel(reportContent, report.name.replace(/\s+/g, '_'));
    } else {
      downloadAsCSV(reportContent, report.name.replace(/\s+/g, '_'));
    }
  };

  // Generate report content
  const generateReportContent = (reportName, platforms) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return {
      title: reportName,
      generatedDate: date,
      generatedTime: time,
      period: selectedPeriod.toUpperCase(),
      platforms: platforms,
      data: [
        { platform: 'Facebook', followers: 1987, engagement: 87, likes: 52, views: 87 },
        { platform: 'Twitter', followers: 1044, engagement: 117, likes: 507, views: 553 },
        { platform: 'Instagram', followers: 11734, engagement: 5462, likes: 5462, views: 52306 },
        { platform: 'YouTube', followers: 8239, engagement: 1407, likes: 107, views: 1407 }
      ],
      summary: {
        totalFollowers: 23004,
        avgEngagement: 1768.25,
        topPlatform: 'Instagram',
        growthRate: '+12.3%'
      }
    };
  };

  // Download as PDF (HTML-based PDF)
  const downloadAsPDF = (content, filename) => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${content.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
    .meta { color: #64748b; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background-color: #f1f5f9; color: #1e293b; font-weight: 600; }
    .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px; }
    .summary h2 { margin-top: 0; color: #334155; }
    .stat { display: inline-block; margin: 10px 20px 10px 0; }
    .stat-label { color: #64748b; font-size: 14px; }
    .stat-value { color: #1e293b; font-size: 24px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>� ${content.title}</h1>
  <div class="meta">
    <strong>Generated:</strong> ${content.generatedDate} at ${content.generatedTime}<br>
    <strong>Period:</strong> ${content.period}<br>
    <strong>Platforms:</strong> ${content.platforms}
  </div>
  
  <h2>Platform Performance</h2>
  <table>
    <thead>
      <tr>
        <th>Platform</th>
        <th>Followers</th>
        <th>Engagement</th>
        <th>Likes</th>
        <th>Views</th>
      </tr>
    </thead>
    <tbody>
      ${content.data.map(row => `
        <tr>
          <td><strong>${row.platform}</strong></td>
          <td>${row.followers.toLocaleString()}</td>
          <td>${row.engagement.toLocaleString()}</td>
          <td>${row.likes.toLocaleString()}</td>
          <td>${row.views.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="summary">
    <h2>Executive Summary</h2>
    <div class="stat">
      <div class="stat-label">Total Followers</div>
      <div class="stat-value">${content.summary.totalFollowers.toLocaleString()}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Avg Engagement</div>
      <div class="stat-value">${content.summary.avgEngagement.toLocaleString()}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Top Platform</div>
      <div class="stat-value">${content.summary.topPlatform}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Growth Rate</div>
      <div class="stat-value">${content.summary.growthRate}</div>
    </div>
  </div>
  
  <p style="margin-top: 40px; color: #94a3b8; font-size: 12px;">
    This report was automatically generated by Social Media Dashboard<br>
    For questions, contact your analytics team
  </p>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Report downloaded as HTML!\n\n📄 ${filename}.html\n\nOpen this file in your browser and use Print > Save as PDF to create a PDF file.`);
  };

  // Download as Excel (CSV format for Excel)
  const downloadAsExcel = (content, filename) => {
    const csvContent = [
      [`Social Media Report - ${content.title}`],
      [`Generated: ${content.generatedDate} at ${content.generatedTime}`],
      [`Period: ${content.period}`],
      [`Platforms: ${content.platforms}`],
      [],
      ['Platform', 'Followers', 'Engagement', 'Likes', 'Views'],
      ...content.data.map(row => [
        row.platform,
        row.followers,
        row.engagement,
        row.likes,
        row.views
      ]),
      [],
      ['Summary'],
      ['Total Followers', content.summary.totalFollowers],
      ['Average Engagement', content.summary.avgEngagement],
      ['Top Platform', content.summary.topPlatform],
      ['Growth Rate', content.summary.growthRate]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Report downloaded as CSV!\n\n📄 ${filename}.csv\n\nOpen this file in Excel or Google Sheets.`);
  };

  // Download as CSV
  const downloadAsCSV = (content, filename) => {
    const csvContent = [
      ['Platform', 'Followers', 'Engagement', 'Likes', 'Views'],
      ...content.data.map(row => [
        row.platform,
        row.followers,
        row.engagement,
        row.likes,
        row.views
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Report downloaded!\n\n📄 ${filename}.csv`);
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

  // Handle creating a new scheduled report
  const handleScheduleReport = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newSchedule.name.trim()) {
      alert('Please enter a name for the scheduled report');
      return;
    }
    
    if (!newSchedule.recipients.trim()) {
      alert('Please enter recipient email address(es)');
      return;
    }
    
    // Create new scheduled report
    const schedule = {
      id: Math.max(...scheduledReports.map(s => s.id), 0) + 1,
      ...newSchedule,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    setScheduledReports([...scheduledReports, schedule]);
    
    // Reset form and close modal
    setNewSchedule({
      name: '',
      frequency: 'weekly',
      day: 'Monday',
      time: '09:00',
      recipients: '',
      reportType: 'summary',
      platforms: ['all']
    });
    setShowScheduleModal(false);
    
    alert(`✅ Scheduled Report Created!\n\n📊 ${schedule.name}\n📅 Frequency: ${schedule.frequency}\n📧 Recipients: ${schedule.recipients}\n\nYour report will be automatically generated and sent!`);
  };

  // Handle deleting a scheduled report
  const handleDeleteSchedule = (id) => {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      setScheduledReports(scheduledReports.filter(s => s.id !== id));
    }
  };

  // Handle toggling schedule status
  const handleToggleSchedule = (id) => {
    setScheduledReports(scheduledReports.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
    ));
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
                    onClick={() => handleDownloadReport(report)}
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
                  onClick={() => setShowScheduleModal(true)}
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

            {/* Active Scheduled Reports List */}
            {scheduledReports.length > 0 && (
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                  Active Schedules ({scheduledReports.filter(s => s.status === 'active').length})
                </h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {scheduledReports.map(schedule => (
                    <div key={schedule.id} style={{
                      padding: '1rem',
                      backgroundColor: 'var(--card-bg)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{schedule.name}</strong>
                          <span style={{
                            padding: '0.125rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: schedule.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 146, 60, 0.1)',
                            color: schedule.status === 'active' ? '#22c55e' : '#fb923c'
                          }}>
                            {schedule.status === 'active' ? '● Active' : '⏸ Paused'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                          📅 {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} • 
                          {schedule.frequency === 'weekly' && ` ${schedule.day}s`}
                          {schedule.frequency === 'monthly' && ` on day ${schedule.day}`} • 
                          {schedule.time} • 
                          📧 {schedule.recipients}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '0.25rem' }}>
                            {reportTemplates.find(t => t.type === schedule.reportType)?.name || schedule.reportType}
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '0.25rem' }}>
                            {schedule.platforms.includes('all') ? 'All Platforms' : schedule.platforms.join(', ')}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleToggleSchedule(schedule.id)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            backgroundColor: 'transparent',
                            color: 'var(--text)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s'
                          }}
                          title={schedule.status === 'active' ? 'Pause' : 'Resume'}
                        >
                          {schedule.status === 'active' ? '⏸' : '▶️'}
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s'
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schedule Report Modal */}
          {showScheduleModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}>
              <div style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '1rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Modal Header */}
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                    📅 Schedule Report
                  </h2>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: 'var(--muted)',
                      padding: '0.25rem',
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleScheduleReport} style={{ padding: '1.5rem' }}>
                  {/* Report Name */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                      Report Name *
                    </label>
                    <input
                      type="text"
                      value={newSchedule.name}
                      onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                      placeholder="e.g., Weekly Team Update"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  {/* Frequency */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                      Frequency *
                    </label>
                    <select
                      value={newSchedule.frequency}
                      onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  {/* Day (for weekly/monthly) */}
                  {newSchedule.frequency !== 'daily' && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                        {newSchedule.frequency === 'weekly' ? 'Day of Week' : 'Day of Month'} *
                      </label>
                      {newSchedule.frequency === 'weekly' ? (
                        <select
                          value={newSchedule.day}
                          onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            backgroundColor: 'var(--bg)',
                            color: 'var(--text)',
                            fontSize: '0.95rem'
                          }}
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      ) : (
                        <input
                          type="number"
                          min="1"
                          max="28"
                          value={newSchedule.day}
                          onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            backgroundColor: 'var(--bg)',
                            color: 'var(--text)',
                            fontSize: '0.95rem'
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Time */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                      Time *
                    </label>
                    <input
                      type="time"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  {/* Report Type */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                      Report Type *
                    </label>
                    <select
                      value={newSchedule.reportType}
                      onChange={(e) => setNewSchedule({ ...newSchedule, reportType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.95rem'
                      }}
                    >
                      {reportTemplates.map(template => (
                        <option key={template.type} value={template.type}>
                          {template.icon} {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Recipients */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                      Email Recipients * <span style={{ color: '#64748b', fontWeight: '400', fontSize: '0.85rem' }}>(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={newSchedule.recipients}
                      onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                      placeholder="email1@example.com, email2@example.com"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  {/* Platforms */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                      Platforms
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {platforms.map(platform => (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => {
                            if (platform.id === 'all') {
                              setNewSchedule({ ...newSchedule, platforms: ['all'] });
                            } else {
                              const filtered = newSchedule.platforms.filter(p => p !== 'all');
                              if (filtered.includes(platform.id)) {
                                const newPlatforms = filtered.filter(p => p !== platform.id);
                                setNewSchedule({ ...newSchedule, platforms: newPlatforms.length === 0 ? ['all'] : newPlatforms });
                              } else {
                                setNewSchedule({ ...newSchedule, platforms: [...filtered, platform.id] });
                              }
                            }
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            border: newSchedule.platforms.includes(platform.id) ? '2px solid #3b82f6' : '1px solid rgba(148, 163, 184, 0.3)',
                            backgroundColor: newSchedule.platforms.includes(platform.id) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            color: newSchedule.platforms.includes(platform.id) ? '#3b82f6' : 'var(--text)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                          }}
                        >
                          {platform.icon} {platform.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                    <button
                      type="button"
                      onClick={() => setShowScheduleModal(false)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        backgroundColor: 'transparent',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      Create Schedule
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

export default ReportsPage;
