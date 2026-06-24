// component.tsx
import * as React from "react";
import { Link as LinkIcon, ExternalLink, GitFork, ChevronDown, Leaf, type LucideIcon } from "lucide-react";

interface GlassCardLink {
  icon: LucideIcon;
  href: string;
  label?: string;
}

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  links?: GlassCardLink[];
  viewMoreHref?: string;
  viewMoreLabel?: string;
  tags?: string[];
  badge?: string;
}

const defaultLinks: GlassCardLink[] = [
  { icon: GitFork, href: "#", label: "GitHub" },
  { icon: LinkIcon, href: "#", label: "Website" },
  { icon: ExternalLink, href: "#", label: "External" },
];

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      title = "Untitled",
      description = "A piece of writing in code.",
      links = defaultLinks,
      viewMoreHref = "#",
      viewMoreLabel = "View more",
      tags,
      badge,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`group h-[320px] w-[300px] [perspective:1000px] ${className ?? ""}`}
        {...props}
      >
        <div className="relative h-full rounded-[40px] bg-gradient-to-br from-[#3a2f1f] via-[#2a2419] to-[#1a1610] shadow-[0_30px_60px_-30px_rgba(58,40,18,0.55)] transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(58,40,18,0.35)_30px_50px_25px_-40px,rgba(58,40,18,0.18)_0px_25px_30px_0px] group-hover:[transform:rotate3d(1,1,0,30deg)]">
          {/* Parchment inset */}
          <div
            className="absolute inset-2 rounded-[45px] border-b border-l border-[#b88a3f]/30 [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"
            style={{
              background:
                "linear-gradient(180deg, rgba(239,230,210,0.96), rgba(230,218,192,0.92))",
            }}
          />

          {/* Copy */}
          <div className="absolute right-0 left-0 [transform:translate3d(0,0,26px)]">
            <div className="px-7 pt-[60px] pb-0">
              {badge && (
                <span
                  className="mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest"
                  style={{
                    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                    color: '#7a4a18',
                    background: 'rgba(184,138,63,0.18)',
                    border: '1px solid rgba(184,138,63,0.45)',
                  }}
                >
                  ★ {badge}
                </span>
              )}
              <span
                className="block text-2xl italic font-medium leading-tight"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  color: '#2a2419',
                }}
              >
                {title}
              </span>
              <span
                className="mt-3 block text-[13px] leading-snug"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  color: '#4a3f2e',
                  fontStyle: 'italic',
                }}
              >
                {description}
              </span>
              {tags && tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider"
                      style={{
                        fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                        color: '#4a5a3a',
                        background: 'rgba(74,90,58,0.10)',
                        border: '1px solid rgba(74,90,58,0.30)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer row */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between [transform-style:preserve-3d] [transform:translate3d(0,0,26px)]">
            <div className="flex gap-2.5 [transform-style:preserve-3d]">
              {links.map(({ icon: Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group/social grid h-[30px] w-[30px] place-content-center rounded-full border-none shadow-[rgba(58,40,18,0.35)_0px_7px_5px_-5px] transition-all duration-200 ease-in-out group-hover:[box-shadow:rgba(58,40,18,0.25)_-5px_20px_10px_0px] group-hover:[transform:translate3d(0,0,50px)]"
                  style={{
                    backgroundColor: '#efe6d2',
                    transitionDelay: `${400 + index * 200}ms`,
                  }}
                >
                  <Icon className="h-4 w-4 stroke-[#2a2419] transition-colors group-hover/social:stroke-[#9a1f2b]" />
                </a>
              ))}
            </div>
            <a
              href={viewMoreHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-2/5 cursor-pointer items-center justify-end transition-all duration-200 ease-in-out hover:[transform:translate3d(0,0,10px)]"
            >
              <span
                className="border-none bg-none text-xs italic"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  color: '#efe6d2',
                }}
              >
                {viewMoreLabel}
              </span>
              <ChevronDown className="h-4 w-4 stroke-[#efe6d2]" strokeWidth={2} />
            </a>
          </div>

          {/* Stacked leaves in corner */}
          <div className="absolute top-0 right-0 [transform-style:preserve-3d]">
            {[
              { size: "170px", pos: "8px", z: "20px", delay: "0s", opacity: 0.10 },
              { size: "140px", pos: "10px", z: "40px", delay: "0.4s", opacity: 0.14 },
              { size: "110px", pos: "17px", z: "60px", delay: "0.8s", opacity: 0.18 },
              { size: "80px", pos: "23px", z: "80px", delay: "1.2s", opacity: 0.22 },
            ].map((circle, index) => (
              <div
                key={index}
                className="absolute aspect-square rounded-full shadow-[rgba(58,40,18,0.18)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out"
                style={{
                  width: circle.size,
                  top: circle.pos,
                  right: circle.pos,
                  transform: `translate3d(0, 0, ${circle.z})`,
                  transitionDelay: circle.delay,
                  background: `rgba(184,138,63,${circle.opacity})`,
                }}
              />
            ))}
            <div
              className="absolute grid aspect-square w-[50px] place-content-center rounded-full shadow-[rgba(58,40,18,0.25)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out [transform:translate3d(0,0,100px)] [transition-delay:1.6s] group-hover:[transform:translate3d(0,0,120px)]"
              style={{ top: "30px", right: "30px", backgroundColor: '#efe6d2' }}
            >
              <Leaf className="w-5 h-5 stroke-[#4a5a3a]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
