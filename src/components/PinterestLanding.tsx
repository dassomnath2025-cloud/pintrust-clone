import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, ArrowRight, Bookmark, Sparkles, Heart, Sun, Moon } from 'lucide-react';

interface PinterestLandingProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenDonationModal: () => void;
}

export const PinterestLanding: React.FC<PinterestLandingProps> = ({
  onEnterApp,
  onOpenLogin,
  onOpenSignup,
  isDarkMode,
  onToggleDarkMode,
  onOpenDonationModal,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const SLIDES = [
    {
      title: 'chai time snack idea',
      color: '#c28b00',
      dotColor: 'bg-[#c28b00]',
      image: '/src/assets/images/pin_chai_snack_1793629767640.jpg',
      alt: 'Chai and samosa snack',
      secondaryImages: [
        '/src/assets/images/pin_artisan_coffee_1793629065505.jpg',
        '/src/assets/images/pin_warm_interior_1793629035949.jpg',
      ],
    },
    {
      title: 'home decor idea',
      color: '#407a52',
      dotColor: 'bg-[#407a52]',
      image: '/src/assets/images/pin_home_decor_1793629784209.jpg',
      alt: 'Indian home decor with brass urli and marigolds',
      secondaryImages: [
        '/src/assets/images/pin_minimal_architecture_1793629020212.jpg',
        '/src/assets/images/pin_diy_craft_1793629821836.jpg',
      ],
    },
    {
      title: 'outfit idea',
      color: '#0076d3',
      dotColor: 'bg-[#0076d3]',
      image: '/src/assets/images/pin_outfit_inspo_1793629801112.jpg',
      alt: 'Contemporary Indian kurta and jhumkas street styling',
      secondaryImages: [
        '/src/assets/images/pin_editorial_fashion_1793629050559.jpg',
        '/src/assets/images/pin_coastal_landscape_1793629081733.jpg',
      ],
    },
    {
      title: 'DIY project idea',
      color: '#c05621',
      dotColor: 'bg-[#c05621]',
      image: '/src/assets/images/pin_diy_craft_1793629821836.jpg',
      alt: 'Terracotta painted pots workshop',
      secondaryImages: [
        '/src/assets/images/pin_home_decor_1793629784209.jpg',
        '/src/assets/images/pin_artisan_coffee_1793629065505.jpg',
      ],
    },
  ];

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const currentSlide = SLIDES[activeSlide];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-[#e60023]/20 selection:text-[#e60023] transition-colors overflow-x-hidden">
      {/* Official in.pinterest.com Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-100 dark:border-stone-800 transition-colors">
        <div className="flex items-center gap-6">
          {/* Encript Official Logo & Wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer focus:outline-none group"
            title="Encript"
          >
            <img
              src="/assets/aistudio/Gemini_Generated_Image_f5mh3f5mh3f5mh3f_01b0e81b.png"
              alt="Encript Logo"
              className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-stone-200 dark:ring-stone-700 group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white font-sans">
              Encript
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-900 dark:text-stone-100">
            <button
              onClick={onEnterApp}
              className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
            >
              Watch
            </button>
            <button
              onClick={onEnterApp}
              className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
            >
              Explore
            </button>
          </nav>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-900 dark:text-stone-100 mr-2">
            <a href="#about" className="hover:underline">About</a>
            <a href="#business" className="hover:underline">Business</a>
            <a href="#blog" className="hover:underline">Blog</a>
          </nav>

          {/* Support / Donate QR Button */}
          <button
            onClick={onOpenDonationModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-[#e60023] dark:text-rose-300 text-xs font-bold rounded-full transition-all cursor-pointer shadow-2xs border border-rose-200/80 dark:border-rose-900/60 shrink-0"
            title="Donate via UPI QR (Rupees ₹)"
          >
            <Heart className="w-3.5 h-3.5 fill-[#e60023]" />
            <span className="hidden sm:inline">Support ₹</span>
          </button>

          {/* Dark Mode Option in the Bar */}
          <button
            onClick={onToggleDarkMode}
            className="w-10 h-10 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            )}
          </button>

          <button
            onClick={onOpenLogin}
            className="px-4 py-2.5 bg-[#e60023] hover:bg-[#ad081b] text-white text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer shadow-xs"
          >
            Log in
          </button>

          <button
            onClick={onOpenSignup}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer"
          >
            Sign up
          </button>

          <button
            onClick={onEnterApp}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-full transition-colors cursor-pointer ml-1"
            title="Jump directly to Home Feed"
          >
            <span>Feed App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section: "Get your next [idea]" */}
      <section className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between items-center text-center px-4 pt-10 pb-6 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
            Get your next
          </h1>

          {/* Animated Changing Idea Headline */}
          <div className="h-16 sm:h-20 flex items-center justify-center mt-2">
            <p
              key={currentSlide.title}
              style={{ color: currentSlide.color }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-500"
            >
              {currentSlide.title}
            </p>
          </div>

          {/* 4 Colored Indicator Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => setActiveSlide(index)}
                aria-label={slide.title}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === index
                    ? `${slide.dotColor} scale-135`
                    : 'bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Visual Cascade Gallery */}
        <div className="w-full max-w-6xl mx-auto my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center justify-center px-4">
          {/* Card 1 */}
          <div className="hidden md:block transform -translate-y-4 transition-transform duration-700">
            <img
              src={currentSlide.secondaryImages[0]}
              alt="Related pin idea"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-3xl shadow-lg hover:scale-102 transition-transform"
            />
          </div>

          {/* Card 2 */}
          <div className="transform translate-y-4 transition-transform duration-700">
            <img
              src={currentSlide.secondaryImages[1]}
              alt="Related pin idea"
              referrerPolicy="no-referrer"
              className="w-full h-72 object-cover rounded-3xl shadow-lg hover:scale-102 transition-transform"
            />
          </div>

          {/* Centerpiece Hero Card */}
          <div className="col-span-2 sm:col-span-1 transform -translate-y-2 transition-all duration-500">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-black/5">
              <img
                src={currentSlide.image}
                alt={currentSlide.alt}
                referrerPolicy="no-referrer"
                className="w-full h-84 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <div className="text-left text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Trending in India
                  </span>
                  <p className="text-base font-bold capitalize mt-1 leading-snug">
                    {currentSlide.title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="transform translate-y-6 transition-transform duration-700">
            <img
              src={currentSlide.secondaryImages[0]}
              alt="Related pin idea"
              referrerPolicy="no-referrer"
              className="w-full h-72 object-cover rounded-3xl shadow-lg hover:scale-102 transition-transform"
            />
          </div>

          {/* Card 5 */}
          <div className="hidden md:block transform -translate-y-2 transition-transform duration-700">
            <img
              src={currentSlide.secondaryImages[1]}
              alt="Related pin idea"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-3xl shadow-lg hover:scale-102 transition-transform"
            />
          </div>
        </div>

        {/* Scroll Down Trigger */}
        <div className="flex flex-col items-center gap-1.5 pb-2">
          <button
            onClick={() => scrollToSection('section-search')}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer group"
          >
            <span>Here's how it works</span>
            <ChevronDown className="w-4 h-4 text-stone-600 group-hover:translate-y-1 transition-transform animate-bounce" />
          </button>
        </div>
      </section>

      {/* Section 2: "Search for an idea" (Warm Yellow Background) */}
      <section
        id="section-search"
        className="min-h-screen bg-[#fffd92] flex items-center justify-center px-6 py-16"
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#c28b00] leading-tight">
              Search for an idea
            </h2>
            <p className="text-lg sm:text-xl text-[#c28b00] font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              What do you want to try next? Think of something you're into—like "chai time snacks" or "modern Indian decor"—and see what you find.
            </p>
            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="px-6 py-3.5 bg-[#e60023] hover:bg-[#ad081b] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-md"
              >
                Explore
              </button>
            </div>
          </div>

          {/* Right Visual: Mock Interactive Search */}
          <div className="relative bg-white rounded-[32px] p-6 shadow-xl max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 px-4 py-3 bg-stone-100 rounded-full text-stone-700">
              <Search className="w-5 h-5 text-stone-400" />
              <span className="text-sm font-semibold">easy chai time snacks</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                onClick={onEnterApp}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src="/src/assets/images/pin_chai_snack_1793629767640.jpg"
                  alt="Chai snack"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                />
                <p className="text-xs font-bold text-stone-800 p-2 truncate">
                  Punjabi Samosas & Kadak Chai
                </p>
              </div>

              <div
                onClick={onEnterApp}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src="/src/assets/images/pin_artisan_coffee_1793629065505.jpg"
                  alt="Ceramic coffee"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                />
                <p className="text-xs font-bold text-stone-800 p-2 truncate">
                  Artisan Flat White & Treats
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: "Save ideas you like" (Sage / Teal Blue Background) */}
      <section className="min-h-screen bg-[#dafffb] flex items-center justify-center px-6 py-16">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Visual: Board Collages */}
          <div className="order-2 md:order-1 relative max-w-md mx-auto w-full">
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={onEnterApp}
                className="cursor-pointer bg-white rounded-3xl p-3 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform"
              >
                <img
                  src="/src/assets/images/pin_home_decor_1793629784209.jpg"
                  alt="Home Decor Board"
                  referrerPolicy="no-referrer"
                  className="w-full h-52 object-cover rounded-2xl"
                />
                <div className="mt-2.5 px-1">
                  <p className="text-xs font-bold text-stone-900">
                    Indian Warm Decor
                  </p>
                  <p className="text-[11px] text-stone-400">18 pins</p>
                </div>
              </div>

              <div
                onClick={onEnterApp}
                className="cursor-pointer bg-white rounded-3xl p-3 shadow-lg transform rotate-3 hover:rotate-0 transition-transform mt-6"
              >
                <img
                  src="/src/assets/images/pin_outfit_inspo_1793629801112.jpg"
                  alt="Outfit Inspo Board"
                  referrerPolicy="no-referrer"
                  className="w-full h-52 object-cover rounded-2xl"
                />
                <div className="mt-2.5 px-1">
                  <p className="text-xs font-bold text-stone-900">
                    Festive Fusion
                  </p>
                  <p className="text-[11px] text-stone-400">24 pins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="order-1 md:order-2 text-center md:text-left space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0076d3] leading-tight">
              Save ideas you like
            </h2>
            <p className="text-lg sm:text-xl text-[#0076d3] font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              Collect your favourites so you can get back to them later. Organize moodboards for your dream home, wedding, or morning rituals.
            </p>
            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="px-6 py-3.5 bg-[#e60023] hover:bg-[#ad081b] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-md"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: "See it, make it, try it, do it" (Rose / Coral theme) */}
      <section className="min-h-screen bg-[#ffe2eb] flex items-center justify-center px-6 py-16">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#c05621] leading-tight">
              See it, make it, try it, do it
            </h2>
            <p className="text-lg sm:text-xl text-[#c05621] font-medium leading-relaxed max-w-md mx-auto md:mx-0">
              The best part of Encript is discovering new things and ideas from creators around the world and bringing them to life.
            </p>
            <div className="pt-2">
              <button
                onClick={onEnterApp}
                className="px-6 py-3.5 bg-[#e60023] hover:bg-[#ad081b] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-md"
              >
                Explore
              </button>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden shadow-2xl max-w-md mx-auto w-full">
            <img
              src="/src/assets/images/pin_diy_craft_1793629821836.jpg"
              alt="DIY craft creators"
              referrerPolicy="no-referrer"
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Creator Spotlight
              </span>
              <p className="text-lg font-bold mt-1">
                "Encript made me realize I could turn my ceramic hobby into a studio."
              </p>
              <p className="text-xs text-stone-300 mt-1">— Kavita, Studio Potter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Sign Up Embed Card */}
      <section className="min-h-screen bg-stone-900 text-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 transform rotate-12 scale-125">
            {[
              '/src/assets/images/pin_chai_snack_1793629767640.jpg',
              '/src/assets/images/pin_home_decor_1793629784209.jpg',
              '/src/assets/images/pin_outfit_inspo_1793629801112.jpg',
              '/src/assets/images/pin_diy_craft_1793629821836.jpg',
              '/src/assets/images/pin_minimal_architecture_1793629020212.jpg',
              '/src/assets/images/pin_warm_interior_1793629035949.jpg',
            ].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Background gallery"
                referrerPolicy="no-referrer"
                className="rounded-2xl h-60 object-cover"
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md bg-white text-stone-900 rounded-[32px] p-8 sm:p-10 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-md ring-2 ring-stone-200">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_f5mh3f5mh3f5mh3f_01b0e81b.png"
              alt="Encript Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="mt-4 text-2xl font-bold tracking-tight text-stone-900">
            Sign up to get your ideas
          </h3>
          <p className="mt-1 text-xs text-stone-500">
            Join millions of creators discovering ideas on Encript.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={onEnterApp}
              className="w-full py-3 bg-[#e60023] hover:bg-[#ad081b] text-white font-bold text-sm rounded-full transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <span>Explore Encript</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-full transition-colors cursor-pointer"
            >
              Already a user? Log in
            </button>
          </div>

          <p className="mt-5 text-[11px] text-stone-400 leading-tight">
            By signing up, you agree to Encript's Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

      {/* Official Footer Links */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-10 px-6 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Help</a>
          <a href="#" className="hover:text-white transition-colors">iPhone App</a>
          <a href="#" className="hover:text-white transition-colors">Android App</a>
          <a href="#" className="hover:text-white transition-colors">Users</a>
          <a href="#" className="hover:text-white transition-colors">Collections</a>
          <a href="#" className="hover:text-white transition-colors">Shopping</a>
          <a href="#" className="hover:text-white transition-colors">Today</a>
          <a href="#" className="hover:text-white transition-colors">Explore</a>
          <a href="#" className="hover:text-white transition-colors">Watch</a>
        </div>
        <div className="mt-6 text-center text-[11px] text-stone-500">
          © 2026 Encript. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
