import React from 'react';
import PitchSimulator from '../components/PitchSimulator';

const PitchSimulatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pitch Simulator
            </h1>
            <p className="text-lg text-gray-600">
              Get instant feedback on your startup pitch
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <PitchSimulator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchSimulatorPage;
