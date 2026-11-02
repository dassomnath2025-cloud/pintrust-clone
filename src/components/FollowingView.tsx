import React from 'react';
import { Users, UserCheck, UserPlus, Sparkles, ArrowLeft } from 'lucide-react';
import { Pin, Board } from '../types';
import { PinCard } from './PinCard';

interface FollowingViewProps {
  pins: Pin[];
  boards: Board[];
  onOpenModal: (pin: Pin) => void;
  onToggleSave: (pinId: string, boardId?: string) => void;
  onToggleLike: (pinId: string) => void;
  onToggleFollow: (handle: string) => void;
  onShare: (pin: Pin) => void;
  onBack?: () => void;
}

export const FollowingView: React.FC<FollowingViewProps> = ({
  pins,
  boards,
  onOpenModal,
  onToggleSave,
  onToggleLike,
  onToggleFollow,
  onShare,
  onBack,
}) => {
  // Extract unique authors
  const authorsMap = new Map<string, (typeof pins)[0]['author']>();
  pins.forEach((p) => {
    if (!authorsMap.has(p.author.handle)) {
      authorsMap.set(p.author.handle, p.author);
    }
  });
  const allAuthors = Array.from(authorsMap.values());
  const followedAuthors = allAuthors.filter((a) => a.isFollowing);

  // Pins from followed creators
  const followingPins = pins.filter((p) => p.author.isFollowing);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button option */}
      {onBack && (
        <div className="mb-4 pb-2 border-b border-stone-200/70 dark:border-stone-800/70">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all hover:-translate-x-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#e60023]" />
            <span>Back to Home</span>
          </button>
        </div>
      )}
      {/* Featured Curators Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              Curators You Follow & Discover
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono tabular-nums">
            {followedAuthors.length} followed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allAuthors.map((author) => (
            <div
              key={author.handle}
              className="p-3.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col items-center text-center shadow-xs"
            >
              <img
                src={author.avatar}
                alt={author.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover mb-2 ring-2 ring-stone-100 dark:ring-stone-800"
              />
              <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate w-full">
                {author.name}
              </h4>
              <p className="text-[11px] text-stone-400 truncate w-full mb-3">
                {author.handle}
              </p>

              <button
                onClick={() => onToggleFollow(author.handle)}
                className={`w-full py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  author.isFollowing
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                {author.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pins Feed */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-4">
          Latest From Creators You Follow
        </h3>

        {followingPins.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
            <Users className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              No pins from followed creators yet
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Follow curators above or on any pin to fill this feed.
            </p>
          </div>
        ) : (
          <div className="masonry-grid">
            {followingPins.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                boards={boards}
                onOpenModal={onOpenModal}
                onToggleSave={onToggleSave}
                onToggleLike={onToggleLike}
                onShare={onShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
