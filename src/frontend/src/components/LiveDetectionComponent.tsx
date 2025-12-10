import { useRef, useEffect, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { 
  Zap, 
  ArrowLeft, 
  AlertCircle, 
  Camera, 
  RefreshCw,
  Wifi,
  WifiOff,
  Satellite,
  Settings,
  Brain,
  Target,
  BarChart3,
  Shield,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

interface Detection {
  class_Id: number;
  class_name?: string;
  confidence: number;
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

    // Create particles
    const particleCount = 80;
    const colors = [
      'rgba(96, 165, 250, 0.6)',    // Blue
      'rgba(167, 139, 250, 0.6)',   // Purple
      'rgba(6, 182, 212, 0.6)',     // Cyan
      'rgba(34, 211, 238, 0.6)',    // Light Blue
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebula background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.05)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw particle with pulsing alpha
        particle.alpha = 0.3 + Math.sin(Date.now() * 0.001 + particle.x) * 0.2;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.6', particle.alpha.toString());
        ctx.fill();

        // Draw trail
        ctx.beginPath();
        ctx.moveTo(particle.x - particle.speedX * 10, particle.y - particle.speedY * 10);
        ctx.lineTo(particle.x, particle.y);
        ctx.strokeStyle = particle.color.replace('0.6', (particle.alpha * 0.3).toString());
        ctx.lineWidth = particle.size / 2;
        ctx.stroke();
      });

      // Draw grid lines
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

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

const ConnectionVisualizer = ({ isConnected, fps, targetFps, setTargetFps }: any) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl blur-xl" />
      <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isConnected ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {isConnected ? (
                <Wifi className="w-5 h-5 text-emerald-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">Connection Status</h3>
              <p className={`text-sm ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                {isConnected ? 'Secure Connection Established' : 'Disconnected'}
              </p>
            </div>
          </div>
          
          <motion.div
            animate={{ scale: pulse && isConnected ? 1.2 : 1 }}
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'} ${isConnected ? 'animate-pulse' : ''}`}
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Processing FPS</span>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {fps}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${(fps / 30) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Target FPS</span>
              <span className="text-lg font-semibold text-white">{targetFps}</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={30}
                value={targetFps}
                onChange={(e) => setTargetFps(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-600"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setTargetFps((prev : number) => Math.max(1, prev - 1))}
                  className="px-2 py-1 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  -
                </button>
                <button 
                  onClick={() => setTargetFps((prev:number) => Math.min(30, prev + 1))}
                  className="px-2 py-1 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Connection waves visualization */}
        <div className="mt-4 relative h-10 overflow-hidden rounded-lg">
          {isConnected && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                  animate={{ y: ['100%', '-100%'] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DetectionPanel = ({ detections }: any) => {
  const sortedDetections = [...detections].sort((a, b) => b.confidence - a.confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/30 rounded-2xl blur-xl" />
      <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl h-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Detection Panel</h3>
                <p className="text-sm text-gray-400">
                  {detections.length} object{detections.length !== 1 ? 's' : ''} detected
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full border border-blue-500/30">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {detections.length}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 h-[calc(100%-80px)]">
          {detections.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-70 animate-pulse" />
                <Target className="relative w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-center">Waiting for detection data...</p>
              <p className="text-sm text-gray-600 mt-2 text-center">Objects will appear here once detected</p>
            </div>
          ) : (
            <div className="space-y-3 h-full overflow-y-auto pr-2 custom-scrollbar">
              {sortedDetections.map((det, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                          <Target className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {det.class_name || `Object ${det.class_Id}`}
                          </h4>
                          <p className="text-xs text-gray-400">Class ID: {det.class_Id}</p>
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full"
                      >
                        <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Confidence</span>
                        <span className="font-semibold text-white">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${det.confidence * 100}%` }}
                          transition={{ duration: 1, type: "spring" }}
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </motion.div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {det.confidence > 0.9 && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                          High Confidence
                        </span>
                      )}
                      {det.confidence > 0.7 && det.confidence <= 0.9 && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          Medium Confidence
                        </span>
                      )}
                      {det.confidence <= 0.7 && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                          Low Confidence
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const LiveDetectionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [fps, setFps] = useState(0);
  const [targetFps, setTargetFps] = useState<number>(5);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Array<{ deviceId: string; label: string }>>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    totalFrames: 0,
    totalDetections: 0,
    avgConfidence: 0
  });

  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket:", newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionError("Failed to connect to server. Make sure the server is running on localhost:8080");
      setIsConnected(false);
    });

    newSocket.on("response_back", (data: { frame: string; detections: Detection[] }) => {
      setFrameSrc(data.frame);
      setDetections(data.detections || []);
      setIsProcessing(false);
      
      // Update stats
      setStats(prev => ({
        totalFrames: prev.totalFrames + 1,
        totalDetections: prev.totalDetections + data.detections.length,
        avgConfidence: data.detections.length > 0 
          ? data.detections.reduce((acc, d) => acc + d.confidence, 0) / data.detections.length
          : prev.avgConfidence
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Initialize webcam
  useEffect(() => {
    let mounted = true;

    const stopStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    const startCamera = async (deviceId?: string | null) => {
      try {
        setIsProcessing(true);
        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId }, width: { ideal: 640 }, height: { ideal: 480 } }
            : { width: { ideal: 640 }, height: { ideal: 480 } },
        };

        stopStream();

        const stream = await navigator.mediaDevices.getUserMedia(constraints as any);
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraError(null);
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Camera access error:", error);
        if (mounted) {
          setCameraError("Unable to access camera. Please grant camera permissions or try opening the app in an external browser.");
          setIsProcessing(false);
        }
      }
    };

    const ensurePermissionAndDevices = async () => {
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true } as any);
        tempStream.getTracks().forEach((t) => t.stop());

        const list = await navigator.mediaDevices.enumerateDevices();
        const cams = list
          .filter((d) => d.kind === "videoinput")
          .map((d) => ({ deviceId: d.deviceId, label: d.label || `Camera ${d.deviceId}` }));
        setDevices(cams);
        const pick = selectedDeviceId || (cams.length > 0 ? cams[0].deviceId : null);
        setSelectedDeviceId(pick);

        await startCamera(pick);
      } catch (err) {
        console.warn("Permission/enumeration flow failed:", err);
        try {
          await startCamera(null);
          setCameraError("Using default camera; device selection may not be supported in this environment (webview). Try external browser for multiple camera selection.");
        } catch (err2) {
          console.error("Fallback camera start failed:", err2);
          setCameraError("Unable to access any camera. Check permissions or try opening in an external browser.");
        }
      }
    };

    ensurePermissionAndDevices();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Restart camera when selected device changes
  useEffect(() => {
    if (!selectedDeviceId) return;
    const restart = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { deviceId: { exact: selectedDeviceId }, width: { ideal: 640 }, height: { ideal: 480 } } 
        } as any);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraError(null);
        }
      } catch (err) {
        console.error("Failed to switch camera:", err);
        setCameraError("Failed to switch camera. Check permissions.");
      }
    };
    restart();
  }, [selectedDeviceId]);

  // Send frames to server
  useEffect(() => {
    if (!socket || !isConnected) return;

    let frameCount = 0;
    let lastTime = Date.now();

    if (!smallCanvasRef.current) {
      smallCanvasRef.current = document.createElement("canvas");
      smallCanvasRef.current.width = 320;
      smallCanvasRef.current.height = 240;
    }

    const intervalMs = Math.max(50, Math.round(1000 / (targetFps || 1)));
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !streamRef.current) return;
      
      if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      try {
        const keyframeInterval = 10;
        const isKeyframe = frameCount % keyframeInterval === 0;

        if (isKeyframe) {
          if (canvasRef.current.width !== 640 || canvasRef.current.height !== 480) {
            canvasRef.current.width = 640;
            canvasRef.current.height = 480;
          }
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasRef.current.toBlob(
            (blob) => {
              if (!blob) return;
              try {
                socket.emit("image_binary", blob);
                setIsProcessing(true);
              } catch (err) {
                console.warn("Binary emit failed on keyframe, fallback to base64", err);
                const frame = canvasRef.current!.toDataURL("image/jpeg", 0.75);
                socket.emit("image", frame);
              }
            },
            "image/jpeg",
            0.9
          );
        } else {
          const s = smallCanvasRef.current!;
          const sctx = s.getContext("2d");
          if (!sctx) return;
          sctx.drawImage(videoRef.current, 0, 0, s.width, s.height);
          s.toBlob(
            (blob) => {
              if (!blob) return;
              try {
                socket.emit("image_binary", blob);
                setIsProcessing(true);
              } catch (err) {
                console.warn("Binary emit small failed, fallback to base64", err);
                const frame = s.toDataURL("image/jpeg", 0.6);
                socket.emit("image", frame);
              }
            },
            "image/jpeg",
            0.7
          );
        }

        frameCount++;
        const now = Date.now();
        if (now - lastTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastTime = now;
        }
      } catch (error) {
        console.error("Error processing frame:", error);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [socket, isConnected, targetFps]);

  const refreshDevices = useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const cams = list
        .filter((d) => d.kind === "videoinput")
        .map((d) => ({ deviceId: d.deviceId, label: d.label || `Camera ${d.deviceId}` }));
      setDevices(cams);
      if (!selectedDeviceId && cams.length > 0) setSelectedDeviceId(cams[0].deviceId);
    } catch (err) {
      console.warn("enumerateDevices failed:", err);
    }
  }, [selectedDeviceId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white font-sans overflow-hidden relative">
      <ParticleBackground />
      
      {/* Animated scan lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
            animate={{ y: [0, '100vh'] }}
            transition={{
              duration: 2 + i,
              delay: i * 0.3,
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
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl"
              >
                <Satellite className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">Live Feed Active</span>
              </motion.div>
              
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                onClick={refreshDevices}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                title="Refresh Devices"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
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
              icon: BarChart3, 
              label: "Total Frames", 
              value: stats.totalFrames,
              color: "from-cyan-500 to-blue-600",
              bg: "bg-cyan-500/20"
            },
            { 
              icon: Target, 
              label: "Objects Detected", 
              value: stats.totalDetections,
              color: "from-purple-500 to-pink-600",
              bg: "bg-purple-500/20"
            },
            { 
              icon: Brain, 
              label: "Avg Confidence", 
              value: `${(stats.avgConfidence * 100).toFixed(1)}%`,
              color: "from-green-500 to-emerald-600",
              bg: "bg-green-500/20"
            },
            { 
              icon: Shield, 
              label: "System Status", 
              value: isConnected ? "Online" : "Offline",
              color: isConnected ? "from-emerald-500 to-green-600" : "from-red-500 to-rose-600",
              bg: isConnected ? "bg-emerald-500/20" : "bg-red-500/20"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed Section */}
          {/* MODIFIED: Changed space-y-6 to grid to put items side-by-side */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
            {/* Camera Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl">
                      <Camera className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Live Camera Feed</h2>
                      <p className="text-sm text-gray-400">Real-time space station monitoring</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700/50">
                      <select
                        value={selectedDeviceId ?? ""}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                        className="bg-transparent text-sm outline-none"
                      >
                        {devices.length === 0 ? (
                          <option value="">No cameras</option>
                        ) : (
                          devices.map((d) => (
                            <option key={d.deviceId} value={d.deviceId}>
                              {d.label}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-700/50">
                    {cameraError ? (
                      <div className="aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-full blur opacity-70" />
                          <AlertCircle className="relative w-16 h-16 text-red-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-red-400 mb-2">Camera Error</h3>
                        <p className="text-gray-400 text-center max-w-md px-4">{cameraError}</p>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-auto"
                        />
                        {/* Grid overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                          <div className="h-full w-full" style={{
                            backgroundImage: `
                              linear-gradient(to right, #4f46e5 1px, transparent 1px),
                              linear-gradient(to bottom, #4f46e5 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                          }} />
                        </div>
                        {/* Center crosshair */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
                          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                      </>
                    )}
                    
                    {/* Processing overlay */}
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 mx-auto mb-4"
                          >
                            <div className="w-full h-full border-4 border-gray-700 border-t-cyan-500 rounded-full" />
                          </motion.div>
                          <p className="text-lg font-semibold text-white">Processing Frame</p>
                          <p className="text-gray-400 text-sm mt-2">AI detection in progress...</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* YOLO Output */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">AI Output</h2>
                      <p className="text-sm text-gray-400">YOLO Recognition</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full border border-purple-500/30">
                    <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {detections.length} Objects
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 aspect-video">
                    {frameSrc ? (
                      <>
                        <img
                          src={frameSrc}
                          alt="YOLO Output"
                          className="w-full h-full object-contain"
                        />
                        {/* Detection overlay animation */}
                        <div className="absolute inset-0 pointer-events-none">
                          {detections.map((_, idx) => (
                            <motion.div
                              key={idx}
                              className="absolute border-2 border-cyan-500/50 rounded-lg"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                              transition={{
                                duration: 2,
                                delay: idx * 0.1,
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                              style={{
                                left: `${Math.random() * 70 + 15}%`,
                                top: `${Math.random() * 70 + 15}%`,
                                width: `${Math.random() * 20 + 10}%`,
                                height: `${Math.random() * 20 + 10}%`,
                              }}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="relative mb-6">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20"
                          >
                            <div className="w-full h-full border-4 border-dashed border-gray-700 border-t-purple-500 rounded-full" />
                          </motion.div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Brain className="w-8 h-8 text-purple-400" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Awaiting Detection</h3>
                        <p className="text-gray-400 text-center max-w-sm">
                          AI system is ready to analyze live feed. Objects will appear here once detected.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Connection Visualizer */}
            <ConnectionVisualizer 
              isConnected={isConnected}
              fps={fps}
              targetFps={targetFps}
              setTargetFps={setTargetFps}
            />

            {/* Detection Panel */}
            <DetectionPanel detections={detections} />

            {/* Controls Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-900/20 rounded-2xl blur-xl" />
              <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">System Controls</h3>
                  <Settings className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <button
                    onClick={refreshDevices}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-600/30 transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Camera Devices
                  </button>
                  <button
                    onClick={() => window.open(window.location.href, "_blank")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-600/30 transition-all duration-300"
                  >
                    <Globe className="w-4 h-4" />
                    Open in External Browser
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Error Toast */}
      <AnimatePresence>
        {(connectionError || cameraError) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className="bg-gradient-to-r from-red-500/20 to-rose-600/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">System Alert</h4>
                  <p className="text-sm text-gray-300">
                    {connectionError || cameraError}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden canvas */}
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        style={{ display: "none" }}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0ea5e9, #2563eb);
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        /* Hide video controls */
        video::-webkit-media-controls {
          display: none !important;
        }
        video {
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default LiveDetectionComponent;