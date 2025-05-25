"use client";

import { MotionAnimation } from "@/motionsHoc/MotionAnimation";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const CTASection = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 mt-8 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-24 h-24 bg-cyan-400/30 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/30 rounded-full blur-lg animate-bounce"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Hexagon pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="w-full h-full"
        >
          <defs>
            <pattern
              id="hexagons"
              x="0"
              y="0"
              width="20"
              height="17.32"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="10,1 18.66,6 18.66,15 10,20 1.34,15 1.34,6"
                fill="none"
                stroke="rgba(147, 51, 234, 0.5)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <MotionAnimation>
          <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-purple-200">
              Blockchain Native
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
            Enter the Future of
            <br />
            <span className="relative">
              Decentralized Quests
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transform scale-x-0 animate-[scale-x_2s_ease-in-out_infinite_alternate]"></div>
            </span>
          </h2>
        </MotionAnimation>

        <MotionAnimation delay={0.4} animation="slide-up">
          <p className="text-xl max-w-4xl mx-auto mb-8 text-gray-300 leading-relaxed">
            Build your{" "}
            <span className="text-purple-300 font-semibold">
              on-chain identity
            </span>
            , earn{" "}
            <span className="text-cyan-300 font-semibold">
              verifiable credentials
            </span>
            , and unlock exclusive opportunities in the decentralized ecosystem.
          </p>
        </MotionAnimation>

        <MotionAnimation delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link href="/quests">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] hover:from-purple-500 hover:to-cyan-500 text-white border-0 rounded-2xl px-10 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Launch Quests
                  <div className="w-0 group-hover:w-6 transition-all duration-300 overflow-hidden">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Button>
            </Link>

            <Link href="/sponsor">
              <Button
                size="lg"
                variant="outline"
                className="group relative bg-transparent text-white border-2 border-purple-400/50 hover:border-purple-300 hover:text-white rounded-2xl px-10 py-4 text-lg font-semibold transition-all duration-300 hover:bg-purple-500/10 backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  Become Sponsor
                  <div className="w-0 group-hover:w-6 transition-all duration-300 overflow-hidden">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </span>
              </Button>
            </Link>
          </div>
        </MotionAnimation>
      </div>
    </section>
  );
};

export default CTASection;
