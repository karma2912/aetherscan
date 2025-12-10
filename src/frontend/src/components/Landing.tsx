import { useState, useEffect, useRef } from "react";
import { Menu, X, Github, Twitter, Search, Sparkles, Rocket, Satellite, Globe, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Landing.css"; // We'll create this CSS file for custom animations

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
    }> = [];

    // Create particles
    const particleCount = 150;
    const colors = [
      'rgba(96, 165, 250, 0.8)',    // Blue
      'rgba(167, 139, 250, 0.8)',   // Purple
      'rgba(6, 182, 212, 0.8)',     // Cyan
      'rgba(34, 211, 238, 0.8)',    // Light Blue
      'rgba(244, 114, 182, 0.8)',   // Pink
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
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
        canvas.width
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.2)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x > canvas.width || particle.x < 0) particle.speedX *= -1;
        if (particle.y > canvas.height || particle.y < 0) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw glow
        const glow = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );
        glow.addColorStop(0, particle.color);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
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

const FloatingElements = () => {
  return (
    <>
      {/* Floating planets */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-20"
        animate={{
          y: [0, 30, 0],
          rotate: 360
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 opacity-30"
        animate={{
          y: [0, -40, 0],
          rotate: -360
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 opacity-25"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, translateY: -10 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
        <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl mb-4">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

const AnimatedLogo = () => {
  return (
    <motion.div
      className="relative"
      animate={{
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.9, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
        <img
          src="/aetherscan.jpeg"
          alt="AetherScan Logo"
          className="relative h-10 w-10 border-2 border-white/20 rounded-lg drop-shadow-2xl z-10"
        />
      </div>
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-70 transition-opacity"
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      />
    </motion.div>
  );
};

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigations = [
    { name: "Detection", link: "/aetherscan/predict/upload", icon: Satellite },
    { name: "Live", link: "/aetherscan/live", icon: Zap },
    { name: "Documentation", link: "/aetherscan/docs", icon: Globe },
    { name: "Scores", link: "/aetherscan/scores", icon: Star },
  ];

  const features = [
    {
      icon: Satellite,
      title: "Real-time Detection",
      description: "Advanced AI-powered object detection for space station safety monitoring"
    },
    {
      icon: Zap,
      title: "Live Analysis",
      description: "Monitor space station environments with live video feed analysis"
    },
    {
      icon: Globe,
      title: "Comprehensive Docs",
      description: "Detailed documentation and API references for developers"
    },
    {
      icon: Star,
      title: "Performance Scores",
      description: "Track and analyze detection accuracy and system performance"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white font-sans overflow-hidden relative">
      <ParticleBackground />
      <FloatingElements />

      {/* Animated Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <AnimatedLogo />
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  AetherScan
                </span>
                <span className="text-xs text-gray-400">Space Station Safety AI</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigations.map((nav, index) => (
                <motion.a
                  key={nav.name}
                  href={nav.link}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="group relative"
                >
                  <span className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <nav.icon className="w-4 h-4" />
                    {nav.name}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 text-sm">
                  <Search className="w-4 h-4" />
                  <span className="text-gray-300">Search</span>
                  <kbd className="text-xs bg-gray-900/50 px-2 py-1 rounded">⌘K</kbd>
                </div>
              </motion.button>

              <motion.a
                href="https://github.com/karma2912/aetherscan"
                target="_blank"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-800/50 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                404 Cyberstrike Hackathon 2025
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                AetherScan
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-white/90">
                Space Station Safety
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Advanced AI-powered object detection system ensuring astronaut safety 
              and equipment integrity in space station environments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.a
                href="/aetherscan/predict/upload"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-8 py-4 rounded-xl text-lg font-semibold">
                  <Rocket className="w-5 h-5" />
                  Launch Detection
                </div>
              </motion.a>

              <motion.a
                href="/aetherscan/live"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 px-8 py-4 rounded-xl text-lg font-semibold hover:border-cyan-500/30 transition-colors">
                  <Zap className="w-5 h-5" />
                  Live Demo
                </div>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: "99.8%", label: "Detection Accuracy" },
              { value: "24/7", label: "Real-time Monitoring" },
              { value: "50ms", label: "Response Time" },
              { value: "1000+", label: "Objects Identified" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Animated Scanner Line */}
        <motion.div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Advanced Features
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cutting-edge technology for space station safety monitoring
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Secure Your Space Station?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of space missions trusting AetherScan for their safety monitoring needs.
            </p>
            <motion.a
              href="/aetherscan/docs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300"
            >
              <Globe className="w-5 h-5" />
              Get Started with Documentation
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative border-t border-gray-800/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <AnimatedLogo />
              <div>
                <div className="font-bold text-lg">AetherScan</div>
                <div className="text-sm text-gray-500">Space Station Safety AI</div>
              </div>
            </div>
            <div className="flex gap-6">
              {navigations.map((nav) => (
                <a
                  key={nav.name}
                  href={nav.link}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {nav.name}
                </a>
              ))}
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="https://github.com/karma2912/aetherscan" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-8">
            © 2024 AetherScan. Made with ❤️ for 404 Cyberstrike Hackathon
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 bg-gray-900/95 backdrop-blur-lg z-50 md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <AnimatedLogo />
                  <span className="text-xl font-bold">AetherScan</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-gray-800/50 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {navigations.map((nav) => (
                  <motion.a
                    key={nav.name}
                    href={nav.link}
                    onClick={() => setMenuOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 p-4 text-xl hover:bg-gray-800/50 rounded-xl transition-colors"
                  >
                    <nav.icon className="w-5 h-5" />
                    {nav.name}
                  </motion.a>
                ))}
              </div>

              <div className="flex gap-4 justify-center pt-8 border-t border-gray-800">
                <a href="https://github.com/karma2912/aetherscan" target="_blank" className="p-3 hover:bg-gray-800/50 rounded-lg">
                  <Github className="w-6 h-6" />
                </a>
                <button className="p-3 hover:bg-gray-800/50 rounded-lg">
                  <Twitter className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Nav;