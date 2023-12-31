import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:py-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link className="relative h-11 w-11" href={`/profile/${author.id}`}>
              <Image
                className="cursor-pointer rounded-full"
                src={author.image}
                fill
                alt="User Community Image"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link className="w-fit" href={`/profile/${author.id}`}>
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className={`mt-5 flex flex-col gap-3 ${isComment && "mb-10"}`}>
              <div className="flex gap-3.5">
                <Image
                  className="cursor-pointer object-contain"
                  src="/assets/heart-gray.svg"
                  alt="Heart"
                  width={24}
                  height={24}
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    className="cursor-pointer object-contain"
                    src="/assets/reply.svg"
                    alt="Reply"
                    width={24}
                    height={24}
                  />
                </Link>
                <Image
                  className="cursor-pointer object-contain"
                  src="/assets/repost.svg"
                  alt="Repost"
                  width={24}
                  height={24}
                />
                <Image
                  className="cursor-pointer object-contain"
                  src="/assets/share.svg"
                  alt="Share"
                  width={24}
                  height={24}
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`thread/${id}`}>
                  <p className="mt-10 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>
      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}
      {!isComment && community && (
        <Link
          className="mt-5 flex items-center"
          href={`/communities/${community.id}`}
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>
          <Image
            className="ml-1 rounded-full object-cover"
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
