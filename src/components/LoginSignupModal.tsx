import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginSignupModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginSignupModal: React.FC<LoginSignupModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('24');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl p-8 sm:p-10 border border-stone-200 dark:border-stone-800 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pinterest Red Logo */}
        <div className="w-12 h-12 mx-auto rounded-full bg-[#e60023] text-white flex items-center justify-center shadow-sm">
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.33 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
          </svg>
        </div>

        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
          {mode === 'login' ? 'Welcome to Pinterest' : 'Sign up to get your ideas'}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Find new ideas to try
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Email
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus-within:ring-2 focus-within:ring-rose-500">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Password
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus-within:ring-2 focus-within:ring-rose-500">
              <Lock className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Age
              </label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-[#e60023] hover:bg-[#ad081b] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? 'Log in' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-stone-200 dark:border-stone-800" />
          <span className="text-[11px] font-semibold text-stone-400 uppercase">OR</span>
          <div className="flex-1 h-px bg-stone-200 dark:border-stone-800" />
        </div>

        {/* Social Quick Sign-in */}
        <div className="mt-4 space-y-2.5">
          <button
            onClick={() => {
              onSuccess();
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-[#1877f2] hover:bg-[#1464cc] text-white font-semibold text-xs rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Continue with Facebook</span>
          </button>

          <button
            onClick={() => {
              onSuccess();
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2.5 border border-stone-200 dark:border-stone-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.34 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.26C.46 8.22 0 10.05 0 12s.46 3.78 1.26 5.4l4.02-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.66 1.26 6.6l4.02 3.13c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Switch Login / Signup Mode */}
        <div className="mt-5 text-xs text-stone-500 dark:text-stone-400">
          {mode === 'login' ? (
            <p>
              Not on Pinterest yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-stone-900 dark:text-white hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already a member?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-stone-900 dark:text-white hover:underline cursor-pointer"
              >
                Log in
              </button>
            </p>
          )}
        </div>

        <p className="mt-6 text-[11px] text-stone-400 leading-tight">
          By continuing, you agree to Pinterest's Terms of Service and acknowledge that you've read our Privacy Policy.
        </p>
      </div>
    </div>
  );
};
