import React from 'react';
import PitchSimulator from '../components/PitchSimulator';
import { PresentationIcon } from 'lucide-react';

const PitchSimulatorPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce opacity-20"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                    <PresentationIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text">
                      🦈 Shark Tank Pitch Simulator
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Perfect your pitch like the sharks are watching
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <PitchSimulator />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchSimulatorPage;