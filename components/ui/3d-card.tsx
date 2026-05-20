"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveTravelCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  actionText: string;
  href: string;
  onActionClick?: () => void;
  className?: string;
  tags?: string[];
  badge?: string;
  revealed?: boolean;
  revealDelay?: number;
}

export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(
  (
    {
      title,
      subtitle,
      imageUrl,
      actionText,
      href,
      onActionClick,
      className,
      tags,
      badge,
      revealed,
      revealDelay = 0,
    },
    ref
  ) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], ["10.5deg", "-10.5deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-10.5deg", "10.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const { width, height, left, top } = rect;
      mouseX.set((e.clientX - left) / width - 0.5);
      mouseY.set((e.clientY - top) / height - 0.5);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "relative h-[26rem] w-full rounded-2xl bg-transparent shadow-2xl border border-neutral-800",
          className
        )}
      >
        <div
          style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
          className="absolute inset-3 grid h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] grid-rows-[1fr_auto] rounded-xl shadow-lg"
        >
          {/* Background Image */}
          <img
            src={imageUrl}
            alt={`${title} — ${subtitle}`}
            className="absolute inset-0 h-full w-full rounded-xl object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-b from-black/30 via-transparent to-black/80" />

          {/* Content */}
          <div className="relative flex flex-col justify-between rounded-xl p-5 text-white h-full">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {badge && (
                  <motion.span
                    style={{ transform: "translateZ(60px)" }}
                    className="inline-block mb-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 backdrop-blur-sm"
                  >
                    🏆 {badge}
                  </motion.span>
                )}
                <motion.h2
                  style={{
                    transform: "translateZ(50px)",
                    ...(revealed ? { animationDelay: `${revealDelay}s` } : {}),
                  }}
                  className={cn(
                    "text-2xl font-bold leading-tight",
                    revealed && "glitch-in"
                  )}
                >
                  {title}
                </motion.h2>
                <motion.p
                  style={{ transform: "translateZ(40px)" }}
                  className="text-sm font-light text-white/70 mt-0.5"
                >
                  {subtitle}
                </motion.p>
              </div>
              <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: "2.5deg" }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Visit ${title}`}
                style={{ transform: "translateZ(70px)" }}
                className="ml-3 shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-inset ring-white/30 hover:bg-white/30 transition-colors"
              >
                <ArrowUpRight className="h-5 w-5 text-white" />
              </motion.a>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <motion.div
                style={{ transform: "translateZ(45px)" }}
                className="flex flex-wrap gap-1.5 mt-3"
              >
                {tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-xs bg-black/30 text-white/70 backdrop-blur-sm border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Action button */}
            <motion.button
              onClick={onActionClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{ transform: "translateZ(55px)" }}
              className="mt-4 w-full rounded-lg py-3 text-center font-semibold text-white bg-white/10 backdrop-blur-md ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-colors"
            >
              {actionText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
);
InteractiveTravelCard.displayName = "InteractiveTravelCard";
