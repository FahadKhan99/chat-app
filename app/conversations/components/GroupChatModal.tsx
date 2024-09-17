"use client";

import { User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Button from "@/app/components/Button";
import { Separator } from "@/components/ui/separator";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}
const GroupChatModal = ({ isOpen, onClose, users }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger></DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a group chat</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            Create a chat with more than 2 people
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                label="Name"
                register={register}
                errors={errors}
                id="name"
                disabled={isLoading}
                required
              />
              <Select
                users={users}
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue("members", value, { shouldValidate: true })
                }
                value={members}
              />
            </div>
            <Separator />
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                disabled={isLoading}
                onClick={onClose}
                secondary
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Create
              </Button>
            </div>
          </form>
        </DialogHeader>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
