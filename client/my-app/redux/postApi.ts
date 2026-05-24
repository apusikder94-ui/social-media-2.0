import { ApiResponsePost, ICreatePostResposne, IDeletePostResposne, ILikedPost, ISearchResposne, IUpdatedPostResposne } from "@/type/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/post",
    credentials: "include",
  }),

  tagTypes: ["Post"],

  endpoints: (builder) => ({
    // ================= CREATE POST =================
    createPost: builder.mutation<ICreatePostResposne, FormData>({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),

    // ================= GET ALL POST =================
    getAllPost: builder.query<ApiResponsePost, void>({
      query: () => ({
        url: "/all",
        method: "GET",
      }),
      providesTags: ["Post"],
    }),

    // ================= LIKE / UNLIKE =================
    likeOrUnLike: builder.mutation<ILikedPost, { id: string }>({
      query: ({ id }) => ({
        url: `/likeOrUnLike/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),

    // ================= SEARCH =================
    searchPost: builder.query<ISearchResposne, string>({
      query: (keyword) => ({
        url: `/search?i=${keyword}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),

    // ================= FOLLOW POSTS =================
    iSFollowing: builder.query<any, void>({
      query: () => "/isFollowingPost",
      providesTags: ["Post"],
    }),

    // ================= EDIT POST =================
    editPost: builder.mutation<IUpdatedPostResposne, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/updatedPost/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),

    // ================= DELETE POST =================
    deletePost: builder.mutation<IDeletePostResposne, { id: string }>({
      query: ({ id }) => ({
        url: `/deletePost/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetAllPostQuery,
  useLikeOrUnLikeMutation,
  useSearchPostQuery,
  useISFollowingQuery,
  useDeletePostMutation,
  useEditPostMutation,
} = postApi;
