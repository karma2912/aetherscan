import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Cpu, Play, Rocket, Bug, BookOpen, Server, Layers, Settings, Monitor, Shield, Zap, GitBranch, FileText, ExternalLink, ChevronRight, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

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

    const particleCount = 60;
    const colors = [
      'rgba(96, 165, 250, 0.3)',
      'rgba(167, 139, 250, 0.3)',
      'rgba(6, 182, 212, 0.3)',
      'rgba(34, 211, 238, 0.3)',
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
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
        ctx.fillStyle = particle.color.replace('0.3', particle.alpha.toString());
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

const CodeBlock = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 p-2 bg-gray-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        {copied ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <Clipboard className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <pre className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 overflow-x-auto">
        <code className="text-gray-300 font-mono text-sm">{children}</code>
      </pre>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300"
  >
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 mb-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);

const StepCard = ({ number, title, children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative"
  >
    <div className="absolute -left-3 top-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
      {number}
    </div>
    <div className="ml-8 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  </motion.div>
);

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('quickstart');

  const sections = [
    { id: 'quickstart', label: 'Quick Start', icon: Rocket },
    { id: 'setup', label: 'Setup', icon: Settings },
    { id: 'training', label: 'Training', icon: Cpu },
    { id: 'running', label: 'Running App', icon: Play },
    { id: 'debug', label: 'Debugging', icon: Bug },
    { id: 'structure', label: 'Structure', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white font-sans overflow-hidden relative">
      <ParticleBackground />
      
      {/* Animated Scan Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden md:inline">Back to Dashboard</span>
                </Link>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/karma2912/aetherscan"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Complete Technical Documentation
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              AetherScan
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-white/90">Technical Documentation</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Complete setup and usage guide for AetherScan — a real-time object detection system for
            space-station safety monitoring powered by YOLOv11, Flask-SocketIO and React.
          </p>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <FeatureCard
            icon={Shield}
            title="Space Station Safety"
            description="Detect 7 critical space station safety objects under varying conditions with high precision"
            color="from-cyan-500 to-blue-600"
          />
          <FeatureCard
            icon={Zap}
            title="Real-time Processing"
            description="Live webcam detection with WebSocket streaming and instant object recognition"
            color="from-purple-500 to-pink-600"
          />
          <FeatureCard
            icon={Server}
            title="Full Stack AI System"
            description="End-to-end solution from training to deployment with comprehensive documentation"
            color="from-emerald-500 to-green-600"
          />
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  activeTab === section.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-500/30 text-white'
                    : 'bg-gray-900/30 border-gray-700/50 text-gray-400 hover:border-cyan-500/30'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span>{section.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Hackathon Objective */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl">
                    <Target className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Mission Objective</h2>
                    <p className="text-gray-400">Detect 7 critical space station safety objects</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Safety Objects to Detect:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'OxygenTank', 'NitrogenTank', 'FirstAidBox',
                        'FireAlarm', 'SafetySwitchPanel', 'EmergencyPhone', 'FireExtinguisher'
                      ].map((item, idx) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-2 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30"
                        >
                          <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                          <span className="text-gray-300">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Key Goals:</h3>
                    <ul className="space-y-3">
                      {[
                        "Train robust YOLO model on synthetic data from Duality AI's Falcon simulator",
                        "Evaluate model performance using mAP@0.5, Precision, Recall metrics",
                        "Create desktop/mobile app for real-time safety monitoring",
                        "Achieve >90% detection accuracy in varying conditions"
                      ].map((goal, idx) => (
                        <motion.li
                          key={goal}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                          <span className="text-gray-300">{goal}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Quick Start */}
          {(activeTab === 'quickstart' || activeTab === 'all') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl">
                      <Rocket className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Quick Start</h2>
                      <p className="text-gray-400">Get started in minutes with automated setup</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <StepCard number="1" title="Download Dataset">
                    <CodeBlock>
                      ./download_dataset.ps1
                    </CodeBlock>
                  </StepCard>

                  <StepCard number="2" title="Train Model">
                    <CodeBlock>
                      make train
                    </CodeBlock>
                  </StepCard>

                  <StepCard number="3" title="Launch Application">
                    <CodeBlock>
                      make run
                    </CodeBlock>
                  </StepCard>

                  <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-cyan-400" />
                        Frontend
                      </h4>
                      <CodeBlock>
                        make install-client\nmake client
                      </CodeBlock>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Server className="w-5 h-5 text-cyan-400" />
                        Backend
                      </h4>
                      <CodeBlock>
                        make backend
                      </CodeBlock>
                      <p className="text-gray-400 text-sm mt-2">
                        Ensure dataset is downloaded and model trained first
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Setup Instructions */}
          {(activeTab === 'setup' || activeTab === 'all') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl">
                      <Terminal className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Setup Instructions</h2>
                      <p className="text-gray-400">Complete environment configuration</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <StepCard number="1" title="Clone Repository">
                    <CodeBlock>
                      git clone https://github.com/karma2912/aetherscan aetherscan
                    </CodeBlock>
                  </StepCard>

                  <StepCard number="2" title="Set up Python Environment">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Using conda:</h4>
                        <CodeBlock>
                          conda env create -f environment.yml\nconda activate EDU
                        </CodeBlock>
                      </div>
                      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                        <h4 className="text-sm font-medium text-white mb-2">Dependencies Include:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {['torch', 'opencv-python', 'flask', 'flask-socketio', 'numpy', 'webview', 'socketio-client'].map((dep) => (
                            <span key={dep} className="text-xs text-gray-400 bg-gray-900/50 px-2 py-1 rounded">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </StepCard>

                  <StepCard number="3" title="Download Dataset">
                    <div className="space-y-4">
                      <p className="text-gray-300">Ensure dataset/ contains:</p>
                      <ul className="space-y-2 ml-4">
                        {['train/, val/, test/ folders', 'YOLO-compatible .txt labels', 'data.yaml describing class names and dataset paths'].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-300">
                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <CodeBlock>
                        ./download_dataset.ps1
                      </CodeBlock>
                    </div>
                  </StepCard>
                </div>
              </div>
            </motion.section>
          )}

          {/* Training */}
          {(activeTab === 'training' || activeTab === 'all') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl">
                      <Cpu className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Model Training & Evaluation</h2>
                      <p className="text-gray-400">Train and evaluate YOLO models</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <StepCard number="4" title="Train YOLO Model">
                    <div className="space-y-4">
                      <CodeBlock>
                        cd src/training\npython train.py --cfg config.yaml --data ../dataset/data.yaml --epochs 50 --batch-size 16
                      </CodeBlock>
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Outputs:</h4>
                        <ul className="space-y-1 ml-4">
                          {[
                            'Trained weights in runs/yolov11_experiment_x/weights/',
                            'Logs and metrics in runs/yolov11_experiment_x/'
                          ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-300">
                              <ChevronRight className="w-3 h-3 text-emerald-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </StepCard>

                  <StepCard number="5" title="Evaluate Model Performance">
                    <div className="space-y-4">
                      <CodeBlock>
                        python eval.py --weights ../runs/yolov11_experiment_x/weights/best.pt --data ../dataset/data.yaml
                      </CodeBlock>
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Generates:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {['mAP@0.5 scores', 'Confusion matrices', 'Precision/Recall metrics'].map((metric) => (
                            <div key={metric} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                              <span className="text-sm text-gray-300">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </StepCard>
                </div>
              </div>
            </motion.section>
          )}

          {/* Debugging Table */}
          {(activeTab === 'debug' || activeTab === 'all') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-red-500/20 to-rose-600/20 rounded-xl">
                      <Bug className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Debugging and Issues Faced</h2>
                      <p className="text-gray-400">Common problems and solutions</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="overflow-x-auto rounded-xl border border-gray-700/30">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-800/50">
                          <th className="py-4 px-6 text-left text-sm font-semibold text-white">Issue</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-white">Fix</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/30">
                        {[
                          ['Webcam not working', 'Check browser permissions; close other apps using webcam'],
                          ['WebSocket errors', 'Ensure backend is running on http://localhost:8000'],
                          ['No detections', 'Check MODEL_PATH in model_loader.py; verify weights exist'],
                          ['Slow training', 'Reduce batch size; monitor GPU usage with nvidia-smi']
                        ].map(([issue, fix], idx) => (
                          <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                            <td className="py-4 px-6 text-gray-300">{issue}</td>
                            <td className="py-4 px-6 text-gray-400">{fix}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Resources */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Additional Resources</h2>
                    <p className="text-gray-400">Further documentation and resources</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'GitHub Repository',
                      description: 'Full source code and issues',
                      icon: GitBranch,
                      link: 'https://github.com/karma2912/aetherscan'
                    },
                    {
                      title: 'Full README',
                      description: 'Complete project documentation',
                      icon: BookOpen,
                      link: 'https://github.com/karma2912/aetherscan'
                    },
                    {
                      title: 'Report Template',
                      description: 'Project report structure',
                      icon: FileText,
                      link: 'https://github.com/karma2912/aetherscan'
                    }
                  ].map((resource, idx) => (
                    <motion.a
                      key={resource.title}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="group/item bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl">
                          <resource.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-blue-400 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                      <p className="text-gray-400 text-sm">{resource.description}</p>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">
                        This project was created for a hackathon. Check the repository for license details.
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Contributions, issues, and feature requests are welcome!
                      </p>
                    </div>
                    <a
                      href="https://github.com/karma2912/aetherscan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all"
                    >
                      <GitBranch className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Floating Navigation */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
        >
          <ArrowLeft className="w-5 h-5 rotate-90" />
        </motion.button>
      </div>

      <style>{`
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
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
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Code block styling */
        pre {
          position: relative;
        }
        
        pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(to right, #06b6d4, #3b82f6);
        }
        
        /* Table styling */
        table {
          border-collapse: separate;
          border-spacing: 0;
        }
        
        th {
          background: linear-gradient(to right, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.5));
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

// Add the missing imports
import { useEffect, useRef } from 'react';
import { CheckCircle, Clipboard } from 'lucide-react';

export default Documentation;