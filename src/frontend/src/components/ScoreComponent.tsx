import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Trophy, 
  TrendingUp, 
  Target, 
  Zap, 
  Award, 
  BarChart3, 
  Activity,
  Shield,
  Brain,
  Clock,
  CheckCircle,
  Layers,
  Cpu,
  Database,
  GitBranch,
  Star,
  LineChart,
  PieChart,
  Target as TargetIcon,
  Download,
  Share2,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
    }> = [];

    const particleCount = 50;
    const colors = [
      'rgba(96, 165, 250, 0.4)',
      'rgba(167, 139, 250, 0.4)',
      'rgba(6, 182, 212, 0.4)',
      'rgba(34, 211, 238, 0.4)',
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1 + 0.5,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.2 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.4', particle.alpha.toString());
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend, description }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative group"
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`} />
    <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <TrendingUp className={`w-3 h-3 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
            <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {subtitle && <span className="text-gray-400 text-lg">{subtitle}</span>}
        </div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </div>
  </motion.div>
);

const ProgressRing = ({ value, label, color, size = 100 }: any) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${label.replace(/\s+/g, '-')})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id={`gradient-${label.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color.split(' ')[1]} />
              <stop offset="100%" stopColor={color.split(' ')[3]} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{value.toFixed(0)}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-300 mt-3">{label}</span>
    </div>
  );
};

const ClassPerformanceItem = ({ label, accuracy, color, rank }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div>
        <span className="text-white font-medium">{label}</span>
        <div className="flex items-center gap-2 mt-1">
          <Star className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-gray-400">Rank #{rank}</span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <span className="text-xl font-bold text-white">{accuracy}%</span>
      <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${accuracy}%` }}
          transition={{ duration: 1 }}
          className="h-full"
          style={{
            background: `linear-gradient(to right, ${color.split(' ')[1]}, ${color.split(' ')[3]})`
          }}
        />
      </div>
    </div>
  </motion.div>
);

const ScoreComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'details'>('overview');
  const [timeRange, setTimeRange] = useState('7d');

  const overviewMetrics = [
    {
      title: "Overall Accuracy",
      value: "94.2",
      subtitle: "%",
      icon: Trophy,
      color: "from-yellow-500 to-orange-600",
      trend: 2.3,
      description: "Across all safety objects"
    },
    {
      title: "mAP@0.5",
      value: "89.7",
      subtitle: "%",
      icon: Target,
      color: "from-blue-500 to-cyan-600",
      trend: 1.8,
      description: "Mean Average Precision"
    },
    {
      title: "Inference Speed",
      value: "45",
      subtitle: "ms",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      trend: -5.2,
      description: "Per frame processing"
    },
    {
      title: "Total Detections",
      value: "12.5K",
      subtitle: "",
      icon: BarChart3,
      color: "from-emerald-500 to-green-600",
      trend: 15.7,
      description: "Successful identifications"
    },
    {
      title: "Precision Score",
      value: "93.5",
      subtitle: "%",
      icon: CheckCircle,
      color: "from-cyan-500 to-blue-600",
      trend: 0.8,
      description: "False positive rate"
    },
    {
      title: "Recall Rate",
      value: "91.8",
      subtitle: "%",
      icon: Activity,
      color: "from-pink-500 to-rose-600",
      trend: 1.2,
      description: "False negative rate"
    }
  ];

  const classPerformance = [
    { label: "OxygenTank", accuracy: 95.3, color: "from-blue-500 to-cyan-600", rank: 1 },
    { label: "FireExtinguisher", accuracy: 92.8, color: "from-purple-500 to-pink-600", rank: 2 },
    { label: "FirstAidBox", accuracy: 88.5, color: "from-emerald-500 to-green-600", rank: 3 },
    { label: "SafetySwitchPanel", accuracy: 91.2, color: "from-yellow-500 to-orange-600", rank: 4 },
    { label: "FireAlarm", accuracy: 87.9, color: "from-red-500 to-rose-600", rank: 5 },
    { label: "EmergencyPhone", accuracy: 85.6, color: "from-indigo-500 to-blue-600", rank: 6 },
    { label: "NitrogenTank", accuracy: 90.1, color: "from-cyan-500 to-teal-600", rank: 7 }
  ];

  const modelDetails = [
    { label: "Architecture", value: "YOLOv8 Nano", icon: Layers, color: "from-blue-500 to-cyan-600" },
    { label: "Parameters", value: "25.9M", icon: Cpu, color: "from-purple-500 to-pink-600" },
    { label: "Model Size", value: "52.4 MB", icon: Database, color: "from-emerald-500 to-green-600" },
    { label: "Framework", value: "PyTorch 2.0", icon: GitBranch, color: "from-yellow-500 to-orange-600" },
    { label: "Training Epochs", value: "300", icon: Clock, color: "from-red-500 to-rose-600" },
    { label: "Dataset Size", value: "15K images", icon: Shield, color: "from-indigo-500 to-blue-600" }
  ];

  const performanceMetrics = [
    { label: "F1-Score", value: 92.6, color: "from-cyan-500 to-blue-600" },
    { label: "IoU Score", value: 88.3, color: "from-purple-500 to-pink-600" },
    { label: "Precision", value: 93.5, color: "from-emerald-500 to-green-600" },
    { label: "Recall", value: 91.8, color: "from-yellow-500 to-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white font-sans overflow-hidden relative">
      <ParticleBackground />
      
      {/* Animated Scan Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
            animate={{ y: [0, '100vh'] }}
            transition={{
              duration: 3 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden md:inline">Back to Dashboard</span>
              </motion.button>
              
              
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl">
                <Clock className="w-4 h-4 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent text-sm outline-none"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Award-Winning AI Performance
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Model Performance
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-white/90">Space Station Safety AI</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive analytics and metrics for AetherScan's object detection system.
            Track performance, accuracy, and efficiency in real-time.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'performance', label: 'Performance', icon: LineChart },
              { id: 'details', label: 'Model Details', icon: Layers }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-500/30 text-white'
                    : 'bg-gray-900/30 border-gray-700/50 text-gray-400 hover:border-cyan-500/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Overview Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overviewMetrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>

              {/* Class Performance */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl">
                        <TargetIcon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Class Performance</h2>
                        <p className="text-gray-400">Detection accuracy by safety object</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        {classPerformance.map((item, index) => (
                          <ClassPerformanceItem key={index} {...item} />
                        ))}
                      </div>
                      <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30">
                        <h3 className="text-lg font-semibold text-white mb-6 text-center">
                          Performance Distribution
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                          {performanceMetrics.map((metric, index) => (
                            <ProgressRing
                              key={index}
                              value={metric.value}
                              label={metric.label}
                              color={metric.color}
                              size={120}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Performance Charts */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-cyan-400" />
                      Performance Trends
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <LineChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Performance trend visualization</p>
                        <p className="text-sm text-gray-500">Real-time metrics coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-400" />
                      Accuracy Distribution
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <PieChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Accuracy distribution visualization</p>
                        <p className="text-sm text-gray-500">Detailed analytics coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl">
                        <Activity className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Detailed Metrics</h2>
                        <p className="text-gray-400">Comprehensive performance analysis</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: "Training Accuracy", value: "94.2%", change: "+2.3%" },
                        { label: "Validation Loss", value: "0.023", change: "-0.8%" },
                        { label: "Inference Speed", value: "45ms", change: "-5.2%" },
                        { label: "Model Confidence", value: "92.8%", change: "+1.5%" }
                      ].map((metric, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30"
                        >
                          <div className="text-sm text-gray-400 mb-2">{metric.label}</div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{metric.value}</span>
                            <span className={`text-sm font-semibold ${metric.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Model Details Tab */}
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Model Information */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl">
                        <Brain className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Model Information</h2>
                        <p className="text-gray-400">Technical specifications and architecture</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {modelDetails.map((detail, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${detail.color} bg-opacity-20`}>
                              <detail.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">{detail.label}</h3>
                          </div>
                          <div className="text-2xl font-bold text-white mb-2">{detail.value}</div>
                          <div className="text-xs text-gray-500">
                            {detail.label === 'Architecture' && 'YOLOv8 Nano optimized for edge devices'}
                            {detail.label === 'Parameters' && 'Total trainable parameters'}
                            {detail.label === 'Model Size' && 'Compressed size for deployment'}
                            {detail.label === 'Framework' && 'Machine learning framework'}
                            {detail.label === 'Training Epochs' && 'Total training iterations'}
                            {detail.label === 'Dataset Size' && 'Annotated training images'}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Details */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      Training Timeline
                    </h3>
                    <div className="space-y-4">
                      {[
                        { phase: 'Data Collection', duration: '2 weeks', status: 'completed' },
                        { phase: 'Model Training', duration: '1 week', status: 'completed' },
                        { phase: 'Validation', duration: '2 days', status: 'completed' },
                        { phase: 'Optimization', duration: '3 days', status: 'in-progress' }
                      ].map((phase, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              phase.status === 'completed' ? 'bg-emerald-500' :
                              phase.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <span className="text-white">{phase.phase}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-300">{phase.duration}</span>
                            <div className="text-xs text-gray-500 capitalize">{phase.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      System Requirements
                    </h3>
                    <div className="space-y-3">
                      {[
                        { requirement: 'GPU Memory', value: '4GB minimum', recommended: '8GB' },
                        { requirement: 'CPU', value: '4 cores minimum', recommended: '8 cores' },
                        { requirement: 'RAM', value: '8GB minimum', recommended: '16GB' },
                        { requirement: 'Storage', value: '500MB', recommended: '1GB free' }
                      ].map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                        >
                          <span className="text-gray-300">{req.requirement}</span>
                          <div className="text-right">
                            <div className="text-white font-medium">{req.value}</div>
                            <div className="text-xs text-gray-500">Recommended: {req.recommended}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-500/10 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Improve Your Model?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Access detailed analytics, compare performance metrics, and optimize your AI model with our advanced tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 text-white font-semibold rounded-xl hover:bg-gray-700/50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh Data
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>

      <style>{`
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0ea5e9, #2563eb);
        }
        
        /* Smooth animations */
        * {
          scroll-behavior: smooth;
        }
        
        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

// Add missing imports
import { useRef, useEffect } from 'react';

export default ScoreComponent;