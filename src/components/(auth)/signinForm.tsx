"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
 
function SignInForm() {
  return (
    <Button
      onClick={() => signIn()} 
      variant={"outline"}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Sign In
    </Button>
  );
}

export default SignInForm