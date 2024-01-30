"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
}

export async function createThread({
    text,
    author,
    communityId,
    path, }: Params) {
    try {
        connectToDB();
        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        await User.findByIdAndUpdate(author, {
            $push: { threads: createThread._id }
        })

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`)
    }

};

export async function fetchPosts(pageNumber = 1, pageSize = 20) {

      connectToDB();
  
      const skipAmount = (pageNumber - 1) * pageSize;
  
      const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
          path: "author",
          model: User,
        })
        .populate({
          path: "children",
          populate: {
            path: "author",
            model: User,
            select: "_id name parentId image",
          },
        });
        const totalPostsCount = await Thread.countDocuments({
            parentId: { $in: [null, undefined] },
          });
          const posts = await postsQuery.exec();
          const isNext = totalPostsCount > skipAmount + posts.length;
      
          return { posts, isNext };
    }

    export async function fetchThreadById(threadId: string) {
      connectToDB();
      try {
        const thread = await Thread.findById(threadId)
          .populate({
            path: "author",
            model: User,
            select: "_id id name image",
          })
          .populate({
            path: "community",
            model: Community,
            select: "_id id name image",
          })
          .populate({
            path: "children", // Populate the children field
            populate: [
              {
                path: "author", // Populate the author field within children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
              {
                path: "children", // Populate the children field within children
                model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
                populate: {
                  path: "author", // Populate the author field within nested children
                  model: User,
                  select: "_id id name parentId image", // Select only _id and username fields of the author
                },
              },
            ],
          })
          .exec();
    
        //
        return thread;
    
        //
      } catch (error) {
        console.log("Error while fetching thread using id", error);
        throw new Error("Not able to get the thread");
      }
    }
