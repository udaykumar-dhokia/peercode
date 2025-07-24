import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
const Footer = () => {
  const links = [
    { name: "Home", to: "/" },
    { name: "Explore", to: "/" },
    { name: "Challenges", to: "/" },
    { name: "Learn More", to: "/" },
  ];
  return (
    <>
      <div className="border rounded-lg p-4 shadow-md overflow-hidden bg-white">
        <div className="flex flex-col justify-center items-center">
          <div className="links">
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
          </div>
          <div className="logo">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 50 }}
              className="uppercase font-bold text-9xl bg-gradient-to-b from-black to-white bg-clip-text text-transparent"
            >
              Peer
              <span className="bg-gradient-to-b from-second to-white bg-clip-text text-transparent">
                Code
              </span>
            </motion.h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
