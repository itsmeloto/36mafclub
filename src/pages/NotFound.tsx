import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-red-950 to-black p-6 text-center animate-fade-in">
      <div className="glass-card max-w-md w-full p-8 sm:p-10 space-y-8 animate-scale-in">
        {/* 404 Icon/Number */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-red-500/20 blur-2xl rounded-full"></div>
            <h1 className="relative heading-gradient font-bold" 
                style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', lineHeight: '1' }}>
              404
            </h1>
          </div>
          
          <h2 className="font-semibold text-white" 
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: '1.3' }}>
            Page Not Found
          </h2>
          
          <p className="text-gray-200 leading-relaxed" 
             style={{ fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)' }}>
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            asChild 
            className="touch-target bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl shadow-lg smooth-transition hover:scale-105 active:scale-95 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <a href="/">Return Home</a>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="touch-target bg-black/30 border-white/20 text-gray-300 hover:text-white hover:bg-black/50 rounded-xl smooth-transition focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
