import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "../../ui/button";

const PublicHeader = () => {
  const links = [
    { name: "Home", to: "/" },
    { name: "Explore", to: "/" },
    { name: "Challenges", to: "/" },
    { name: "Learn More", to: "/" },
  ];
  return (
    <>
      <motion.nav
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="flex justify-between items-center p-4 relative"
      >
        <div className="logo text-2xl font-bold">
          <Link to="/">
            Peer<span className="text-second">Code</span>
          </Link>
        </div>
        <motion.div className="nav-link space-x-4 flex">
          {links.map((elem, idx) => {
            return (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{
                  duration: 0.5,
                }}
                className="p-1 rounded-lg"
              >
                <Link to={elem.to} key={idx}>
                  {elem.name}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        <div className="auth-options flex gap-2">
          <Link to={"/login"}>
            <Button
              className="hover:cursor-pointer rounded-xl bg-white/90 inset-shadow-sm inset-shadow-white/60"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
          <Link to={"/register"}>
            <Button className="hover:cursor-pointer rounded-xl bg-black/90 inset-shadow-sm inset-shadow-white/60">
              Get Started
            </Button>
          </Link>
        </div>
      </motion.nav>
    </>
  );
};

export default PublicHeader;
