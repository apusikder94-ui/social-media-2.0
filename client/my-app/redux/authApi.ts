import { BASE_URL } from "@/base_url/base_url";
import {
  ApiResponseUser,
  IOtherUser,
  ISignIn,
  ISignUp,
  ISuggestedUser,
  IUser,
} from "@/type/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/auth`,
    credentials: "include",
  }),

  tagTypes: ["User"], // 🔥 ADD THIS

  endpoints: (builder) => ({
    // ================= SIGN UP =================
    signUp: builder.mutation<
      ISignUp,
      { name: string; email: string; password: string }
    >({
      query: (data) => ({
        url: "/signUp",
        method: "POST",
        body: data,
      }),
    }),

    // ================= SIGN IN =================
    signIn: builder.mutation<ISignIn, { email: string; password: string }>({
      query: (data) => ({
        url: "/signIn",
        method: "POST",
        body: data,
      }),
    }),

    // ================= FOLLOW / UNFOLLOW =================
    followOrUnFollow: builder.mutation<
      { success: boolean; message: string; followed: boolean },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/followUnFollow/${id}`,
        method: "POST",
      }),

      invalidatesTags: ["User"], // 🔥 REFRESH USER DATA
    }),

    // ================= BOOKMARK =================
    bookmarkUnBookmark: builder.mutation<
      { success: boolean; message: string; bookmarked: boolean },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/bookmark/${id}`,
        method: "POST",
      }),

      invalidatesTags: ["User"], // 🔥 REFRESH USER DATA
    }),

    // ================= SUGGESTED USERS =================
    getSuggestedUsers: builder.query<ISuggestedUser, void>({
      query: () => ({
        url: "/suggested-users",
        method: "GET",
      }),
    }),

    // ================= CURRENT PROFILE =================
    getProfile: builder.query<IUser, void>({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),

      providesTags: ["User"], // 🔥 IMPORTANT
    }),

    // ================= UPDATE PROFILE =================
    updateProfile: builder.mutation<ApiResponseUser, FormData>({
      query: (formData) => ({
        url: "/profile",
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: ["User"], // 🔥 AUTO REFRESH
    }),

    // ================= OTHER USER PROFILE =================
    otherProfile: builder.query<IOtherUser, string>({
      query: (id) => ({
        url: `/otherUser/${id}`,
        method: "GET",
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"], // 🔥 AUTO REFRESH
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useFollowOrUnFollowMutation,
  useBookmarkUnBookmarkMutation,
  useGetSuggestedUsersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useOtherProfileQuery,
  useLogoutMutation,
} = authApi;
