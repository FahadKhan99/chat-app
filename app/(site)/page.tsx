import AuthForm from "./components/AuthForm";
import { RiChatSmile3Line } from "react-icons/ri";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-gray-100 items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <RiChatSmile3Line size={100} className="mx-auto w-auto text-sky-500" />
        <h1 className="text-3xl font-bold text-center text-gray-900 mt-6 tracking-tight">
          Sign in to your Account
        </h1>
      </div>
      <AuthForm />
    </div>
  );
}
