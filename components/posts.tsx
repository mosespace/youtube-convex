'use client';

import React, { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Button } from './ui/button';
import CreatePostForm from './create-post-form';
import { deletePost } from '@/convex/posts';
import { toast } from 'sonner';

export default function Posts() {
  const [deleting, setDeleting] = useState(false);
  const posts = useQuery(api.posts.getPosts);
  const deletePost = useMutation(api.posts.deletePost);

  const handleDelete = async (postId: any) => {
    try {
      setDeleting(true);
      const req = await deletePost({ postId });
      if (req.status === 201) {
        toast.success(`${req.message}`);
      } else {
        toast.error(`${req.message}`);
      }
    } catch (error) {
      console.log('Error while deleting post:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ul className="space-y-2 mt-4">
      {posts?.map((post) => (
        <li
          key={post._id}
          className="flex items-center justify-between p-2 rounded-lg 
            bg-green-100 dark:bg-green-900"
        >
          <span className="flex-grow mr-3">{post.title}</span>
          <div className="flex space-x-2">
            <CreatePostForm
              isDisabled={deleting}
              isEdit={true}
              initialData={post}
            />
            <Button
              onClick={() => handleDelete(post._id)}
              variant="ghost"
              size="icon"
              disabled={deleting}
              className="text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide size-4 lucide-trash-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
