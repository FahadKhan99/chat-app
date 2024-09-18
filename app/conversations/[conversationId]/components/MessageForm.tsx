"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { VscAdd } from "react-icons/vsc";
import MessageInput from "./MessageInput";
import { BiSolidSend } from "react-icons/bi";
import { CldUploadButton } from "next-cloudinary";

interface CloudinaryResult {
  secure_url?: string;
  info?:
    | string
    | {
        secure_url?: string;
      };
}

const MessageForm = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true }); // this re-renders, clearing the message field
    axios.post("/api/messages", { ...data, conversationId });
  };

  // const handleUpload = (result: CloudinaryResult) => {
  //   const secureUrl = typeof result.info === 'string' ? result.info : result.info?.secure_url;

  //   axios.post("/api/messages", {
  //     image: secureUrl,
  //     conversationId,
  //   });
  // };

  const handleUpload = (result: CloudinaryResult) => {
    // Check if secure_url is directly available or within the info object
    const secureUrl =
      result.secure_url ||
      (typeof result.info === "string" ? result.info : result.info?.secure_url);

    if (!secureUrl) {
      return;
    }

    axios.post("/api/messages", {
      image: secureUrl,
      conversationId,
    });
  };

  return (
    <div className="py-4 px-4 bg-white flex items-center w-full border-t gap-2 lg:gap-4">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset="sjc4vrlv"
        onSuccess={handleUpload}
      >
        <VscAdd size={23} className="text-sky-500 hover:text-sky-600" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          placeholder="Write a Message"
          required
        />

        {/* <PiLineVerticalThin size={34} /> */}
        <button
          type="submit"
          className="rounded-full p-2 text-sky-500 hover:text-sky-600 transition cursor-pointer"
        >
          <BiSolidSend size={25} />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
