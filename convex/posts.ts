// create a post to our database
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { arch } from 'os';

export const createPost = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },

  handler: async (ctx, args) => {
    // make a post.
    const post = await ctx.db.insert('posts', args);

    if (post) {
      return {
        message: 'Post Succesfull',
        status: 201,
        data: post,
      };
    } else {
      return {
        message: 'Post Failed',
        status: 500,
        data: null,
      };
    }
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const posts = await ctx.db.query('posts').order('desc').collect();
    // Reverse the list so that it's in a chronological order.
    return posts;
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id('posts'),
    updateData: v.object({
      title: v.string(),
      description: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { postId, updateData } = args;

    // fetch the post from the database
    const post = await ctx.db.get(postId);

    if (!post) {
      throw new Error('Post does not exist in the database');
    }

    // perform the update
    const updatedPost = await ctx.db.patch(postId, updateData);

    return {
      status: 201,
      message: 'Post updated succesfully',
      data: updatedPost,
    };
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const { postId } = args;

    // fetch the post from the database
    const post = await ctx.db.get(postId);

    if (!post) {
      throw new Error(
        'Post does not exist in the database / Post is Not Found',
      );
    }

    await ctx.db.delete(postId);
    return {
      status: 201,
      message: 'Post deleted succesfully',
      data: null,
    };
  },
});
