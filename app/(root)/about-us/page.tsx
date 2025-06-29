"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

export default function AboutUs() {
  return (
    <div className="bg-dark font-inter text-white">
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-20 text-center"
        >
          <h1 className="from-cream to-secondary mb-4 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
            About HyperWear
          </h1>
          <p className="text-accent mx-auto max-w-2xl text-lg md:text-xl">
            Two friends, one order book, and a whole lot of gratitude.
          </p>
        </motion.div>

        {/* Story Section 1 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-24 grid items-center gap-12 md:grid-cols-2"
        >
          <div className="prose prose-invert text-accent max-w-none text-lg">
            <h2 className="text-cream mb-4 text-3xl font-bold">
              Day Traders & Night Apes
            </h2>
            <p>
              We&apos;re two lifelong friends from France whose days begin and
              end on the HyperLiquid order book—aping into new pairs with
              breakfast, debating funding rates over dinner. We&apos;ve been
              here since <strong className="text-secondary">block 0</strong>,
              and we&apos;ve loved every second of the ride.
            </p>
            <p>
              From the moment HyperLiquid launched, it clicked with us. The
              community, the tech, the vibe—it all felt different. We
              weren&apos;t just early adopters; we were all-in.
            </p>
          </div>
          <div>
            <Image
              src="/two-purr-traders.png"
              alt="Two Purr Traders"
              width={400}
              height={400}
              className="shadow-emerald/20 rounded-3xl shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Story Section 2 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-24 grid items-center gap-12 md:grid-cols-2"
        >
          <div className="flex flex-col justify-center md:order-2">
            <div className="prose prose-invert text-accent max-w-none text-lg">
              <h2 className="text-cream mb-4 text-3xl font-bold">
                The Airdrop That Changed Everything
              </h2>
              <p>
                When the HyperLiquid airdrop hit, it didn&apos;t just pad our
                wallets—it rewired our outlook. We asked ourselves:{" "}
                <em className="text-light">
                  How do we give this value back instead of just cashing out?
                </em>{" "}
                <strong className="text-secondary">
                  HyperWear is our answer.
                </strong>
              </p>
              <p>
                We&apos;re turning gratitude into gear and pledging{" "}
                <strong className="text-secondary">
                  to buy HYPE tokens as much as possible.
                </strong>
                —no personal payouts, no side pockets, just a clean loop of
                value from cotton to chain.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-20 md:order-1">
            <Image
              src="/purr-lying-happy.png"
              alt="Purr Lying Happy"
              width={200}
              height={200}
              className="shadow-emerald/20 rounded-full shadow-2xl"
            />
            <Image
              src="/purr-lying-happy.png"
              alt="Purr Lying Happy"
              width={200}
              height={200}
              className="shadow-emerald/20 rounded-full shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mx-auto mb-24 max-w-3xl text-center"
        >
          <Image
            src="/purr-logo.jpg"
            alt="Purr Logo"
            width={200}
            height={200}
            className="mx-auto mb-8 rounded-full shadow-lg"
          />
          <h2 className="text-cream mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="text-accent text-lg">
            In short: two early traders, forever grateful, spinning a
            life-changing airdrop into real-world merch and fresh on-chain fuel
            for the token that started it all.
          </p>
          <p className="text-secondary mt-8 text-2xl italic">
            HyperLiquid, thank you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
