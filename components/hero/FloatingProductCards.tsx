"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  position: { x: number; y: number; z: number };
}

export default function FloatingProductCards() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Featured products for the floating cards with HyperLiquid brand colors
  const products: Product[] = [
    {
      id: "1",
      name: "HyperLiquid Classic Tee",
      image: "https://via.placeholder.com/300x300/97fce4/0f3933?text=HYPE+TEE",
      position: { x: -300, y: -200, z: 100 }
    },
    {
      id: "2", 
      name: "HYPE Ceramic Mug",
      image: "https://via.placeholder.com/300x300/33998c/dbfbf6?text=HYPE+MUG",
      position: { x: 400, y: -150, z: 80 }
    },
    {
      id: "3",
      name: "Classic Logo Cap",
      image: "https://via.placeholder.com/300x300/b0c5c1/072723?text=HYPE+CAP", 
      position: { x: -250, y: 300, z: 120 }
    },
    {
      id: "4",
      name: "Premium Hoodie",
      image: "https://via.placeholder.com/300x300/0f3933/97fce4?text=HOODIE",
      position: { x: 350, y: 250, z: 90 }
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x: x * 50, y: y * 50 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="absolute pointer-events-auto"
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotateX: -90,
            rotateY: 0,
            z: product.position.z
          }}
          animate={{
            opacity: [0, 1, 1],
            scale: [0, 1.2, 1],
            rotateX: [90, 0, 0],
            rotateY: [0, 360],
            x: product.position.x + mousePosition.x * 0.1,
            y: product.position.y + mousePosition.y * 0.1,
          }}
          transition={{
            opacity: { duration: 0.8, delay: 1 + index * 0.2 },
            scale: { duration: 1, delay: 1 + index * 0.2 },
            rotateX: { duration: 1, delay: 1 + index * 0.2 },
            rotateY: { 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear",
              delay: index * 2 
            },
            x: { duration: 2, ease: "easeOut" },
            y: { duration: 2, ease: "easeOut" },
          }}
          style={{
            left: "50%",
            top: "50%",
            transform: `perspective(1000px)`,
          }}
          whileHover={{
            scale: 1.1,
            rotateY: 0,
            z: product.position.z + 50,
            transition: { duration: 0.3 }
          }}
        >
          <motion.div
            className="relative group cursor-pointer"
            whileHover={{
              y: -10,
              transition: { duration: 0.2 }
            }}
          >
            {/* Card container with glassmorphism */}
            <div
              className="
                w-32 h-32 md:w-40 md:h-40 rounded-xl
                backdrop-blur-sm bg-white/10 border border-white/20
                shadow-2xl overflow-hidden
                group-hover:bg-white/20 transition-all duration-300
              "
              style={{
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
              }}
            >
              {/* Product image */}
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl" />
              </div>
              
              {/* Product name overlay */}
              <motion.div
                className="
                  absolute bottom-0 left-0 right-0 p-2
                  bg-gradient-to-t from-black/70 to-transparent
                  rounded-b-xl
                "
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-white text-xs font-medium text-center truncate">
                  {product.name}
                </p>
              </motion.div>
            </div>
            
            {/* Floating glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `
                  radial-gradient(circle at center, 
                    rgba(151, 252, 228, 0.4) 0%, 
                    transparent 70%
                  )
                `,
                filter: "blur(20px)",
                transform: "translateZ(-10px)",
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}