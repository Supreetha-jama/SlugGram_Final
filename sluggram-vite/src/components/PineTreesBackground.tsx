export function PineTreesBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Left side trees */}
      <svg
        className="absolute left-0 bottom-0 h-full w-32 opacity-10"
        viewBox="0 0 100 400"
        preserveAspectRatio="xMinYMax slice"
      >
        {/* Tree 1 */}
        <polygon points="20,400 5,300 20,310 35,300" fill="#003c6c" />
        <polygon points="20,320 0,240 20,255 40,240" fill="#003c6c" />
        <polygon points="20,260 -5,180 20,200 45,180" fill="#003c6c" />
        <rect x="17" y="400" width="6" height="20" fill="#5D4037" />

        {/* Tree 2 */}
        <polygon points="55,400 40,320 55,330 70,320" fill="#003c6c" />
        <polygon points="55,340 35,270 55,285 75,270" fill="#003c6c" />
        <polygon points="55,285 30,210 55,230 80,210" fill="#003c6c" />
        <polygon points="55,230 25,150 55,175 85,150" fill="#003c6c" />
        <rect x="52" y="400" width="6" height="20" fill="#5D4037" />

        {/* Tree 3 */}
        <polygon points="85,400 70,340 85,350 100,340" fill="#003c6c" />
        <polygon points="85,355 65,290 85,305 105,290" fill="#003c6c" />
        <polygon points="85,305 60,240 85,260 110,240" fill="#003c6c" />
        <rect x="82" y="400" width="6" height="20" fill="#5D4037" />
      </svg>

      {/* Right side trees */}
      <svg
        className="absolute right-0 bottom-0 h-full w-32 opacity-10"
        viewBox="0 0 100 400"
        preserveAspectRatio="xMaxYMax slice"
      >
        {/* Tree 1 */}
        <polygon points="80,400 65,300 80,310 95,300" fill="#003c6c" />
        <polygon points="80,320 60,240 80,255 100,240" fill="#003c6c" />
        <polygon points="80,260 55,180 80,200 105,180" fill="#003c6c" />
        <rect x="77" y="400" width="6" height="20" fill="#5D4037" />

        {/* Tree 2 */}
        <polygon points="45,400 30,320 45,330 60,320" fill="#003c6c" />
        <polygon points="45,340 25,270 45,285 65,270" fill="#003c6c" />
        <polygon points="45,285 20,210 45,230 70,210" fill="#003c6c" />
        <polygon points="45,230 15,150 45,175 75,150" fill="#003c6c" />
        <rect x="42" y="400" width="6" height="20" fill="#5D4037" />

        {/* Tree 3 */}
        <polygon points="15,400 0,340 15,350 30,340" fill="#003c6c" />
        <polygon points="15,355 -5,290 15,305 35,290" fill="#003c6c" />
        <polygon points="15,305 -10,240 15,260 40,240" fill="#003c6c" />
        <rect x="12" y="400" width="6" height="20" fill="#5D4037" />
      </svg>

      {/* Top gradient with mountain silhouette */}
      <svg
        className="absolute top-14 left-0 right-0 w-full h-48 opacity-5"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMin slice"
      >
        <polygon points="0,200 100,120 200,160 350,80 500,140 650,60 800,130 950,70 1100,150 1200,100 1200,200" fill="#003c6c" />
        <polygon points="0,200 150,150 300,180 450,120 600,170 750,100 900,160 1050,110 1200,180 1200,200" fill="#003c6c" opacity="0.5" />
      </svg>
    </div>
  );
}
