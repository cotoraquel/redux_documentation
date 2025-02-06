import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Spinner } from '@/components/Spinner'

import { useGetPostsQuery, Post } from '@/features/api/apiSlice'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'


// Go back to passing a `post` object as a prop
interface PostExcerptProps {
  post: Post
}

function PostExcerpt({ post }: PostExcerptProps) {
  return(
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
    </article>
  )
}

export const PostsList = () => {
  // Calling the `useGetPostsQuery()` hook automatically fetches data!
  const {
    data: posts = [],
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    // Sort posts in descending chronological order
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content: React.ReactNode

  // const sortedPosts = useMemo(() => {
  //   const sortedPosts = posts.slice()
  //   // Sort posts in descending chronological order
  //   sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
  //   return sortedPosts
  // }, [posts])
  
  // Show loading states based on the hook status flags
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = sortedPosts.map(post => <PostExcerpt key={post.id} post={post} />)
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}