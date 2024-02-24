// Inspired by https://codepen.io/yaclive/pen/EayLYO and adpated for react component for Aetheria by KingSimpa69

import React, { useEffect,useState } from 'react';
import delay from '@/functions/delay';

const MatrixLoadingScreen = ({isLoading}) => {

  const [css0,setCss0] = useState("")
  const [css1,setCss1] = useState("hidden")

  useEffect(() => {
    const closeMatrix = async() => {
        await delay(1000)
        setCss0("animate__animated animate__fadeOut animate__faster")
        await delay(450)
        setCss1("hidden")
    }
    const openMatrix = async() => {
        setCss1("matrixCanvas")
        setCss0("animate__animated animate__fadeIn animate__faster")
    }
    isLoading ? openMatrix() : closeMatrix()
}, [isLoading])
  

  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    let [width, height] = [window.innerWidth, window.innerHeight];
    canvas.width = width;
    canvas.height = height;

    const columns = Math.floor(width / 20);
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * height;
    }

    const letters = ['B', 'A', 'S', 'E', 'D', 'F', 'E', 'L', 'L', 'A', 'S'];

    const draw = () => {
      ctx.fillStyle = 'rgba(6, 5, 8, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#98e1e2';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const letterIndex = Math.floor(Math.random() * letters.length);
        const text = letters[letterIndex];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const animate = () => {
      draw();
      setTimeout(animate, 60); 
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas id="matrix-canvas" className={`${css0} ${css1}`}></canvas>;
};

export default MatrixLoadingScreen;
