// src/services/userService.ts
import api from "@/utils/axiosConfig.ts";

//
//  Generic API wrapper
//
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  result: T;
}

//
//  Public user view (matches PublicUserResponseDTO)
//
export interface PublicUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  bio: string;
}

//
//  Full current‐user view (matches UserResponseDTO)
//
export interface UserProfile extends PublicUser {
  email: string;
  isVerified: boolean;
  coins: number;
  totalLikes: number;
  totalPost: number;
  userRole: string;
  followerCount: number;
  followingCount: number;
  followers: PublicUser[];
  following: PublicUser[];
}

//
//  Endpoints
//

/**
 * GET /api/users/me
 * Returns the full profile of the logged-in user.
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const resp = await api.get<UserProfile>("/users/me");
    return resp.data;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
};

/**
 * GET /api/users/{id}
 * Returns the raw User entity (if you still need it).
 */
export const getUserById = async (id: number): Promise<UserProfile | null> => {
  try {
    const resp = await api.get<UserProfile>(`/users/${id}`);
    return resp.data;
  } catch (err) {
    console.error(`getUserById(${id}) error:`, err);
    return null;
  }
};

/**
 * POST /api/users/{currentUserId}/follow/{targetUserId}
 * Toggle follow/unfollow; returns a success message.
 */
export const toggleFollow = async (
  currentUserId: number,
  targetUserId: number,
): Promise<string | null> => {
  try {
    const resp = await api.post<ApiResponse<string>>(
      `/users/${currentUserId}/follow/${targetUserId}`,
    );
    return resp.data.result;
  } catch (err) {
    console.error("toggleFollow error:", err);
    return null;
  }
};

/**
 * GET /api/users/{id}/followers
 * List of public profiles following user {id}.
 */
export const getFollowers = async (id: number): Promise<PublicUser[]> => {
  try {
    const resp = await api.get<PublicUser[]>(`/users/${id}/followers`);
    return resp.data;
  } catch (err) {
    console.error("getFollowers error:", err);
    return [];
  }
};

/**
 * GET /api/users/{id}/following
 * List of public profiles user {id} is following.
 */
export const getFollowing = async (id: number): Promise<PublicUser[]> => {
  try {
    const resp = await api.get<PublicUser[]>(`/users/${id}/following`);
    return resp.data;
  } catch (err) {
    console.error("getFollowing error:", err);
    return [];
  }
};

/**
 * POST /api/users/upload
 * Upload a profile picture; returns the URL path.
 */
export const uploadProfileImage = async (
  file: File,
): Promise<string | null> => {
  const form = new FormData();
  form.append("file", file);
  try {
    const resp = await api.post<string>("/users/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp.data;
  } catch (err) {
    console.error("uploadProfileImage error:", err);
    return null;
  }
};

/**
 * PUT /api/users/me
 * Update the logged-in user’s profile.
 * @param updates partial map of fields you want to change
 */
export interface ProfileUpdates {
  username?: string;
  bio?: string;
  profileImage?: string;
}

export const updateProfile = async (
  updates: ProfileUpdates,
): Promise<boolean> => {
  try {
    const resp = await api.put<ApiResponse<boolean>>("/users/me", updates);
    return resp.data.success;
  } catch (err) {
    console.error("updateProfile error:", err);
    return false;
  }
};

/**
 * DELETE /api/users/me
 * Delete the logged-in user’s account.
 */
export const deleteCurrentUser = async (): Promise<boolean> => {
  try {
    const resp = await api.delete<ApiResponse<boolean>>("/users/me");
    return resp.data.success;
  } catch (err) {
    console.error("deleteCurrentUser error:", err);
    return false;
  }
};

/**
 * GET /api/users/all
 * Fetch all users as public profiles.
 */
export const getAllUsers = async (): Promise<PublicUser[]> => {
  try {
    const resp = await api.get<ApiResponse<PublicUser[]>>("/users/all");
    return resp.data.result;
  } catch (err) {
    console.error("getAllUsers error:", err);
    return [];
  }
};

//call this
export const getUserCoins = async (): Promise<number> => {
  try{
    const resp = await api.get<ApiResponse<number>>("/users/my-coins");
    return resp.data.result;

  }catch (e) {
    console.error("getUserCoins error:", e);
    return 0;
  }
}
