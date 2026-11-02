/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Check,
  ArrowUpDown,
  LayoutTemplate,
  Grid,
  ArrowLeft,
} from 'lucide-react';
import { Pin, Board, UserProfile, DonationConfig } from './types';
import { INITIAL_PINS, INITIAL_BOARDS, INITIAL_USER, CATEGORIES } from './data/pinsData';
import { Navbar } from './components/Navbar';
import { PinCard } from './components/PinCard';
import { PinModal } from './components/PinModal';
import { CreatePinModal } from './components/CreatePinModal';
import { CreateBoardModal } from './components/CreateBoardModal';
import { BoardsView } from './components/BoardsView';
import { FollowingView } from './components/FollowingView';
import { PinterestLanding } from './components/PinterestLanding';
import { LoginSignupModal } from './components/LoginSignupModal';
import { DonationModal } from './components/DonationModal';
import { AdminDonationSettingsModal } from './components/AdminDonationSettingsModal';

const DEFAULT_DONATION_CONFIG: DonationConfig = {
  adminEmail: 'dassomnath2025@gmail.com',
  upiId: 'dassomnath2025@okaxis',
  payeeName: 'Somnath Das',
  defaultAmount: 100,
  message: 'Support PinTrust & Visual Creators in India',
  isActive: true,
};

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'feed'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [pins, setPins] = useState<Pin[]>(() => {
    const saved = localStorage.getItem('pintrust_pins');
    return saved ? JSON.parse(saved) : INITIAL_PINS;
  });

  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem('pintrust_boards');
    return saved ? JSON.parse(saved) : INITIAL_BOARDS;
  });

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<'explore' | 'following' | 'saved'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Pins');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trending' | 'saved' | 'newest'>('trending');
  const [activePinModal, setActivePinModal] = useState<Pin | null>(null);
  const [isCreatePinModalOpen, setIsCreatePinModalOpen] = useState<boolean>(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Donation & Admin Settings State
  const [donationConfig, setDonationConfig] = useState<DonationConfig>(() => {
    const saved = localStorage.getItem('pintrust_donation_config');
    return saved ? JSON.parse(saved) : DEFAULT_DONATION_CONFIG;
  });
  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState<boolean>(false);

  // Dark Mode support synced with document.documentElement
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pintrust_pins', JSON.stringify(pins));
    } catch {
      // LocalStorage quota fallback
    }
  }, [pins]);

  useEffect(() => {
    try {
      localStorage.setItem('pintrust_boards', JSON.stringify(boards));
    } catch {
      // LocalStorage quota fallback
    }
  }, [boards]);

  useEffect(() => {
    try {
      localStorage.setItem('pintrust_donation_config', JSON.stringify(donationConfig));
    } catch {
      // LocalStorage quota fallback
    }
  }, [donationConfig]);

  const handleSaveDonationConfig = (updated: DonationConfig) => {
    setDonationConfig(updated);
    showToast('Payment destination & donation settings updated!');
  };

  const handleAuthenticateAdmin = () => {
    setUser((prev) => ({
      ...prev,
      email: 'dassomnath2025@gmail.com',
      name: 'Somnath Das',
    }));
    showToast('Verified Google Account: dassomnath2025@gmail.com');
  };

  // Toast trigger helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Toggle Save Pin to Board
  const handleToggleSave = (pinId: string, boardId?: string) => {
    const targetBoardId = boardId || boards[0]?.id || '';
    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          const willBeSaved = !p.isSaved;
          const updatedSavesCount = willBeSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1);
          return {
            ...p,
            isSaved: willBeSaved,
            savedInBoardId: willBeSaved ? targetBoardId : undefined,
            savesCount: updatedSavesCount,
          };
        }
        return p;
      })
    );

    // Update active modal pin if open
    setActivePinModal((curr) => {
      if (curr && curr.id === pinId) {
        const willBeSaved = !curr.isSaved;
        return {
          ...curr,
          isSaved: willBeSaved,
          savedInBoardId: willBeSaved ? targetBoardId : undefined,
          savesCount: willBeSaved ? curr.savesCount + 1 : Math.max(0, curr.savesCount - 1),
        };
      }
      return curr;
    });

    const targetPin = pins.find((p) => p.id === pinId);
    const targetBoard = boards.find((b) => b.id === targetBoardId);
    if (targetPin?.isSaved) {
      showToast('Removed from saved pins');
    } else {
      showToast(`Saved to ${targetBoard?.name || 'Board'}`);
    }
  };

  // Toggle Like Pin
  const handleToggleLike = (pinId: string) => {
    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          const willBeLiked = !p.isLiked;
          return {
            ...p,
            isLiked: willBeLiked,
            likesCount: willBeLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    setActivePinModal((curr) => {
      if (curr && curr.id === pinId) {
        const willBeLiked = !curr.isLiked;
        return {
          ...curr,
          isLiked: willBeLiked,
          likesCount: willBeLiked ? curr.likesCount + 1 : Math.max(0, curr.likesCount - 1),
        };
      }
      return curr;
    });
  };

  // Toggle Follow Author
  const handleToggleFollow = (authorHandle: string) => {
    let nowFollowing = false;
    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.author.handle === authorHandle) {
          nowFollowing = !p.author.isFollowing;
          return {
            ...p,
            author: {
              ...p.author,
              isFollowing: nowFollowing,
              followersCount: nowFollowing
                ? p.author.followersCount + 1
                : Math.max(0, p.author.followersCount - 1),
            },
          };
        }
        return p;
      })
    );

    setActivePinModal((curr) => {
      if (curr && curr.author.handle === authorHandle) {
        const willFollow = !curr.author.isFollowing;
        return {
          ...curr,
          author: {
            ...curr.author,
            isFollowing: willFollow,
            followersCount: willFollow
              ? curr.author.followersCount + 1
              : Math.max(0, curr.author.followersCount - 1),
          },
        };
      }
      return curr;
    });

    showToast(nowFollowing ? `Following ${authorHandle}` : `Unfollowed ${authorHandle}`);
  };

  // Add Comment
  const handleAddComment = (pinId: string, text: string) => {
    const newCommentObj = {
      id: `c-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      text,
      timeAgo: 'Just now',
      likes: 0,
    };

    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          return {
            ...p,
            comments: [newCommentObj, ...p.comments],
          };
        }
        return p;
      })
    );

    setActivePinModal((curr) => {
      if (curr && curr.id === pinId) {
        return {
          ...curr,
          comments: [newCommentObj, ...curr.comments],
        };
      }
      return curr;
    });

    showToast('Comment posted');
  };

  // Like a comment
  const handleLikeComment = (pinId: string, commentId: string) => {
    const updateComments = (comments: typeof pins[0]['comments']) =>
      comments.map((c) => {
        if (c.id === commentId) {
          const userLiked = !c.userLiked;
          return {
            ...c,
            userLiked,
            likes: userLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      });

    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          return {
            ...p,
            comments: updateComments(p.comments),
          };
        }
        return p;
      })
    );

    setActivePinModal((curr) => {
      if (curr && curr.id === pinId) {
        return {
          ...curr,
          comments: updateComments(curr.comments),
        };
      }
      return curr;
    });
  };

  // Create new Pin
  const handleCreatePin = (newPin: Pin) => {
    setPins([newPin, ...pins]);
    setActiveTab('explore');
    showToast(`Published pin "${newPin.title}"!`);
  };

  // Create new Board
  const handleCreateBoard = (newBoard: Board) => {
    setBoards([...boards, newBoard]);
    showToast(`Created board "${newBoard.name}"!`);
  };

  // Share Pin / Copy Link
  const handleSharePin = (pin: Pin) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pin.sourceUrl || window.location.href);
      showToast('Link copied to clipboard!');
    } else {
      showToast('Sharing pin link');
    }
  };

  // Share profile
  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    }
  };

  // Filtered and Sorted Pins
  const filteredPins = useMemo(() => {
    let result = pins;

    // Category filter
    if (selectedCategory !== 'All Pins') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'trending') {
      result = [...result].sort((a, b) => b.savesCount + b.likesCount - (a.savesCount + a.likesCount));
    } else if (sortBy === 'saved') {
      result = [...result].sort((a, b) => b.savesCount - a.savesCount);
    }

    return result;
  }, [pins, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* View Switcher Floating Badge at Bottom */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setCurrentView((prev) => (prev === 'landing' ? 'feed' : 'landing'))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold shadow-xl hover:scale-105 transition-all cursor-pointer border border-stone-700/30"
          title="Toggle between in.pinterest.com Landing Page and Logged-in Home Feed"
        >
          {currentView === 'landing' ? (
            <>
              <Grid className="w-4 h-4 text-[#e60023]" />
              <span>Switch to Home Feed</span>
            </>
          ) : (
            <>
              <LayoutTemplate className="w-4 h-4 text-[#e60023]" />
              <span>Switch to Landing Page</span>
            </>
          )}
        </button>
      </div>

      {/* RENDER VIEW 1: in.pinterest.com Landing Page */}
      {currentView === 'landing' ? (
        <PinterestLanding
          onEnterApp={() => setCurrentView('feed')}
          onOpenLogin={() => {
            setAuthMode('login');
            setAuthModalOpen(true);
          }}
          onOpenSignup={() => {
            setAuthMode('signup');
            setAuthModalOpen(true);
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          onOpenDonationModal={() => setIsDonationModalOpen(true)}
        />
      ) : (
        /* RENDER VIEW 2: Pinterest Home Feed */
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onOpenCreateModal={() => setIsCreatePinModalOpen(true)}
            onSwitchToLanding={() => setCurrentView('landing')}
            user={user}
            donationConfig={donationConfig}
            onOpenDonationModal={() => setIsDonationModalOpen(true)}
            onOpenAdminSettings={() => setIsAdminSettingsOpen(true)}
          />

          <main className="flex-1">
            {activeTab === 'explore' && (
              <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4">
                {/* Back Option Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200/70 dark:border-stone-800/70">
                  <button
                    onClick={() => {
                      if (searchQuery) {
                        setSearchQuery('');
                      } else if (selectedCategory !== 'All Pins') {
                        setSelectedCategory('All Pins');
                      } else {
                        setCurrentView('landing');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all hover:-translate-x-0.5 cursor-pointer shadow-2xs border border-stone-200/60 dark:border-stone-750"
                    title="Go back to previous view"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#e60023]" />
                    <span>
                      {searchQuery
                        ? 'Back to All Results'
                        : selectedCategory !== 'All Pins'
                        ? 'Back to All Pins'
                        : 'Back to in.pinterest.com'}
                    </span>
                  </button>

                  {(searchQuery || selectedCategory !== 'All Pins') && (
                    <button
                      onClick={() => setCurrentView('landing')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back to Landing Page</span>
                    </button>
                  )}
                </div>

                {/* Category Filter Pills (Pinterest style) */}
                <div className="flex items-center justify-between gap-4 mb-5 overflow-x-auto pb-1 scrollbar-none">
                  <div className="flex items-center gap-2 shrink-0">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4.5 py-2 text-sm font-bold rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 tracking-normal ${
                          selectedCategory === cat
                            ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md'
                            : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-950 dark:text-white border border-stone-300/80 dark:border-stone-700 shadow-2xs'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-950 dark:text-white border border-stone-300 dark:border-stone-700 rounded-full px-3 py-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="trending">Trending</option>
                      <option value="saved">Most Saved</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {/* Empty State */}
                {filteredPins.length === 0 ? (
                  <div className="text-center py-20 bg-stone-50 dark:bg-stone-900/50 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
                    <Compass className="w-10 h-10 text-stone-400 mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      No pins found for "{searchQuery}"
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      Try searching for chai time snacks, Indian home decor, ethnic outfits, or concrete architecture.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Pins');
                      }}
                      className="mt-4 px-4 py-2 bg-[#e60023] text-white text-xs font-bold rounded-full hover:bg-[#ad081b] cursor-pointer"
                    >
                      Reset Search
                    </button>
                  </div>
                ) : (
                  /* Pinterest Masonry Grid */
                  <div className="masonry-grid">
                    {filteredPins.map((pin) => (
                      <PinCard
                        key={pin.id}
                        pin={pin}
                        boards={boards}
                        onOpenModal={(p) => setActivePinModal(p)}
                        onToggleSave={handleToggleSave}
                        onToggleLike={handleToggleLike}
                        onShare={handleSharePin}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'following' && (
              <FollowingView
                pins={pins}
                boards={boards}
                onOpenModal={(p) => setActivePinModal(p)}
                onToggleSave={handleToggleSave}
                onToggleLike={handleToggleLike}
                onToggleFollow={handleToggleFollow}
                onShare={handleSharePin}
                onBack={() => setActiveTab('explore')}
              />
            )}

            {activeTab === 'saved' && (
              <BoardsView
                user={user}
                boards={boards}
                allPins={pins}
                onOpenCreateBoard={() => setIsCreateBoardModalOpen(true)}
                onOpenModal={(p) => setActivePinModal(p)}
                onToggleSave={handleToggleSave}
                onToggleLike={handleToggleLike}
                onShare={handleSharePin}
                onShareProfile={handleShareProfile}
                onBack={() => setActiveTab('explore')}
              />
            )}
          </main>
        </>
      )}

      {/* Lightbox Detail Modal */}
      <PinModal
        pin={activePinModal}
        allPins={pins}
        boards={boards}
        onClose={() => setActivePinModal(null)}
        onToggleSave={handleToggleSave}
        onToggleLike={handleToggleLike}
        onToggleFollow={handleToggleFollow}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onSelectPin={(p) => setActivePinModal(p)}
        onShare={handleSharePin}
      />

      {/* Create Pin Studio Modal */}
      <CreatePinModal
        boards={boards}
        user={user}
        isOpen={isCreatePinModalOpen}
        onClose={() => setIsCreatePinModalOpen(false)}
        onCreatePin={handleCreatePin}
      />

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />

      {/* Login & Signup Modal */}
      <LoginSignupModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentView('feed');
          showToast('Welcome to Pinterest!');
        }}
      />

      {/* Donation QR & Rupee Payment Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        config={donationConfig}
        currentUser={user}
        onOpenAdminSettings={() => {
          setIsDonationModalOpen(false);
          setIsAdminSettingsOpen(true);
        }}
        onDonationSuccess={(amt) => showToast(`Thank you for your ₹${amt} donation!`)}
      />

      {/* Admin Payment Settings Modal (Strictly for dassomnath2025@gmail.com) */}
      <AdminDonationSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setIsAdminSettingsOpen(false)}
        config={donationConfig}
        currentUser={user}
        onSaveConfig={handleSaveDonationConfig}
        onAuthenticateAdmin={handleAuthenticateAdmin}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
