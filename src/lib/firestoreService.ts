import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { Pin, Board, UserProfile, DonationConfig, Comment } from '../types';

/**
 * Persist or update user profile in Firestore
 */
export async function saveUserProfileInDb(profile: UserProfile): Promise<void> {
  const uid = profile.uid || auth.currentUser?.uid;
  if (!uid) return;

  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        id: uid,
        name: profile.name,
        handle: profile.handle,
        avatar: profile.avatar,
        bio: profile.bio || '',
        email: profile.email || auth.currentUser?.email || '',
        website: profile.website || '',
        location: profile.location || '',
        followersCount: profile.followersCount || 0,
        followingCount: profile.followingCount || 0,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch a user profile by UID
 */
export async function getUserProfileFromDb(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      uid: data.id,
      name: data.name,
      handle: data.handle,
      avatar: data.avatar,
      bio: data.bio || '',
      email: data.email || '',
      website: data.website || '',
      location: data.location || '',
      followersCount: data.followersCount || 0,
      followingCount: data.followingCount || 0,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Upload and save a new Pin to Firestore
 */
export async function createPinInDb(pin: Pin): Promise<void> {
  const path = `pins/${pin.id}`;
  const currentUid = auth.currentUser?.uid || pin.authorId || 'anonymous_user';

  try {
    const pinDocRef = doc(db, 'pins', pin.id);
    const cleanTags = Array.isArray(pin.tags) ? pin.tags.join(', ') : String(pin.tags || '');

    const pinPayload = {
      id: pin.id,
      title: pin.title,
      description: pin.description || '',
      imageUrl: pin.imageUrl,
      aspectRatio: pin.aspectRatio || '3:4',
      category: pin.category || 'Visual Art',
      authorId: currentUid,
      authorName: pin.author.name,
      authorHandle: pin.author.handle,
      authorAvatar: pin.author.avatar,
      savesCount: pin.savesCount || 1,
      likesCount: pin.likesCount || 0,
      sourceUrl: pin.sourceUrl || '',
      tags: cleanTags,
      createdAt: pin.createdAt || new Date().toISOString(),
      savedInBoardId: pin.savedInBoardId || '',
      comments: pin.comments || [],
    };

    await setDoc(pinDocRef, pinPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update Pin engagement (likes, saves, comments)
 */
export async function updatePinInDb(
  pinId: string,
  updates: Partial<Pin> & { comments?: Comment[] }
): Promise<void> {
  const path = `pins/${pinId}`;
  try {
    const pinDocRef = doc(db, 'pins', pinId);
    const docUpdates: Record<string, unknown> = {};

    if (updates.likesCount !== undefined) docUpdates.likesCount = updates.likesCount;
    if (updates.savesCount !== undefined) docUpdates.savesCount = updates.savesCount;
    if (updates.comments !== undefined) docUpdates.comments = updates.comments;
    if (updates.title !== undefined) docUpdates.title = updates.title;
    if (updates.description !== undefined) docUpdates.description = updates.description;

    await updateDoc(pinDocRef, docUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a pin from Firestore
 */
export async function deletePinFromDb(pinId: string): Promise<void> {
  const path = `pins/${pinId}`;
  try {
    await deleteDoc(doc(db, 'pins', pinId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to pins collection in Firestore with real-time updates
 */
export function subscribePinsFromDb(onPinsUpdate: (pins: Pin[]) => void): () => void {
  const path = 'pins';
  const pinsColRef = collection(db, path);

  const unsubscribe = onSnapshot(
    pinsColRef,
    (snapshot) => {
      const pinsList: Pin[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const rawTags = d.tags;
        let tagsArr: string[] = [];
        if (Array.isArray(rawTags)) {
          tagsArr = rawTags;
        } else if (typeof rawTags === 'string') {
          tagsArr = rawTags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        }

        pinsList.push({
          id: d.id,
          title: d.title || 'Untitled Pin',
          description: d.description || '',
          imageUrl: d.imageUrl,
          aspectRatio: d.aspectRatio || '3:4',
          category: d.category || 'General',
          author: {
            name: d.authorName || 'Creator',
            handle: d.authorHandle || '@creator',
            avatar: d.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            followersCount: 120,
            isFollowing: false,
          },
          authorId: d.authorId,
          savesCount: d.savesCount || 0,
          likesCount: d.likesCount || 0,
          savedInBoardId: d.savedInBoardId || undefined,
          sourceUrl: d.sourceUrl || undefined,
          tags: tagsArr.length > 0 ? tagsArr : ['Encript', 'Inspiration'],
          createdAt: d.createdAt || 'Recent',
          comments: Array.isArray(d.comments) ? d.comments : [],
        });
      });
      onPinsUpdate(pinsList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

/**
 * Create a new Board in Firestore
 */
export async function createBoardInDb(board: Board): Promise<void> {
  const path = `boards/${board.id}`;
  const currentUid = auth.currentUser?.uid || board.userId || 'guest_user';

  try {
    const boardDocRef = doc(db, 'boards', board.id);
    await setDoc(boardDocRef, {
      id: board.id,
      userId: currentUid,
      name: board.name,
      description: board.description || '',
      isPrivate: board.isPrivate,
      coverImage: board.coverImage || '',
      pinIds: board.pinIds || [],
      createdAt: board.createdAt || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Subscribe to Boards in Firestore
 */
export function subscribeBoardsFromDb(onBoardsUpdate: (boards: Board[]) => void): () => void {
  const path = 'boards';
  const boardsColRef = collection(db, path);

  const unsubscribe = onSnapshot(
    boardsColRef,
    (snapshot) => {
      const boardsList: Board[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        boardsList.push({
          id: d.id,
          userId: d.userId,
          name: d.name || 'Untitled Board',
          description: d.description || '',
          isPrivate: Boolean(d.isPrivate),
          coverImage: d.coverImage || undefined,
          pinIds: Array.isArray(d.pinIds) ? d.pinIds : [],
          createdAt: d.createdAt || '2026-01-01',
        });
      });
      onBoardsUpdate(boardsList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

/**
 * Update a Board in Firestore
 */
export async function updateBoardInDb(boardId: string, updates: Partial<Board>): Promise<void> {
  const path = `boards/${boardId}`;
  try {
    const boardDocRef = doc(db, 'boards', boardId);
    await updateDoc(boardDocRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Subscribe to admin donation config
 */
export function subscribeDonationConfig(onUpdate: (config: DonationConfig) => void): () => void {
  const path = 'configs/donation';
  const configDocRef = doc(db, 'configs', 'donation');

  const unsubscribe = onSnapshot(
    configDocRef,
    (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        onUpdate({
          adminEmail: d.adminEmail || 'dassomnath2025@gmail.com',
          upiId: d.upiId || 'dassomnath2025@okaxis',
          payeeName: d.payeeName || 'Somnath Das',
          defaultAmount: Number(d.defaultAmount) || 100,
          message: d.message || 'Support Encript & Visual Creators in India',
          isActive: d.isActive !== false,
        });
      }
    },
    (error) => {
      // Config might not exist yet or permissions; graceful handling
      console.warn('Config snapshot note:', error);
    }
  );

  return unsubscribe;
}

/**
 * Save donation config in Firestore (Admin only)
 */
export async function saveDonationConfigInDb(config: DonationConfig): Promise<void> {
  const path = 'configs/donation';
  try {
    await setDoc(
      doc(db, 'configs', 'donation'),
      {
        adminEmail: config.adminEmail,
        upiId: config.upiId,
        payeeName: config.payeeName,
        defaultAmount: config.defaultAmount,
        message: config.message,
        isActive: config.isActive,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
