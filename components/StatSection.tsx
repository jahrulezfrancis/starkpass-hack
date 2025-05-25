"use client";

import { MotionAnimation } from "@/motionsHoc/MotionAnimation";
import { useEffect, useRef, useState } from "react";

// Hook to animate numbers from 0 to `end`
const useCountUp = (
  end: number,
  duration = 2000,
  delay = 0,
  trigger = false
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let timeoutId: NodeJS.Timeout;
    let animationId: number;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * end);
      setCount(current);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    timeoutId = setTimeout(() => {
      animate();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [end, duration, delay, trigger]);

  return count;
};

// Stat Box 3D
const StatBox3D = ({
  stat,
  index,
}: {
  stat: { label: string; value: string };
  index: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ""));
  const suffix = stat.value.replace(/[0-9,]/g, "");
  const countedValue = useCountUp(numericValue, 2500, index * 200, isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const loadThreeJS = () => {
      if (typeof window === "undefined") return;

      const existingScript = document.querySelector(
        'script[src*="three.min.js"]'
      );
      if (existingScript) {
        setupThreeScene();
        return;
      }

      const threeScript = document.createElement("script");
      threeScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      threeScript.onload = () => setupThreeScene();
      document.head.appendChild(threeScript);
    };

    const setupThreeScene = () => {
      if (!containerRef.current || !window.THREE) return;

      const container = containerRef.current.querySelector(
        ".three-canvas-container"
      ) as HTMLElement;
      if (!container) return;

      const scene = new window.THREE.Scene();
      const camera = new window.THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const renderer = new window.THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(120, 80);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const geometry = new window.THREE.BoxGeometry(1.5, 1, 1);
      const edges = new window.THREE.EdgesGeometry(geometry);
      const material = new window.THREE.LineBasicMaterial({
        color: getBoxColor(index),
        transparent: true,
        opacity: 0.8,
      });

      const wireframe = new window.THREE.LineSegments(edges, material);
      scene.add(wireframe);

      camera.position.set(2, 1.5, 3);
      camera.lookAt(0, 0, 0);

      let startTime = Date.now();

      const animate = () => {
        requestAnimationFrame(animate);

        const elapsed = (Date.now() - startTime) * 0.001;

        wireframe.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
        wireframe.rotation.y = elapsed * 0.3;
        wireframe.rotation.z = Math.cos(elapsed * 0.3) * 0.1;
        wireframe.position.y = Math.sin(elapsed * 2) * 0.1;

        renderer.render(scene, camera);
      };

      animate();
    };

    loadThreeJS();

    return () => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (canvas) canvas.remove();
    };
  }, [isVisible, index]);

  const getBoxColor = (index: number) => {
    const colors = [0x667eea, 0x764ba2, 0xf093fb, 0x4facfe];
    return colors[index % colors.length];
  };

  return (
    <div ref={containerRef} className="stat-box-container">
      <MotionAnimation delay={0.2 * index} animation="slide-up">
        <div className="stat-box-3d">
          <div className="three-canvas-container" />
          <div className="stat-content">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">
              {countedValue.toLocaleString()}
              {suffix}
            </p>
          </div>
          <div className="stat-glow"></div>
        </div>
      </MotionAnimation>
    </div>
  );
};

// Section Wrapper
export const StatSection = () => {
  const stats = [
    { label: "Total Users", value: "5,000+" },
    { label: "Quests Completed", value: "12,500+" },
    { label: "Credentials Issued", value: "8,200+" },
    { label: "Active Sponsors", value: "120+" },
  ];

  return (
    <section className="stat-section">
      <div className="section-title">
        <MotionAnimation animation="slide-down">
          <h2>Platform Statistics</h2>
          <p>Our Mtrics showcasing our growing community and engagement</p>
        </MotionAnimation>
      </div>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatBox3D key={index} stat={stat} index={index} />
        ))}
      </div>
    </section>
  );
};
