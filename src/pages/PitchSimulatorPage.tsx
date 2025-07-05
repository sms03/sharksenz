import React from 'react';
import PitchSimulator from '../components/PitchSimulator';

const PitchSimulatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Pitch Simulator
            </h1>
            <p className="text-lg text-slate-600">
              Perfect your startup pitch with our interactive simulator. Get instant feedback, 
              practice different scenarios, and build confidence for your next investor meeting.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <PitchSimulator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchSimulatorPage;
