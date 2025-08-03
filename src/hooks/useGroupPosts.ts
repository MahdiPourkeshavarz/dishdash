import { getDistanceInMeters } from "@/lib/getDistance";
import { Post } from "@/types";
import { useMemo } from "react";

export const useGroupedPosts = (posts: Post[]): Post[][] => {
  const groupedPosts = useMemo(() => {
    if (!posts || posts.length === 0) {
      return [];
    }

    const DISTANCE_THRESHOLD = 3;
    const groups: Post[][] = [];
    const processedPostIds = new Set<string>();

    posts.forEach((post) => {
      if (processedPostIds.has(post._id as string)) {
        return;
      }

      const newGroup: Post[] = [post];
      processedPostIds.add(post._id as string);

      posts.forEach((otherPost) => {
        if (
          post._id === otherPost._id ||
          processedPostIds.has(otherPost._id as string)
        ) {
          return;
        }

        if (
          getDistanceInMeters(post.position, otherPost.position) <
          DISTANCE_THRESHOLD
        ) {
          newGroup.push(otherPost);
          processedPostIds.add(otherPost._id as string);
        }
      });

      groups.push(newGroup);
    });

    return groups;
  }, [posts]);

  return groupedPosts;
};
