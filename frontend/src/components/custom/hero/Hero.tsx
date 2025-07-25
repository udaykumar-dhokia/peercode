import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import demo from "/demo.png";
const Hero = () => {
  return (
    <>
      <div className="">
        <div className="text-center min-h-[100vh] flex flex-col justify-center gap-6">
          <motion.h1
            initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
            }}
            className="font-bold text-6xl"
          >
            Level Up Your Coding Skills with{" "}
            <span className="text-second"> 1-to-1</span> Challenges
          </motion.h1>

          <motion.p
            initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
            }}
            className="text-md text-neutral-600"
          >
            Personalized, Real-Time Coding Battles Designed to Make You Think
            Faster and Code Smarter.
          </motion.p>

          <div className="flex gap-2 justify-center">
            <motion.div
              initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.7,
              }}
              className=""
            >
              <Link to={"/login"}>
                <Button
                  className="hover:cursor-pointer rounded-xl bg-white/90 inset-shadow-sm inset-shadow-white/60"
                  variant={"outline"}
                >
                  Start a Challenge
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.75,
              }}
              className=""
            >
              <Link to={"/register"}>
                <Button className="hover:cursor-pointer rounded-xl bg-black/90 inset-shadow-sm inset-shadow-white/60">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
            }}
            whileHover={{ scale: 1.01 }}
            className="p-2 mt-6 bg-neutral-200 rounded-2xl shadow-lg"
          >
            <img src={demo} alt="" className="rounded-lg" />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Hero;
