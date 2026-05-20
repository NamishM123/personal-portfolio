"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveTravelCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  actionText: string;
  href: string;
  onActionClick?: () => void;
  className?: string;
  tags?: string[];
  badge?: string;
  index?: number;
  scrollProgress?: MotionValue<number>;
}

export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(
  (
    {
      title,
      subtitle,
      actionText,
      href,
      onActionClick,
      className,
      tags,
      badge,
      index,
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const { scrollYProgress } = useScroll({
      target: innerRef,
      offset: ["start end", "end start"],
    });

    const smooth = useSpring(scrollYProgress, {
      stiffness: 90,
      damping: 22,
      mass: 0.4,
    });

    const rotateY = useTransform(smooth, [0, 0.5, 1], [55, 0, -55]);
    const rotateX = useTransform(smooth, [0, 0.5, 1], [18, 0, -10]);
    const scrollScale = useTransform(smooth, [0, 0.5, 1], [0.78, 1, 0.85]);
    const scrollOpacity = useTransform(smooth, [0, 0.25, 0.75, 1], [0, 1, 1, 0.35]);
    const yShift = useTransform(smooth, [0, 0.5, 1], [80, 0, -40]);
    const glowOpacity = useTransform(smooth, [0, 0.5, 1], [0, 0.55, 0.1]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 18, stiffness: 200 };
    const tiltX = useSpring(mouseX, springConfig);
    const tiltY = useSpring(mouseY, springConfig);
    const hoverRotateX = useTransform(tiltY, [-0.5, 0.5], ["8deg", "-8deg"]);
    const hoverRotateY = useTransform(tiltX, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const indexLabel =
      typeof index === "number" ? String(index + 1).padStart(2, "0") : null;

    return (
      <motion.div
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateY,
          rotateX,
          scale: scrollScale,
          opacity: scrollOpacity,
          y: yShift,
          transformStyle: "preserve-3d",
          transformPerspective: 1400,
        }}
        className={cn("relative h-[26rem] w-full", className)}
      >
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),rgba(168,85,247,0.18)_40%,transparent_70%)] blur-2xl"
        />

        <motion.div
          style={{
            rotateX: hoverRotateX,
            rotateY: hoverRotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative h-full w-full rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_40%,rgba(99,102,241,0.06)_70%,transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-px rounded-[calc(1rem-1px)] [mask:linear-gradient(black,transparent_60%)] bg-gradient-to-b from-white/5 to-transparent"
          />

          <div
            style={{ transform: "translateZ(60px)" }}
            className="relative grid h-full grid-rows-[auto_1fr_auto] p-6 text-white"
          >
            <div className="flex items-start justify-between">
              {indexLabel && (
                <span className="font-mono text-xs tracking-[0.3em] text-white/40">
                  {indexLabel} /
                </span>
              )}
              <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: "3deg" }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Visit ${title}`}
                style={{ transform: "translateZ(40px)" }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/15"
              >
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </div>

            <div className="flex flex-col justify-center">
              {badge && (
                <span
                  style={{ transform: "translateZ(45px)" }}
                  className="mb-3 inline-block w-fit rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-yellow-300 backdrop-blur-sm"
                >
                  ★ {badge}
                </span>
              )}
              <h2
                style={{ transform: "translateZ(55px)" }}
                className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-4xl"
              >
                {title}
              </h2>
              <p
                style={{ transform: "translateZ(40px)" }}
                className="mt-3 max-w-[90%] text-sm text-white/55"
              >
                {subtitle}
              </p>
            </div>

            <div
              style={{ transform: "translateZ(35px)" }}
              className="flex flex-col gap-4"
            >
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <motion.button
                onClick={onActionClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group/btn flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-left text-sm font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-white/10"
              >
                <span>{actionText}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);
InteractiveTravelCard.displayName = "InteractiveTravelCard";
