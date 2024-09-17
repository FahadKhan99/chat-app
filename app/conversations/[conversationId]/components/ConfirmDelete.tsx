"use client";

import { useState, useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/app/components/Button";
import useConversation from "@/app/hooks/useConversation";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { IoTrash } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmDelete = () => {
  const { conversationId } = useConversation();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        router.push("/conversations");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something went wrong while deleting conversation")
      );
    setIsLoading(false);
  }, [conversationId, router]);

  return (
    <div>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger>
          <div
            onClick={() => setIsDeleteOpen(true)}
            className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center"
          >
            <IoTrash size={20} />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex gap-1 items-center">
                <div className="mx-auto flex justify-center items-center h-12 w-12 flex-shrink-0 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FiAlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  Delete conversation?
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              <div className="ml-14">
                Are you sure you want to delete this conversation? This action
                cannot be undone.
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button danger disabled={isLoading} onClick={onDelete}>
                  Delete
                </Button>
                <Button
                  secondary
                  disabled={isLoading}
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfirmDelete;
