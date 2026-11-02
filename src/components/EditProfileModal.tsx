import React, { useState, useRef } from 'react';
import { X, Camera, Check, Globe, MapPin, AtSign, User as UserIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle.replace(/^@/, ''));
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const [website, setWebsite] = useState(user.website || 'https://somnath.design');
  const [location, setLocation] = useState(user.location || 'San Francisco, CA');
  const [avatarInputUrl, setAvatarInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAvatar(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleAvatarFileUpload(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (avatarInputUrl.trim()) {
      setAvatar(avatarInputUrl.trim());
      setAvatarInputUrl('');
      setShowUrlInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedHandle = handle.trim().startsWith('@')
      ? handle.trim()
      : `@${handle.trim().replace(/\s+/g, '_').toLowerCase()}`;

    const updated: UserProfile = {
      ...user,
      name: name.trim(),
      handle: formattedHandle,
      bio: bio.trim(),
      avatar: avatar,
      website: website.trim() || undefined,
      location: location.trim() || undefined,
    };

    onSave(updated);
    onClose();
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">
              Edit Profile
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Keep your personal details, avatar, and bio up to date.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Avatar Section */}
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <img
                src={avatar}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-700 shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change photo"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-full transition-colors cursor-pointer"
                >
                  Upload New Photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs font-medium text-stone-500 hover:text-rose-600 cursor-pointer"
                >
                  Use URL
                </button>
              </div>

              {/* Preset avatars selection */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-stone-400 mr-1">Presets:</span>
                {avatarPresets.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(presetUrl)}
                    className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-stone-200 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <img
                      src={presetUrl}
                      alt="Preset"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {showUrlInput && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarInputUrl}
                    onChange={(e) => setAvatarInputUrl(e.target.value)}
                    className="flex-1 px-3 py-1 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-2.5 py-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold rounded-lg"
                  >
                    Set
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Display Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Username / Handle *
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your style, aesthetics, or current projects..."
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
          </div>

          {/* Website & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Website Link
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
