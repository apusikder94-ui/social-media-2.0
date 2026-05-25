import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseComment, IComment } from "@/type/type";
import { BASE_URL } from "@/base_url/base_url";

export const commentApi = createApi({
  reducerPath: "commentApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/comment`,
    credentials: "include",
  }),

  tagTypes: ["Comment", "Post"],

  endpoints: (builder) => ({
    // CREATE COMMENT
    createComment: builder.mutation<IComment, { id: string; comment: string }>({
      query: ({ id, comment }) => ({
        url: `/${id}`,
        method: "POST",
        body: { comment },
      }),

      invalidatesTags: ["Comment", "Post"],
    }),

    // GET COMMENTS
    getAllComment: builder.query<ApiResponseComment, { id: string }>({
      query: ({ id }) => `/${id}`,
      providesTags: ["Comment"],
    }),
  }),
});

export const { useCreateCommentMutation, useGetAllCommentQuery } = commentApi;
