import { Label } from "@radix-ui/react-label";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import SocialAuthOptions from "../../components/custom/social-auth-options/SocialAuthOptions";
import { useState } from "react";

export const Route = createFileRoute("/_public/_layout/register")({
  component: Register,
});

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-[50%] space-y-4 border p-8 rounded-lg bg-white shadow-md"
        >
          <h1 className="text-xl font-bold text-center mb-8">
            Create a new account
          </h1>
          <SocialAuthOptions />
          <Label>Full Name</Label>
          <Input
            className="rounded-xl"
            placeholder="John De"
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
          <Label>Email</Label>
          <Input
            className="rounded-xl"
            placeholder="john@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Label>Password</Label>
          <Input
            className="rounded-xl"
            placeholder="********"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Link to="/" className="" disabled={!email || !password || !fullName}>
            <Button
              className="w-full hover:cursor-pointer rounded-xl bg-black/90 inset-shadow-sm inset-shadow-white/60"
              disabled={!email || !password || !fullName}
            >
              Get Started
            </Button>
          </Link>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-second">
              Login Now
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
