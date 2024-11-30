'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useForm } from 'react-hook-form';
import { PostFormData, postSchema } from '@/lib/schemas';
import { createPost } from '@/convex/posts';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

interface ComponentProps {
  isEdit?: boolean;
  initialData?: any;
  isDisabled?: any;
}
export default function CreatePostForm({
  isEdit,
  initialData,
  isDisabled,
}: ComponentProps) {
  // console.log('InitialData:', initialData);

  const [submitting, setSubmitting] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: initialData ? initialData : '',
    resolver: zodResolver(postSchema),
  });

  const createPost = useMutation(api.posts.createPost);
  const updatePost = useMutation(api.posts.updatePost);

  const onSubmit = async (data: PostFormData) => {
    try {
      setSubmitting(true);

      if (!initialData) {
        const req = await createPost({
          title: data.title,
          description: data.description,
        });
        if (req.status === 201) {
          toast.success(`${req.message}`);
        } else {
          toast.error(`${req.message}`);
        }
      } else {
        const req = await updatePost({
          postId: initialData._id,
          updateData: data,
        });
        if (req.status === 201) {
          toast.success(`${req.message}`);
        } else {
          toast.error(`Failed to update post`);
        }
      }
    } catch (error) {
      console.log('Posting has failed:', error);
    } finally {
      setSubmitting(false);
      reset();
    }
  };

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button disabled={isDisabled} variant="outline">
            {isEdit ? (
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
                className="lucide size-4lucide-file-pen-line"
              >
                <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                <path d="M8 18h1" />
              </svg>
            ) : (
              'Create Post '
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Make a post to Convex DB</DrawerTitle>
              <DrawerDescription>
                This post is real-time 💥🔥.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              {/* <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(-10)}
                  disabled={goal <= 200}
                >
                  <Minus />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">
                    {goal}
                  </div>
                  <div className="text-[0.70rem] uppercase text-muted-foreground">
                    Calories/day
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(10)}
                  disabled={goal >= 400}
                >
                  <Plus />
                  <span className="sr-only">Increase</span>
                </Button>
              </div> */}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold">
                    Enter post title;
                  </Label>
                  <Input
                    disabled={submitting}
                    {...register('title')}
                    type="text"
                    id="title"
                  />

                  {errors.title && (
                    <p className="text-sm text-red-500 pb-4">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="description" className="font-semibold">
                    Enter post description;
                  </Label>
                  <Textarea
                    {...register('description')}
                    id="description"
                    disabled={submitting}
                    placeholder="Enter post description..."
                  />

                  {errors.description && (
                    <p className="text-sm text-red-500 pb-4">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <DrawerFooter>
                  <Button>
                    {submitting
                      ? `${initialData ? 'Updating...' : 'Posting...'}`
                      : `${initialData ? 'Update Post' : 'Submit Post'}`}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
