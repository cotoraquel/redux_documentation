import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Post, NewPost, PostUpdate } from '@/features/posts/postsSlice'
import type { User } from '@/features/users/usersSlice'

export type { Post }

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
    tagTypes: ['Post'],
    endpoints: builder => ({
      getPosts: builder.query<Post[], void>({
        query: () => '/posts',
        providesTags: (result = [], error, arg) => [
          'Post',
          ...result.map(({ id }) => ({ type: 'Post', id }) as const)
        ]
      }),
      getPost: builder.query<Post, string>({
        query: postId => `/posts/${postId}`,
        providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
      }),
      addNewPost: builder.mutation<Post, NewPost>({
        query: initialPost => ({
          url: '/posts',
          method: 'POST',
          body: initialPost
        }),
        invalidatesTags: ['Post']
      }),
      editPost: builder.mutation<Post, PostUpdate>({
        query: post => ({
          url: `posts/${post.id}`,
          method: 'PATCH',
          body: post
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
      }),
      getUsers: builder.query<User[], void>({
        query: () => '/users'
      }),
      addReaction: builder.mutation<
      Post,
      { postId: string; reaction: ReactionName }
    >({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.postId }
      ]
    })
    })
  })

export const { useGetPostsQuery, useGetPostQuery, useGetUsersQuery, useAddNewPostMutation, useEditPostMutation, useAddReactionMutation } = apiSlice
