import { Link, useParams } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'

import { useAppSelector } from '@/app/hooks'
import { useGetPostsQuery, Post } from '@/features/api/apiSlice'
import { selectUserById } from './usersSlice'

type GetPostSelectFromResultArg = TypedUseQueryStateResult<Post[], any, any>

const selectPostsForUser = createSelector(
  (res: GetPostSelectFromResultArg) => res.data,
  (res: GetPostSelectFromResultArg, userId: string) => userId,
  (data, userId) => data?.filter((post) => post.user === userId) ?? [],
)

export const UserPage = () => {
  const { userId } = useParams()

  if (!userId) {
    return <section><h2>Invalid User ID</h2></section>
  }

  const user = useAppSelector((state) => selectUserById(state, userId))

  const { data: allPosts } = useGetPostsQuery(undefined)
  const postsForUser = allPosts?.filter((post) => post.user === userId) ?? []

  if (!user) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>
        {postsForUser.length > 0 ? (
          postsForUser.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </ul>
    </section>
  )
}
