import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Spinner } from '@/components/Spinner'

import classnames from 'classnames'

import { useGetPostsQuery, Post } from '@/features/api/apiSlice'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'


// Go back to passing a `post` object as a prop
interface PostExcerptProps {
  post: Post
}

function PostExcerpt({ post }: PostExcerptProps) {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        
        <PostAuthor userId={post.user} />
       
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}

export const PostsList = () => {
  // Calling the `useGetPostsQuery()` hook automatically fetches data!
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch
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
    const renderedPosts = sortedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
    ))

    const containerClassname = classnames('posts-container', {
      disabled: isFetching
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}