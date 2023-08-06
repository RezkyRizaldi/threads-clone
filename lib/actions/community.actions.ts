"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export const createCommunity = async (
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string,
) => {
  try {
    connectToDB();

    const user = await User.findOne({ id: createdById });

    if (!user) {
      throw new Error("User not found.");
    }

    const newCommunity = new Community({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id,
    });

    const createdCommunity = await newCommunity.save();

    user.communities.push(createdCommunity._id);

    await user.save();

    return createdCommunity;
  } catch (error: any) {
    throw new Error(`Failed to create community: ${error.message}`);
  }
};

export const fetchCommunityDetails = async (id: string) => {
  try {
    connectToDB();

    const communityDetails = await Community.findOne({ id }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);

    return communityDetails;
  } catch (error: any) {
    throw new Error(`Failed to fetch community details: ${error.message}`);
  }
};

export const fetchCommunityThreads = async (id: string) => {
  try {
    connectToDB();

    const communityThreads = await Community.findById(id).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "author",
          model: User,
          select: "name image id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "image _id",
          },
        },
      ],
    });

    return communityThreads;
  } catch (error: any) {
    throw new Error(`Failed to fetch community threads: ${error.message}`);
  }
};

export const fetchCommunities = async ({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof Community> = {};

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch communities: ${error.message}`);
  }
};

export const addMemberToCommunity = async (
  communityId: string,
  memberId: string,
) => {
  try {
    connectToDB();

    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found.");
    }

    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found.");
    }

    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community.");
    }

    community.members.push(user._id);

    await community.save();

    user.communities.push(community._id);

    await user.save();

    return community;
  } catch (error: any) {
    throw new Error(`Failed to adding member to community: ${error.message}`);
  }
};

export const removeUserFromCommunity = async (
  userId: string,
  communityId: string,
) => {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 },
    );

    if (!userIdObject) {
      throw new Error("User not found.");
    }

    if (!communityIdObject) {
      throw new Error("Community not found.");
    }

    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } },
    );

    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } },
    );

    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to removing user from community: ${error.message}`);
  }
};

export const updateCommunityInfo = async (
  communityId: string,
  name: string,
  username: string,
  image: string,
) => {
  try {
    connectToDB();

    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image },
    );

    if (!updatedCommunity) {
      throw new Error("Community not found.");
    }

    return updatedCommunity;
  } catch (error: any) {
    throw new Error(`Failed to updating community info: ${error.message}`);
  }
};

export const deleteCommunity = async (communityId: string) => {
  try {
    connectToDB();

    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found.");
    }

    await Thread.deleteMany({ community: communityId });

    const communityUsers = await User.find({ communities: communityId });

    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return deletedCommunity;
  } catch (error: any) {
    throw new Error(`Failed to deleting community: ${error.message}`);
  }
};
