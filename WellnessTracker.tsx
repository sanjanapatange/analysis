import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const categorizedHobbies: { [category: string]: string[] } = {
  "🎨 Creative & Artistic": ["Drawing", "Painting", "Singing", "Dancing"],
  "📚 Intellectual & Learning": ["Reading", "Writing", "Blogging"],
  "🎮 Entertainment & Fun": ["Gaming", "Watching Movies", "Listening to Music"],
  "🧘‍♀️ Wellness & Self-care": ["Yoga", "Meditation", "Gardening"],
  "🧠 Mental Stimulation": ["Puzzles", "Chess", "Coding"],
  "🌍 Exploration & Adventure": ["Traveling", "Photography", "Hiking"],
  "🍳 Culinary Arts": ["Cooking", "Baking", "Mixology"]
};

const COLORS = ['#8884d8', '#82ca9d'];

const WellnessTracker: React.FC = () => {
  const [age, setAge] = useState<number>(18);
  const [sleep, setSleep] = useState<number>(7);
  const [screenTime, setScreenTime] = useState<number>(4);
  const [socialInteraction, setSocialInteraction] = useState<number>(2);
  const [exercise, setExercise] = useState<number>(1);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const toggleHobby = (hobby: string) => {
    setHobbies((prev) =>
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
  };

  const analyze = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", {
        age, sleep, screenTime, socialInteraction, exercise, hobbies,
      });
      setResult(res.data);
    } catch (error) {
      console.error("Error analyzing data:", error);
    }
  };

  const pieData = result ? [
    { name: 'Depression', value: result.depressionPercent },
    { name: 'Loneliness', value: result.lonelinessPercent }
  ] : [];

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-10 bg-gradient-to-br from-blue-50 to-white min-h-screen rounded-2xl shadow-2xl">
      <Card className="shadow-xl border border-blue-300">
        <CardHeader>
          <CardTitle className="text-3xl text-blue-800 font-bold text-center">🧠 Wellness Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            {[['Age', age, setAge], ['Sleep (hrs/day)', sleep, setSleep], ['Screen Time (hrs/day)', screenTime, setScreenTime], ['Social Interactions (per day)', socialInteraction, setSocialInteraction], ['Exercise (days/week)', exercise, setExercise]].map(
              ([label, value, setter]: any, idx) => (
                <div key={idx}>
                  <Label className="text-base font-medium text-gray-700">{label}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setter(+e.target.value)}
                    className="rounded-lg mt-1"
                  />
                </div>
              )
            )}
          </div>

          <div className="space-y-6">
            <Label className="text-xl font-semibold text-gray-800">🎯 Select Your Hobbies</Label>
            {Object.entries(categorizedHobbies).map(([category, items]) => (
              <div key={category}>
                <h4 className="font-semibold text-blue-600 mt-4 text-md">{category}</h4>
                <div className="flex flex-wrap gap-3 mt-2">
                  {items.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className={`px-4 py-1.5 rounded-full text-sm transition font-medium shadow-md ${
                        hobbies.includes(hobby)
                          ? 'bg-blue-600 text-white border border-blue-700'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <Button
              onClick={analyze}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg py-3 rounded-lg shadow-lg transition"
            >
              🚀 Analyze My Wellness
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="shadow-lg border border-blue-400">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800 font-bold">📝 Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p><strong>Wellness Level:</strong> {result.wellnessLevel}</p>
                <p><strong>Depression Score:</strong> {result.depressionScore} ({result.depressionPercent}%)</p>
                <p><strong>Loneliness Score:</strong> {result.lonelinessScore} ({result.lonelinessPercent}%)</p>
              </div>

              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <strong>🧭 Recommendations:</strong>
              <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
                {result.recommendations.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>

            {result.resources && result.resources.length > 0 && (
              <div>
                <strong>📚 Helpful Resources:</strong>
                <ul className="list-disc list-inside mt-2 text-blue-700 underline space-y-1">
                  {result.resources.map((link: string, idx: number) => (
                    <li key={idx}>
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WellnessTracker;
