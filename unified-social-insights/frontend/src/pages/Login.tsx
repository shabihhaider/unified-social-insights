import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  AlertCircle,
  Chrome,
  Facebook as FacebookIcon,
  CheckCircle2,
  Zap
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      const success = await login(data.token);
      if (success) {
        navigate('/dashboard/overview');
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5050/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'https://6dcf48e9cbc6.ngrok-free.app/api/auth/facebook/';
  };

  const benefits = [
    { icon: Zap, text: 'Instant AI insights' },
    { icon: Shield, text: 'Secure & private' },
    { icon: CheckCircle2, text: 'Free 14-day trial' }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-brand-pure via-brand-frost/30 to-brand-frost/50 dark:from-brand-void dark:via-brand-carbon/50 dark:to-brand-carbon overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-brand-electric/10 dark:bg-brand-neon/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-brand-violet/15 dark:bg-brand-electric/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-brand-neon/20 dark:bg-brand-violet/8 rounded-full blur-2xl animate-bounce-subtle"></div>
      </div>

      {/* Left Panel - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md text-center"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 text-2xl font-bold mb-8 group">
            <div className="relative">
              <div className="w-12 h-12 bg-brand-electric rounded-xl flex items-center justify-center shadow-electric-glow animate-glow">
                <Sparkles className="text-brand-pure w-6 h-6" />
              </div>
            </div>
            <span className="bg-brand-electric bg-clip-text text-transparent font-extrabold tracking-tight">
              Insightlyx
            </span>
          </Link>

          <h1 className="text-4xl font-extrabold text-brand-void dark:text-brand-pure mb-6">
            Welcome Back to{' '}
            <span className="bg-brand-electric bg-clip-text text-transparent">
              Social Intelligence
            </span>
          </h1>
          
          <p className="text-lg text-brand-zinc/80 dark:text-brand-frost mb-8">
            Continue your journey to smarter social media insights. Your unified dashboard awaits.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-lg border border-brand-frost/30 dark:border-brand-zinc/30"
              >
                <benefit.icon size={20} className="text-brand-electric" />
                <span className="text-brand-void dark:text-brand-pure font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 text-xl font-bold group">
              <div className="w-10 h-10 bg-brand-electric rounded-xl flex items-center justify-center shadow-electric-glow">
                <Sparkles className="text-brand-pure w-5 h-5" />
              </div>
              <span className="bg-brand-electric bg-clip-text text-transparent font-extrabold">
                Insightlyx
              </span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="bg-brand-pure/90 dark:bg-brand-carbon/80 backdrop-blur-xl rounded-2xl shadow-brand-xl border border-brand-frost/30 dark:border-brand-zinc/40 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-void dark:text-brand-pure mb-2">
                Sign in to your account
              </h2>
              <p className="text-brand-zinc dark:text-brand-frost">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-brand-electric hover:text-brand-neon font-medium transition-colors duration-200"
                >
                  Sign up for free
                </Link>
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleLogin}
                className="group w-full flex items-center justify-center gap-3 px-4 py-3 bg-brand-pure dark:bg-brand-void border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30 transition-all duration-300 hover:border-brand-electric/50 dark:hover:border-brand-frost/50"
              >
                <Chrome size={20} className="text-brand-zinc dark:text-brand-frost" />
                <span className="font-medium text-brand-void dark:text-brand-pure">Continue with Google</span>
              </button>
              
              <button
                onClick={handleFacebookLogin}
                className="group w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-brand hover:shadow-brand-lg"
              >
                <FacebookIcon size={20} />
                <span className="font-medium">Continue with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-frost/30 dark:border-brand-zinc/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-brand-pure dark:bg-brand-carbon text-brand-zinc dark:text-brand-frost">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg text-error-600 dark:text-error-400 text-sm"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-brand-void dark:text-brand-pure">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-brand-zinc/60 dark:text-brand-frost/60" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure placeholder-brand-zinc/60 dark:placeholder-brand-frost/60 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-brand-void dark:text-brand-pure">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-brand-zinc/60 dark:text-brand-frost/60" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure placeholder-brand-zinc/60 dark:placeholder-brand-frost/60 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-zinc/60 dark:text-brand-frost/60 hover:text-brand-electric dark:hover:text-brand-frost transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-brand-electric bg-brand-pure border-brand-frost/30 rounded focus:ring-brand-electric focus:ring-2 dark:bg-brand-void dark:border-brand-zinc/40"
                  />
                  <span className="text-sm text-brand-zinc dark:text-brand-frost">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-electric hover:text-brand-neon transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full px-4 py-3 bg-brand-electric hover:bg-brand-neon text-brand-pure font-semibold rounded-lg shadow-brand-lg hover:shadow-electric-glow transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-carbon disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-pure/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-brand-pure/30 border-t-brand-pure rounded-full animate-spin" />
                    <span className="relative">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="relative">Sign in</span>
                    <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30">
              <div className="flex items-center gap-2 text-xs text-brand-zinc/80 dark:text-brand-frost/80">
                <Shield size={14} className="text-brand-electric" />
                <span>Your data is encrypted and secure. We're GDPR compliant.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;