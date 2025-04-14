import React from 'react';
import { Brain, Book, Heart } from 'lucide-react';

const insights = [
  {
    title: 'Understanding Your Cycle',
    description: 'Learn about the four phases of your menstrual cycle and what to expect.',
    icon: Brain,
  },
  {
    title: 'Fertility Window',
    description: 'Track your fertile days to plan or prevent pregnancy.',
    icon: Heart,
  },
  {
    title: 'Health Tips',
    description: 'Get personalized recommendations for diet, exercise, and self-care.',
    icon: Book,
  },
];

export function HealthInsights() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Health Insights</h2>
      <div className="space-y-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50"
          >
            <div className="p-3 bg-white rounded-full shadow-sm">
              <insight.icon className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">{insight.title}</h3>
              <p className="text-gray-600">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}