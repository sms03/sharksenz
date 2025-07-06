import React from 'react';
import PitchSimulator from '../components/PitchSimulator';

const PitchSimulatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-300/40 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-teal-300/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-blue-400/25 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Subtle wave pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent transform rotate-12 scale-150"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-200/15 to-transparent transform -rotate-12 scale-150 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pitch Simulator
            </h1>
            <p className="text-lg text-gray-600">
              Get instant feedback on your startup pitch
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-8">
            <PitchSimulator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchSimulatorPage;
