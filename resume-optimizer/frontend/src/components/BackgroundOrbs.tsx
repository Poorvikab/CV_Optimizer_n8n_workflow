const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="gradient-orb animate-float w-[500px] h-[500px] -top-32 -left-32"
        style={{ background: 'radial-gradient(circle, hsl(239 84% 67% / 0.15), transparent 70%)' }}
      />
      <div
        className="gradient-orb animate-float-delayed w-[600px] h-[600px] top-1/2 -right-48"
        style={{ background: 'radial-gradient(circle, hsl(280 70% 50% / 0.1), transparent 70%)' }}
      />
      <div
        className="gradient-orb animate-float w-[400px] h-[400px] -bottom-20 left-1/3"
        style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.08), transparent 70%)' }}
      />
    </div>
  );
};

export default BackgroundOrbs;
