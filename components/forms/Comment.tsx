"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { CommentValidation } from "@/lib/validations/thread";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname,
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  className="rounded-full object-cover"
                  src={currentUserImg}
                  alt="Profile Image"
                  width={48}
                  height={48}
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  className="no-focus text-light-1 outline-none"
                  type="text"
                  placeholder="Comment..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="comment-form_btn" type="submit">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
