import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Zap,
  User,
  Gift,
  Crown,
  Star
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState('free');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedPlan = searchParams.get('plan');
    if (selectedPlan) {
      setPlan(selectedPlan);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5050/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, role: plan }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      
      localStorage.setItem('token', data.token);
      navigate('/dashboard/overview');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `http://localhost:5050/api/auth/google?plan=${plan}`;
  };

  const handleFacebookRegister = () => {
    window.location.href = `https://6dcf48e9cbc6.ngrok-free.app/api/auth/facebook/?plan=${plan}`;
  };

  const planInfo = {
    free: { 
      icon: Gift, 
      name: 'Free', 
      color: 'text-brand-lime', 
      bgColor: 'bg-brand-lime/10',
      features: ['Basic analytics', '1 social account', 'Monthly reports']
    },
    pro: { 
      icon: Star, 
      name: 'Pro', 
      color: 'text-brand-electric', 
      bgColor: 'bg-brand-electric/10',
      features: ['Advanced analytics', '5 social accounts', 'Weekly reports', 'AI insights']
    },
    agency: { 
      icon: Crown, 
      name: 'Agency', 
      color: 'text-brand-violet', 
      bgColor: 'bg-brand-violet/10',
      features: ['Full analytics suite', 'Unlimited accounts', 'Daily reports', 'White-label reports']
    }
  };

  const currentPlan = planInfo[plan as keyof typeof planInfo] || planInfo.free;

  const benefits = [
    { icon: Zap, text: '14-day free trial' },
    { icon: Shield, text: 'GDPR compliant' },
    { icon: CheckCircle2, text: 'No setup fees' }
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
            Start Your{' '}
            <span className="bg-brand-electric bg-clip-text text-transparent">
              Social Intelligence
            </span>{' '}
            Journey
          </h1>
          
          <p className="text-lg text-brand-zinc/80 dark:text-brand-frost mb-8">
            Join thousands of creators and businesses transforming their social media strategy with AI-powered insights.
          </p>

          {/* Plan Selection */}
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`p-4 ${currentPlan.bgColor} border border-brand-frost/30 dark:border-brand-zinc/30 rounded-xl mb-6`}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <currentPlan.icon size={20} className={currentPlan.color} />
                <span className="font-bold text-brand-void dark:text-brand-pure">
                  {currentPlan.name} Plan Selected
                </span>
              </div>
              <div className="space-y-1">
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-brand-zinc dark:text-brand-frost">
                    <CheckCircle2 size={14} className="text-brand-lime" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-lg border border-brand-frost/30 dark:border-brand-zinc/30"
              >
                <benefit.icon size={20} className="text-brand-electric" />
                <span className="text-brand-void dark:text-brand-pure font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Register Form */}
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
                Create your account
              </h2>
              <p className="text-brand-zinc dark:text-brand-frost">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-brand-electric hover:text-brand-neon font-medium transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Mobile Plan Info */}
            {plan && (
              <div className="lg:hidden mb-6">
                <div className={`p-3 ${currentPlan.bgColor} border border-brand-frost/30 dark:border-brand-zinc/30 rounded-lg`}>
                  <div className="flex items-center gap-2 text-sm">
                    <currentPlan.icon size={16} className={currentPlan.color} />
                    <span className="font-medium text-brand-void dark:text-brand-pure">
                      Registering for {currentPlan.name} plan
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Social Register Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleRegister}
                className="group w-full flex items-center justify-center gap-3 px-4 py-3 bg-brand-pure dark:bg-brand-void border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30 transition-all duration-300 hover:border-brand-electric/50 dark:hover:border-brand-frost/50"
              >
                <Chrome size={20} className="text-brand-zinc dark:text-brand-frost" />
                <span className="font-medium text-brand-void dark:text-brand-pure">Continue with Google</span>
              </button>
              
              <button
                onClick={handleFacebookRegister}
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
                  or register with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
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

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-brand-void dark:text-brand-pure">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-brand-zinc/60 dark:text-brand-frost/60" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure placeholder-brand-zinc/60 dark:placeholder-brand-frost/60 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    className="w-full pl-10 pr-12 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure placeholder-brand-zinc/60 dark:placeholder-brand-frost/60 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent transition-all duration-300"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-zinc/60 dark:text-brand-frost/60 hover:text-brand-electric dark:hover:text-brand-frost transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-brand-void dark:text-brand-pure">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-brand-zinc/60 dark:text-brand-frost/60" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure placeholder-brand-zinc/60 dark:placeholder-brand-frost/60 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-zinc/60 dark:text-brand-frost/60 hover:text-brand-electric dark:hover:text-brand-frost transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand-electric bg-brand-pure border-brand-frost/30 rounded focus:ring-brand-electric focus:ring-2 dark:bg-brand-void dark:border-brand-zinc/40"
                    required
                  />
                  <span className="text-sm text-brand-zinc dark:text-brand-frost">
                    I agree to the{' '}
                    <Link to="/terms" className="text-brand-electric hover:text-brand-neon underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-brand-electric hover:text-brand-neon underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-4 h-4 text-brand-electric bg-brand-pure border-brand-frost/30 rounded focus:ring-brand-electric focus:ring-2 dark:bg-brand-void dark:border-brand-zinc/40"
                  />
                  <span className="text-sm text-brand-zinc dark:text-brand-frost">
                    Send me updates about new features and insights
                  </span>
                </label>
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
                    <span className="relative">Creating account...</span>
                  </>
                ) : (
                  <>
                    <span className="relative">Create account</span>
                    <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30">
              <div className="flex items-center gap-2 text-xs text-brand-zinc/80 dark:text-brand-frost/80">
                <Shield size={14} className="text-brand-electric" />
                <span>Your data is encrypted and secure. We're GDPR compliant and never share your information.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;