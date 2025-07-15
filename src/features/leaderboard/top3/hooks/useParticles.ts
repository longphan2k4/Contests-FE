
// import { useEffect } from "react";

// export const useParticles = (
//   particlesRef: React.RefObject<HTMLDivElement | null>
// ) => {
//   useEffect(() => {
//     if (particlesRef.current) {
//       initParticles();
//     }

//     return () => {
//       if (window.pJSDom && window.pJSDom.length > 0) {
//         window.pJSDom[0].pJS.fn.vendors.destroypJS();
//         window.pJSDom = [];
//       }
//     };
//   }, [particlesRef]);

//   const initParticles = () => {
//     if (typeof window !== "undefined" && window.particlesJS) {
//       window.particlesJS("particles-js", {
//         particles: {
//           number: { value: 50, density: { enable: true, value_area: 800 } },
//           color: { value: "#f1c40f" },
//           shape: {
//             type: "circle",
//             stroke: { width: 0, color: "#000000" },

//             polygon: { nb_sides: 5 },
//           },
//           opacity: {
//             value: 0.2,
//             random: true,
//             anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
//           },
//           size: {
//             value: 4,
//             random: true,
//             anim: { enable: true, speed: 2, size_min: 0.1, sync: false },
//           },
//           line_linked: {
//             enable: true,
//             distance: 150,
//             color: "#f1c40f",
//             opacity: 0.1,
//             width: 1,
//           },
//           move: {
//             enable: true,
//             speed: 1,
//             direction: "none",
//             random: true,
//             straight: false,
//             out_mode: "bounce",
//             bounce: false,
//             attract: { enable: false, rotateX: 600, rotateY: 1200 },
//           },
//         },
//         interactivity: {
//           detect_on: "canvas",
//           events: {
//             onhover: { enable: true, mode: "bubble" },
//             onclick: { enable: true, mode: "push" },
//             resize: true,
//           },
//           modes: {
//             bubble: {
//               distance: 200,
//               size: 6,
//               duration: 2,
//               opacity: 0.4,
//               speed: 3,
//             },
//             push: { particles_nb: 4 },
//             remove: { particles_nb: 2 },
//           },
//         },
//         retina_detect: true,
//       });
//     }
//   };
// };