import React from 'react';
import { Activity, Thermometer, Heart, Moon } from 'lucide-react';
import { Symptom } from '../types';

const symptoms: Symptom[] = [
  { id: 'cramps', name: 'Cramps', category: 'physical', icon: 'Activity' },
  { id: 'headache', name: 'Headache', category: 'physical', icon: 'Thermometer' },
  { id: 'fatigue', name: 'Fatigue', category: 'physical', icon: 'Moon' },
  { id: 'mood-swings', name: 'Mood Swings', category: 'emotional', icon: 'Heart' },
];

interface SymptomTrackerProps {
  selectedSymptoms: string[];
  onSymptomToggle: (symptomId: string) => void;
}

export function SymptomTracker({ selectedSymptoms, onSymptomToggle }: SymptomTrackerProps) {
  const IconMap = {
    Activity,
    Thermometer,
    Moon,
    Heart,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Symptoms</h2>
      <div className="grid grid-cols-2 gap-4">
        {symptoms.map((symptom) => {
          const Icon = IconMap[symptom.icon as keyof typeof IconMap];
          return (
            <button
              key={symptom.id}
              onClick={() => onSymptomToggle(symptom.id)}
              className={`
                flex items-center gap-3 p-4 rounded-lg transition-all
                ${
                  selectedSymptoms.includes(symptom.id)
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{symptom.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}