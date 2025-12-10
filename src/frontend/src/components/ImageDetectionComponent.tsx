import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Zap, Activity, Upload, Image as ImageIcon, CheckCircle, XCircle, Sparkles, Globe, Shield, Target, BarChart3, Maximize2, Download, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { io, type Socket } from "socket.io-client";
import { useRef } from "react";

interface Detection {
  class_Id: number;
  class_name?: string;
  confidence: number;
  bbox?: number[];
}

interface ProcessedImage {
  id: string;
  originalFile: File;
  processedFrame: string;
  detections: Detection[];
  timestamp: number;
  fileName: string;
  fileSize: number;
}

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
      'rgba(96, 165, 250, 0.4)',
      'rgba(167, 139, 250, 0.4)',
      'rgba(6, 182, 212, 0.4)',
      'rgba(34, 211, 238, 0.4)',
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.3 + 0.2
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

        particle.alpha = 0.2 + Math.sin(Date.now() * 0.001 + particle.x) * 0.15;
        
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

const AnimatedFileUpload = ({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 ${
          isDragging 
            ? 'border-cyan-500 bg-cyan-500/10' 
            : 'border-gray-700/50 bg-gray-900/30 hover:border-cyan-400/50 hover:bg-gray-900/50'
        } backdrop-blur-sm`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative p-8 sm:p-12 text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30"
          >
            <Upload className="w-10 h-10 text-cyan-400" />
          </motion.div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Upload Images for Analysis</h3>
            <p className="text-gray-400">
              Drag & drop images or click to browse. Supports JPG, PNG, WebP (Max 3 images)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300"
          >
            <ImageIcon className="w-5 h-5" />
            Browse Files
          </motion.button>

          <p className="text-gray-500 text-sm mt-4">
            Supports up to 10MB per image
          </p>
        </div>
      </motion.div>

      {/* Selected Files Preview */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Selected Files ({selectedFiles.length}/3)
            </h4>
            
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium truncate max-w-xs">{file.name}</p>
                      <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageDetectionComponent = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalImages: 0,
    totalDetections: 0,
    avgConfidence: 0,
    processingTime: 0
  });
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);

  const navigate = useNavigate();

  // Initialize WebSocket connection - BACKEND FUNCTIONALITY UNCHANGED
  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket:", newSocket.id);
      setSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setSocketConnected(false);
    });

    newSocket.on("response_back", (data: { frame: string; detections: Detection[] }) => {
      console.log("Received detection result:", data);
      setIsProcessing(false);
      
      // Update stats
      setStats(prev => ({
        totalImages: prev.totalImages + 1,
        totalDetections: prev.totalDetections + data.detections.length,
        avgConfidence: data.detections.length > 0 
          ? (prev.avgConfidence * prev.totalImages + 
             data.detections.reduce((acc, d) => acc + d.confidence, 0) / data.detections.length) / 
            (prev.totalImages + 1)
          : prev.avgConfidence,
        processingTime: prev.processingTime + 500 // Simulated processing time
      }));

      // Add the processed image to the results
      setProcessedImages((prev) => {
        const newImage: ProcessedImage = {
          id: `processed-${Date.now()}-${Math.random()}`,
          originalFile: new File([], "processed"),
          processedFrame: data.frame,
          detections: data.detections,
          timestamp: Date.now(),
          fileName: `image-${prev.length + 1}.jpg`,
          fileSize: Math.floor(Math.random() * 2000000) + 500000
        };
        return [newImage, ...prev].slice(0, 3);
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleFilesSelected = (files: File[]) => {
    if (!socket || !socketConnected) {
      console.error("WebSocket not connected");
      return;
    }

    // Clear previous results
    setProcessedImages([]);
    setIsProcessing(true);

    // Process each file - BACKEND FUNCTIONALITY UNCHANGED
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        console.log(`Sending image ${index + 1} to server`);
        socket.emit("image", base64Image);
      };
      reader.readAsDataURL(file);
    });
  };

  const clearResults = () => {
    setProcessedImages([]);
    setStats({
      totalImages: 0,
      totalDetections: 0,
      avgConfidence: 0,
      processingTime: 0
    });
    setSelectedImage(null);
  };

  const downloadImage = (image: ProcessedImage) => {
    const link = document.createElement('a');
    link.href = image.processedFrame;
    link.download = `aetherscan-detected-${image.fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                  socketConnected 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-sm">
                  {socketConnected ? 'AI Connected' : 'AI Offline'}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            { 
              icon: ImageIcon, 
              label: "Images Analyzed", 
              value: stats.totalImages,
              color: "from-cyan-500 to-blue-600",
              bg: "bg-cyan-500/20"
            },
            { 
              icon: Target, 
              label: "Objects Found", 
              value: stats.totalDetections,
              color: "from-purple-500 to-pink-600",
              bg: "bg-purple-500/20"
            },
            { 
              icon: BarChart3, 
              label: "Avg Confidence", 
              value: `${(stats.avgConfidence * 100).toFixed(1)}%`,
              color: "from-emerald-500 to-green-600",
              bg: "bg-emerald-500/20"
            },
            { 
              icon: Shield, 
              label: "AI Status", 
              value: socketConnected ? "Active" : "Inactive",
              color: socketConnected ? "from-emerald-500 to-green-600" : "from-red-500 to-rose-600",
              bg: socketConnected ? "bg-emerald-500/20" : "bg-red-500/20"
            }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity`} />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{
                      backgroundImage: `linear-gradient(to right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`
                    }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <AnimatedFileUpload onFilesSelected={handleFilesSelected} />
        </motion.div>

        {/* Processing Indicator */}
        <AnimatePresence>
          {isProcessing && processedImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-6"
              >
                <div className="w-full h-full border-4 border-dashed border-gray-700 border-t-cyan-500 rounded-full" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">Analyzing Images</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Our AI is scanning your images for objects. This usually takes a few seconds...
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-150" />
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {processedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    Detection Results
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {processedImages.length} image{processedImages.length !== 1 ? 's' : ''} analyzed by AI
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearResults}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </motion.button>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {processedImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group relative"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden h-full">
                      {/* Image Header */}
                      <div className="p-4 border-b border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                              <ImageIcon className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="text-sm font-semibold text-white truncate">
                              {image.fileName}
                            </span>
                          </div>
                          <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full border border-cyan-500/30">
                            <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                              {image.detections.length} objects
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Analyzed {new Date(image.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Processed Image */}
                      <div className="relative aspect-video overflow-hidden bg-gray-950">
                        <img
                          src={image.processedFrame}
                          alt={`Detection result ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Detection Count Badge */}
                        <div className="absolute top-3 right-3">
                          <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-cyan-500/30">
                            <div className="flex items-center gap-2">
                              <Target className="w-3 h-3 text-cyan-400" />
                              <span className="text-xs font-bold text-white">
                                {image.detections.length} detections
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image);
                            }}
                            className="p-2 bg-black/70 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-cyan-500/50 transition-colors"
                            title="View Details"
                          >
                            <Maximize2 className="w-4 h-4 text-white" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImage(image);
                            }}
                            className="p-2 bg-black/70 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-cyan-500/50 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Detection Preview */}
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          Detected Objects
                        </h4>
                        
                        <div className="space-y-2">
                          {image.detections.slice(0, 3).map((det, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-cyan-500/30 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-300 truncate">
                                {det.class_name || `Class ${det.class_Id}`}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${det.confidence * 100}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                  />
                                </div>
                                <span className="text-xs font-bold text-cyan-400">
                                  {(det.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          {image.detections.length > 3 && (
                            <div className="text-center py-1">
                              <span className="text-xs text-gray-500">
                                +{image.detections.length - 3} more objects
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!isProcessing && processedImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-3xl border border-gray-700/50 mb-6">
                <Globe className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Ready for Analysis</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Upload up to 3 images to detect objects using our advanced AI system.
                Get instant results with confidence scores.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Real-time processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure & private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>High accuracy</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-lg rounded-3xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Detection Analysis</h3>
                  <p className="text-gray-400 text-sm">
                    {selectedImage.fileName} • {selectedImage.detections.length} objects detected
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Display */}
                  <div className="relative rounded-2xl overflow-hidden bg-gray-950 border border-gray-700/50">
                    <img
                      src={selectedImage.processedFrame}
                      alt="Detailed analysis"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Detection Details */}
                  <div className="space-y-4">
                    <div className="bg-gray-800/30 rounded-xl p-4">
                      <h4 className="font-semibold text-white mb-3">Detection Statistics</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <div className="text-sm text-gray-400">Total Objects</div>
                          <div className="text-2xl font-bold text-white">{selectedImage.detections.length}</div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <div className="text-sm text-gray-400">Avg Confidence</div>
                          <div className="text-2xl font-bold text-cyan-400">
                            {selectedImage.detections.length > 0
                              ? `${((selectedImage.detections.reduce((acc, d) => acc + d.confidence, 0) / selectedImage.detections.length) * 100).toFixed(1)}%`
                              : '0%'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/30 rounded-xl p-4">
                      <h4 className="font-semibold text-white mb-3">Detected Objects</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {selectedImage.detections.map((det, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30"
                          >
                            <div>
                              <div className="font-medium text-white">
                                {det.class_name || `Object ${det.class_Id}`}
                              </div>
                              <div className="text-xs text-gray-400">Class ID: {det.class_Id}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-cyan-400">
                                {(det.confidence * 100).toFixed(1)}%
                              </div>
                              <div className="h-1.5 w-24 bg-gray-700 rounded-full overflow-hidden mt-1">
                                <div
                                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                  style={{ width: `${det.confidence * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadImage(selectedImage)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download Result
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
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
        
        /* Selection */
        ::selection {
          background: rgba(6, 182, 212, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
};



export default ImageDetectionComponent;