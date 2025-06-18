import React, { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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
    setHobbies(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
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
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-gradient-to-br from-blue-50 to-white min-h-screen rounded-xl shadow-xl">
      <Card className="shadow-lg border border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700 font-bold">Wellness Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-md">Age</Label>
              <Input type="number" value={age} onChange={(e) => setAge(+e.target.value)} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-md">Sleep (hrs/day)</Label>
              <Input type="number" value={sleep} onChange={(e) => setSleep(+e.target.value)} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-md">Screen Time (hrs/day)</Label>
              <Input type="number" value={screenTime} onChange={(e) => setScreenTime(+e.target.value)} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-md">Social Interactions (per day)</Label>
              <Input type="number" value={socialInteraction} onChange={(e) => setSocialInteraction(+e.target.value)} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-md">Exercise (days/week)</Label>
              <Input type="number" value={exercise} onChange={(e) => setExercise(+e.target.value)} className="rounded-lg" />
            </div>
          </div>

          <div className="space-y-6">
            <Label className="text-lg font-semibold">Select Your Hobbies</Label>
            {Object.entries(categorizedHobbies).map(([category, items]) => (
              <div key={category}>
                <h4 className="font-semibold text-blue-600 mt-4">{category}</h4>
                <div className="flex flex-wrap gap-3 mt-2">
                  {items.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className={`px-4 py-1.5 rounded-full text-sm transition font-medium shadow-sm ${
                        hobbies.includes(hobby)
                          ? 'bg-blue-600 text-white'
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

          <div className="pt-6">
            <Button onClick={analyze} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-2 rounded-lg">
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="shadow-md border border-blue-300">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Wellness Level:</strong> {result.wellnessLevel}</p>
            <p><strong>Depression Score:</strong> {result.depressionScore} ({result.depressionPercent}%)</p>
            <p><strong>Loneliness Score:</strong> {result.lonelinessScore} ({result.lonelinessPercent}%)</p>

            <div className="h-64 mt-4">
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

            <div>
              <strong>Recommendations:</strong>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {result.recommendations.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>

            {result.resources && result.resources.length > 0 && (
              <div>
                <strong>Helpful Resources:</strong>
                <ul className="list-disc list-inside mt-2 text-blue-700 underline">
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
