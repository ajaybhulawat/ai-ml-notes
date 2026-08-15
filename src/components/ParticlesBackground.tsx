"use client"

import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"

export default function ParticlesBackground() {
  const particlesInit = async (main: any) => {
    await loadFull(main)
  }

  return (
    <Particles
      init={particlesInit}
      options={{
        background: {
          color: "#0f172a",
        },
        particles: {
          number: { value: 60 },
          color: { value: "#a5b4fc" },
          links: {
            enable: true,
            color: "#a5b4fc",
            distance: 150,
            opacity: 0.2,
          },
          move: { enable: true, speed: 1 },
          opacity: { value: 0.3 },
          size: { value: 2 },
        },
      }}
      className="absolute inset-0 -z-10"
    />
  )
}