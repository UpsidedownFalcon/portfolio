import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface MouseState {
  x: number;
  y: number;
  active: boolean;
}

export const ConstellationBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, active: false });
  const gridRef = useRef<Map<string, number[]>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ==========================================================
    //                    TUNABLE PARAMETERS
    // ==========================================================

    // Density controls how many nodes appear:
    // nodeCount ~ (screenArea / NODE_DENSITY_DIVISOR), capped by MAX_NODES.
    const NODE_DENSITY_DIVISOR = 15000;
    const MAX_NODES = 100;

    // Base autonomous drift speed (never decays below this)
    const BASE_SPEED = 0.18;

    // Initial random speed multiplier (gives them different directions)
    // vx, vy initialized in range ~ [-INITIAL_SPEED/2, +INITIAL_SPEED/2]
    const INITIAL_SPEED = 0.9;

    // Safety clamp: maximum speed a node can ever reach (prevents missiles)
    const MAX_SPEED = 2.5;

    // Connections
    const CONNECTION_DISTANCE = 150; // pixels
    const CONNECTION_OPACITY = 0.3; // max opacity for closest lines
    const LINE_WIDTH = 0.5;

    // Mouse interaction
    const MOUSE_EFFECT_RADIUS = 180; // pixels
    const MOUSE_SPEED_BOOST = 1.1; // 1.0 = no boost, 2.0 = strong boost
    const MOUSE_REPEL_STRENGTH = 0.3; // push away strength
    const BOOST_DAMPING = 0.9; // slows boosted nodes back toward baseline

    // Visuals
    const NODE_ALPHA = 0.6; // base star brightness
    const GLOW_RADIUS_MULTIPLIER = 3;
    const GLOW_ALPHA = 0.3;

    // Performance
    const MAX_DPR = 2; // clamp devicePixelRatio to avoid heavy rendering
    const USE_GLOW = true; // glow costs a bit; turn off for max performance

    // ==========================================================

    const CELL_SIZE = CONNECTION_DISTANCE; // spatial hash grid size

    let width = 0;
    let height = 0;

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const dist2 = (ax: number, ay: number, bx: number, by: number) => {
      const dx = ax - bx;
      const dy = ay - by;
      return dx * dx + dy * dy;
    };

    const getDpr = () => Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const resizeCanvas = () => {
      const dpr = getDpr();
      width = window.innerWidth;
      height = window.innerHeight;

      // CSS size for layout
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Actual pixel size for sharpness
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      // Draw using CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = () => {
      const nodeCount = Math.floor((width * height) / NODE_DENSITY_DIVISOR);
      const count = Math.min(nodeCount, MAX_NODES);

      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * INITIAL_SPEED,
        vy: (Math.random() - 0.5) * INITIAL_SPEED,
        radius: Math.random() * 1.5 + 0.5,
      }));

      // Ensure no one starts basically stationary
      for (const n of nodesRef.current) {
        const s = Math.hypot(n.vx, n.vy);
        if (s < BASE_SPEED) {
          const a = Math.random() * Math.PI * 2;
          n.vx = Math.cos(a) * BASE_SPEED;
          n.vy = Math.sin(a) * BASE_SPEED;
        }
      }
    };

    const buildGrid = () => {
      const grid = gridRef.current;
      grid.clear();

      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const cx = Math.floor(n.x / CELL_SIZE);
        const cy = Math.floor(n.y / CELL_SIZE);
        const key = `${cx},${cy}`;

        const bucket = grid.get(key);
        if (bucket) bucket.push(i);
        else grid.set(key, [i]);
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const grid = gridRef.current;
      const mouse = mouseRef.current;

      const connectionDist2 = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
      const mouseRadius2 = MOUSE_EFFECT_RADIUS * MOUSE_EFFECT_RADIUS;

      buildGrid();

      // -----------------------------
      // Draw connections (optimized)
      // -----------------------------
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const cellX = Math.floor(a.x / CELL_SIZE);
        const cellY = Math.floor(a.y / CELL_SIZE);

        // check same + adjacent cells (9 total)
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const key = `${cellX + ox},${cellY + oy}`;
            const bucket = grid.get(key);
            if (!bucket) continue;

            for (let bi = 0; bi < bucket.length; bi++) {
              const j = bucket[bi];
              if (j <= i) continue; // avoid double-drawing

              const b = nodes[j];
              const d2 = dist2(a.x, a.y, b.x, b.y);

              if (d2 < connectionDist2) {
                const distance = Math.sqrt(d2);
                const opacity =
                  (1 - distance / CONNECTION_DISTANCE) * CONNECTION_OPACITY;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = LINE_WIDTH;
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      // -----------------------------
      // Draw nodes
      // -----------------------------
      for (const node of nodes) {
        // star
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${NODE_ALPHA})`;
        ctx.fill();

        if (USE_GLOW) {
          const glowR = node.radius * GLOW_RADIUS_MULTIPLIER;
          const gradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            glowR
          );
          gradient.addColorStop(0, `rgba(0, 212, 255, ${GLOW_ALPHA})`);
          gradient.addColorStop(1, "rgba(0, 212, 255, 0)");

          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      // -----------------------------
      // Update motion (drift forever)
      // -----------------------------
      for (const node of nodes) {
        let boosted = false;

        if (mouse.active) {
          const d2m = dist2(node.x, node.y, mouse.x, mouse.y);

          if (d2m < mouseRadius2) {
            boosted = true;

            const d = Math.sqrt(d2m);
            const closeness = 1 - d / MOUSE_EFFECT_RADIUS;

            // Speed boost near mouse
            const boost = 1 + closeness * (MOUSE_SPEED_BOOST - 1);
            node.vx *= boost;
            node.vy *= boost;

            // Gentle repulsion (push away from mouse)
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const inv = d > 0 ? 1 / d : 0;

            node.vx += dx * inv * closeness * MOUSE_REPEL_STRENGTH;
            node.vy += dy * inv * closeness * MOUSE_REPEL_STRENGTH;
          }
        }

        // Damp boosted velocity slightly so it settles back down
        if (boosted) {
          node.vx *= BOOST_DAMPING;
          node.vy *= BOOST_DAMPING;
        }

        // Clamp max speed
        const speed = Math.hypot(node.vx, node.vy);
        if (speed > MAX_SPEED) {
          const scale = MAX_SPEED / speed;
          node.vx *= scale;
          node.vy *= scale;
        }

        // Guarantee baseline drift forever
        if (speed < BASE_SPEED) {
          const angle =
            speed > 0.001
              ? Math.atan2(node.vy, node.vx)
              : Math.random() * Math.PI * 2;

          node.vx = Math.cos(angle) * BASE_SPEED;
          node.vy = Math.sin(angle) * BASE_SPEED;
        }

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0) {
          node.x = 0;
          node.vx *= -1;
        } else if (node.x > width) {
          node.x = width;
          node.vx *= -1;
        }

        if (node.y < 0) {
          node.y = 0;
          node.vy *= -1;
        } else if (node.y > height) {
          node.y = height;
          node.vy *= -1;
        }
      }

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    // -----------------------------
    // Event handlers
    // -----------------------------
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleResize = () => {
      resizeCanvas();
      initNodes();
    };

    // -----------------------------
    // Start
    // -----------------------------
    resizeCanvas();
    initNodes();
    animationRef.current = requestAnimationFrame(drawFrame);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // -----------------------------
    // Cleanup
    // -----------------------------
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
};
