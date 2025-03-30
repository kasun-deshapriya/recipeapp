import axios from "axios";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function Logout() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  async function Userlogout() {
    try {
      const response = await axios.post(`${api_url}/logout-user`, {
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        toast("LogOut Sucess", {
          description: "User Logout sucessfull",
          action: {
            label: "Done",
            onClick: () => console.log("Done"),
          },
        });
        router.push("login");
      } else {
        throw new Error("Failed to Logout");
      }
    } catch (error) {
      console.error("Error Logout User:", error);
      toast("Failed to Logout User", {
        description: "Something went wrong!",
        action: {
          label: "Retry",
          onClick: () => Userlogout(),
        },
      });
    }
  }

  return (
    <div>
      <LogIn
        className="h-6 w-6 text-gray-500 cursor-pointer hover:text-red-500"
        onClick={Userlogout}
      />
    </div>
  );
}

export default Logout;
