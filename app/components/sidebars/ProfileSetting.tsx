"use client";
// potential error
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "../inputs/Input";
import {
  Avatar as AvatarShadcn,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";
import { Separator } from "@/components/ui/separator";

interface Props {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSetting = ({ currentUser, isOpen, onClose }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  // the following will watch the image
  const image = watch("image");

  const handleUpload = (result: FieldValues) => {
    setValue("image", result?.info?.secure_url, { shouldValidate: true });
  };

  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  const getInitials = () => {
    if (!currentUser.name) {
      return "";
    }
    const [firstName, lastName] = currentUser.name.split(" ");
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      {/* <DialogTrigger></DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
              <p>Edit your public information</p>
              <div className="mt-10 flex flex-col gap-y-8 mb-10">
                <Input
                  disabled={isLoading}
                  label="Name"
                  id="name"
                  errors={errors}
                  required
                  register={register}
                />
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <AvatarShadcn>
                      <AvatarImage
                        src={
                          image ||
                          currentUser?.image ||
                          "/images/placeholder.jpg"
                        }
                        height={48}
                        width={48}
                      />
                      <AvatarFallback className="select-none font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </AvatarShadcn>

                    <CldUploadButton
                      options={{ maxFiles: 1 }}
                      uploadPreset="sjc4vrlv"
                      onUploadAdded={handleUpload}
                    >
                      <Button disabled={isLoading} secondary type="button">
                        Change
                      </Button>
                    </CldUploadButton>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="mt-10 flex justify-end items-center gap-x-6 ">
                <Button
                  secondary
                  disabled={isLoading}
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Save
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetting;
