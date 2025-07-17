import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Share2, 
  Plus,
  Calendar,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  RefreshCw,
  Mail,
  Link,
  Settings,
  Crown,
  Palette,
  Users,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock reports data
  const [reports] = useState([
    {
      id: 1,
      name: 'Weekly Performance Report',
      type: 'weekly',
      status: 'completed',
      createdAt: '2024-01-28',
      size: '2.3 MB',
      format: 'PDF',
      isScheduled: true,
      nextRun: '2024-02-04',
      metrics: ['followers', 'engagement', 'reach'],
      platforms: ['instagram', 'facebook']
    },
    {
      id: 2,
      name: 'Monthly Analytics Summary',
      type: 'monthly',
      status: 'generating',
      createdAt: '2024-01-26',
      size: null,
      format: 'PDF',
      isScheduled: false,
      nextRun: null,
      metrics: ['followers', 'engagement', 'reach', 'impressions'],
      platforms: ['instagram', 'facebook']
    },
    {
      id: 3,
      name: 'Campaign Performance',
      type: 'custom',
      status: 'completed',
      createdAt: '2024-01-24',
      size: '1.8 MB',
      format: 'PDF',
      isScheduled: false,
      nextRun: null,
      metrics: ['engagement', 'reach', 'conversions'],
      platforms: ['instagram']
    }
  ]);

  const templates = [
    {
      id: 'weekly',
      name: 'Weekly Summary',
      description: 'Comprehensive weekly performance overview',
      metrics: ['Followers Growth', 'Engagement Rate', 'Reach', 'Top Posts'],
      duration: '7 days',
      icon: Calendar,
      recommended: true
    },
    {
      id: 'monthly',
      name: 'Monthly Deep Dive',
      description: 'Detailed monthly analytics and insights',
      metrics: ['All Key Metrics', 'Demographics', 'Trends', 'Comparisons'],
      duration: '30 days',
      icon: BarChart3,
      recommended: false
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Build your own report with selected metrics',
      metrics: ['Choose Your Metrics', 'Custom Date Range', 'Platform Selection'],
      duration: 'Custom',
      icon: Settings,
      recommended: false
    },
    {
      id: 'client',
      name: 'Client Report',
      description: 'White-labeled report for clients',
      metrics: ['Executive Summary', 'Key Insights', 'Recommendations'],
      duration: 'Custom',
      icon: Users,
      recommended: false,
      isPro: true
    }
  ];

  const handleGenerateReport = async (templateId: string) => {
    setIsGenerating(true);
    setSelectedTemplate(templateId);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowCreateModal(false);
      setSelectedTemplate('');
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-brand-lime/10 text-brand-lime border-brand-lime/20';
      case 'generating':
        return 'bg-brand-amber/10 text-brand-amber border-brand-amber/20';
      case 'failed':
        return 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 border-error-200 dark:border-error-800';
      default:
        return 'bg-brand-zinc/10 text-brand-zinc border-brand-zinc/20';
    }
  };

  const ReportCard = ({ report }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand hover:shadow-brand-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-brand-electric/10 rounded-lg">
            <FileText size={20} className="text-brand-electric" />
          </div>
          <div>
            <h3 className="font-semibold text-brand-void dark:text-brand-pure mb-1">{report.name}</h3>
            <div className="flex items-center gap-2 text-sm text-brand-zinc dark:text-brand-frost">
              <span>Created {report.createdAt}</span>
              {report.size && <span>• {report.size}</span>}
              <span>• {report.format}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(report.status)}`}>
          {report.status === 'generating' && <RefreshCw size={12} className="inline mr-1 animate-spin" />}
          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap gap-1">
          {report.metrics.map((metric: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-brand-electric/10 text-brand-electric text-xs rounded-full">
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </span>
          ))}
        </div>
        
        {report.isScheduled && (
          <div className="flex items-center gap-2 text-sm text-brand-zinc dark:text-brand-frost">
            <Clock size={14} />
            <span>Next run: {report.nextRun}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-brand-frost/20 dark:border-brand-zinc/30">
        <div className="flex items-center gap-2">
          <button className="p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric hover:bg-brand-electric/10 rounded-lg transition-all duration-200">
            <Eye size={16} />
          </button>
          <button className="p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric hover:bg-brand-electric/10 rounded-lg transition-all duration-200">
            <Edit3 size={16} />
          </button>
          <button className="p-2 text-brand-zinc dark:text-brand-frost hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all duration-200">
            <Trash2 size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric hover:bg-brand-electric/10 rounded-lg transition-all duration-200">
            <Share2 size={16} />
          </button>
          {report.status === 'completed' && (
            <button className="p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric hover:bg-brand-electric/10 rounded-lg transition-all duration-200">
              <Download size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const TemplateCard = ({ template }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand hover:shadow-brand-lg transition-all duration-300 cursor-pointer group ${
        selectedTemplate === template.id ? 'ring-2 ring-brand-electric' : ''
      } ${template.isPro && user?.role === 'free' ? 'opacity-75' : ''}`}
      onClick={() => !template.isPro || user?.role !== 'free' ? setSelectedTemplate(template.id) : null}
    >
      {template.recommended && (
        <div className="absolute -top-2 -right-2 bg-brand-lime text-brand-void text-xs font-bold px-2 py-1 rounded-full">
          Recommended
        </div>
      )}
      {template.isPro && (
        <div className="absolute -top-2 -left-2 bg-brand-violet text-brand-pure text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Crown size={10} />
          Pro
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-brand-electric/10 rounded-lg">
          <template.icon size={24} className="text-brand-electric" />
        </div>
        <div>
          <h3 className="font-semibold text-brand-void dark:text-brand-pure">{template.name}</h3>
          <p className="text-sm text-brand-zinc dark:text-brand-frost">{template.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">Includes:</h4>
          <div className="space-y-1">
            {template.metrics.map((metric: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm text-brand-zinc dark:text-brand-frost">
                <CheckCircle2 size={14} className="text-brand-lime" />
                {metric}
              </div>
            ))}
          </div>
        </div>
        <div className="text-sm text-brand-zinc dark:text-brand-frost">
          <strong>Duration:</strong> {template.duration}
        </div>
      </div>

      {template.isPro && user?.role === 'free' && (
        <div className="absolute inset-0 bg-brand-void/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Crown size={24} className="text-brand-violet mx-auto mb-2" />
            <p className="text-sm font-medium text-brand-void dark:text-brand-pure">Pro Feature</p>
            <button className="mt-2 px-4 py-2 bg-brand-violet text-brand-pure text-xs font-medium rounded-lg hover:bg-brand-violet/80 transition-colors duration-200">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText size={28} className="text-brand-electric" />
            <h1 className="text-3xl font-bold text-brand-void dark:text-brand-pure">Reports</h1>
          </div>
          <p className="text-brand-zinc dark:text-brand-frost">
            Generate and manage your social media reports with professional insights.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 shadow-electric-glow hover:shadow-electric-glow"
        >
          <Plus size={18} />
          <span className="font-medium">Create Report</span>
        </button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={20} className="text-brand-electric" />
            <h3 className="font-medium text-brand-zinc dark:text-brand-frost">Total Reports</h3>
          </div>
          <p className="text-2xl font-bold text-brand-void dark:text-brand-pure">24</p>
        </div>
        <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-brand-amber" />
            <h3 className="font-medium text-brand-zinc dark:text-brand-frost">Scheduled</h3>
          </div>
          <p className="text-2xl font-bold text-brand-void dark:text-brand-pure">5</p>
        </div>
        <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
          <div className="flex items-center gap-3 mb-2">
            <Download size={20} className="text-brand-lime" />
            <h3 className="font-medium text-brand-zinc dark:text-brand-frost">Downloads</h3>
          </div>
          <p className="text-2xl font-bold text-brand-void dark:text-brand-pure">156</p>
        </div>
        <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
          <div className="flex items-center gap-3 mb-2">
            <Share2 size={20} className="text-brand-neon" />
            <h3 className="font-medium text-brand-zinc dark:text-brand-frost">Shared</h3>
          </div>
          <p className="text-2xl font-bold text-brand-void dark:text-brand-pure">42</p>
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure">Recent Reports</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-frost/10 dark:bg-brand-carbon/30 text-brand-zinc dark:text-brand-frost rounded-lg hover:text-brand-electric transition-all duration-200">
              <Filter size={16} />
              <span className="text-sm">Filter</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </motion.div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-brand-void/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-pure dark:bg-brand-carbon rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-brand-void dark:text-brand-pure">Create New Report</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-brand-zinc dark:text-brand-frost hover:text-error-500 transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            {isGenerating ? (
              <div className="text-center py-12">
                <RefreshCw size={48} className="text-brand-electric mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-2">Generating Report...</h3>
                <p className="text-brand-zinc dark:text-brand-frost">This may take a few moments.</p>
              </div>
            ) : (
              <>
                <p className="text-brand-zinc dark:text-brand-frost mb-6">
                  Choose a template to get started with your report generation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {templates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-brand-frost/20 dark:border-brand-zinc/30">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 text-brand-zinc dark:text-brand-frost rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleGenerateReport(selectedTemplate)}
                    disabled={!selectedTemplate}
                    className="px-6 py-3 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Report
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reports;