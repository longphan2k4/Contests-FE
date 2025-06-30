import React, { useEffect, useRef, useState } from "react";
import Logo from "../../gold/assets/images/Logo/Logo-gold.png";
import Laurel from "../../gold/assets/images/Logo/laurel.png";
import sound from "../../gold/assets/sounds/Sound GiaiThuong.mp3";
import type { GoldWinnerProps } from "../types/GoldWinnerProps";
import { useFireworkAnimation } from "../hooks/useFireworkAnimation";

const GoldWinnerDisplay: React.FC<GoldWinnerProps> = ({ studentName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(
    null
  ) as React.RefObject<HTMLCanvasElement>;
  const [win, setWin] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useFireworkAnimation(canvasRef);

  useEffect(() => {
    // Mock data for gold winner
    const mockData = {
      constestant: {
        fullname: studentName || "",
      },
    };

    setWin(mockData.constestant.fullname);
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch(error => console.error("Lỗi phát audio:", error));
    }
  }, [studentName]);

  return (
    <div>
      <audio ref={audioRef} autoPlay>
        <source src={sound} type="audio/mp3" />
      </audio>
      <div className="screen gold align-items-center items-center">
        <div className="effect">
          <div className="light1"></div>
          <div className="light2"></div>
          <div className="light3"></div>
          <div className="light4"></div>
          <div className="sparkle sparkle1"></div>
          <div className="sparkle sparkle2"></div>
          <div className="sparkle sparkle3"></div>
          <div className="sparkle sparkle4"></div>
          <div className="sparkle sparkle5"></div>
          <div className="sparkle sparkle6"></div>
          <div className="sparkle sparkle7"></div>
          <div className="sparkle sparkle8"></div>
          <div className="sparkle sparkle9"></div>
          <div className="sparkle sparkle10"></div>
        </div>
        <button className="gold">
          <img
            className="logo"
            src={Logo}
            alt="Olympic logo"
            width="280"
            height="280"
          />
        </button>
        <img className="laurel" src={Laurel} alt="laurel" />
        <div className="congrats text-center ">
          <h1>{win}</h1>
        </div>
      </div>
      <canvas id="canvas" ref={canvasRef}></canvas>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: rgb(0, 0, 0);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          overflow: hidden;
          background-image: radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
          animation: glowEffect 4s infinite alternate;
        }

        @keyframes glowEffect {
          0% { box-shadow: inset 0 0 150px rgba(255, 215, 0, 0.3); }
          100% { box-shadow: inset 0 0 200px rgba(255, 215, 0, 0.5); }
        }

        .screen.gold {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          z-index: 10;
        }

        .effect {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .light1, .light2, .light3, .light4 {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,215,0,0) 70%);
          opacity: 0;
          animation: pulse 3s infinite;
        }

        .light1 { top: 30%; left: 10%; width: 100px; height: 100px; animation-delay: 0s; }
        .light2 { top: 20%; right: 10%; width: 80px; height: 80px; animation-delay: 0.5s; }
        .light3 { bottom: 20%; left: 15%; width: 120px; height: 120px; animation-delay: 1s; }
        .light4 { bottom: 30%; right: 15%; width: 90px; height: 90px; animation-delay: 1.5s; }

        @keyframes pulse {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }

        .sparkle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255, 215, 0, 0.8);
          border-radius: 50%;
          opacity: 0;
          animation: sparkle 2s infinite;
        }

        .sparkle1 { top: 10%; left: 20%; animation-delay: 0s; }
        .sparkle2 { top: 15%; left: 80%; animation-delay: 0.2s; }
        .sparkle3 { top: 25%; left: 30%; animation-delay: 0.4s; }
        .sparkle4 { top: 35%; left: 70%; animation-delay: 0.6s; }
        .sparkle5 { top: 45%; left: 10%; animation-delay: 0.8s; }
        .sparkle6 { top: 55%; left: 90%; animation-delay: 1s; }
        .sparkle7 { top: 65%; left: 25%; animation-delay: 1.2s; }
        .sparkle8 { top: 75%; left: 75%; animation-delay: 1.4s; }
        .sparkle9 { top: 85%; left: 15%; animation-delay: 1.6s; }
        .sparkle10 { top: 95%; left: 85%; animation-delay: 1.8s; }

        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }

        button.gold {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 350px;
          height: 350px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD700, #FFA500, #B8860B, #DAA520);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          z-index: 2;
        }

        button.gold:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(255, 215, 0, 1);
        }

        button.gold:active {
          transform: scale(0.95);
        }

        button.gold span {
          position: relative;
          color: #000;
          font-size: 22px;
          font-weight: bold;
          letter-spacing: 2px;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
          z-index: 2;
        }

        button.gold::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { left: -50%; }
          100% { left: 150%; }
        }

        img.laurel {
          position: absolute;
          width: 525px;
          height: auto;
          opacity: 0.9;
          pointer-events: none;
          z-index: 1;
          top: -280px;
          animation: fall 3s forwards;
        }

        @keyframes fall {
          0% { top: -280px; }
          75% { top: 60px; }
          85% { top: 65px; }
          95% { top: 60px; }
          100% { top: 60px; }
        }

        .logo {
          border: 2px solid #B8860B;
          padding: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffe44e, #f8b945, #ad8d3a, #d4ab42);
        }

        .congrats {
          position: absolute;
          bottom: 35px;
          font-weight: bolder;
          font-family: 'Be Vietnam';
          font-size: 35px;
          color: #866000;
          opacity: 0;
          animation: fadeIn 2s forwards;
          animation-delay: 2s;
          z-index: 10;
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        #canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }
      `}</style>
    </div>
  );
};

export default GoldWinnerDisplay;
