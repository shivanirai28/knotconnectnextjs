"use server";

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  

  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id: userId },

      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(error);
  }
}


export async function fetchUser(userId:string) {
  try {
    connectToDB ();

    return await User
    .findOne({id: userId })
    //.populate({})//
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId })
    .populate({
      path: "threads",
      model: Thread,
      populate: 
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      
    });
    return threads;
  } catch (error: any) {
    console.error("Error fetching user threads:", error);
    throw new Error("Failed to get posts");
  }
}