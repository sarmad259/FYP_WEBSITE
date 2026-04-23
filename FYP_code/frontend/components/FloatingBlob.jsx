import { motion } from "framer-motion";

const FloatingBlob = () => {
  return (
    <motion.img
      src="/blob.avif"
      alt="blob"
      className="pointer-events-none select-none"
      style={{
        position: "absolute",
        right: "-200px",
        top: "-250px",
        width: "550px",        
      }}
      animate={{
        y: [0, -40, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default FloatingBlob;