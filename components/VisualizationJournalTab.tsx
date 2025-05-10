'use client';
import { useState } from 'react';
import { Visualization, VisualizationJournal } from '../types';

export function VisualizationJournalTab({
  visualizations,
  journalEntries,
  addJournalEntry,
  deleteJournalEntry
}: {
  visualizations: Visualization[];
  journalEntries: VisualizationJournal[];
  addJournalEntry: (visualizationId: string, entry: string, emotions: string[], clarityRating: number) => void;
  deleteJournalEntry: (id: string) => void;
}) {
  const [selectedVizId, setSelectedVizId] = useState<string>('');
  const [journalText, setJournalText] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [clarityRating, setClarityRating] = useState<number>(3);
  const [availableEmotions] = useState([
    'Excited', 'Hopeful', 'Grateful', 'Peaceful', 
    'Anxious', 'Doubtful', 'Frustrated', 'Confused'
  ]);

  const selectedVisualization = visualizations.find(viz => viz.id === selectedVizId);
  const relatedEntries = journalEntries.filter(entry => entry.visualizationId === selectedVizId);

  const handleAddEntry = () => {
    if (!selectedVizId || !journalText.trim()) return;
    
    addJournalEntry(
      selectedVizId,
      journalText,
      emotions,
      clarityRating
    );
    
    setJournalText('');
    setEmotions([]);
    setClarityRating(3);
  };

  const toggleEmotion = (emotion: string) => {
    setEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion) 
        : [...prev, emotion]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Visualization Tips Box - Added at the top */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-blue-800 mb-2">Do This Daily</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
          <li>Use present tense</li>
          <li>Add emotion (joy, pride, gratitude)</li>
          <li>Include sensory detail (What do you see/hear/feel?)</li>
          <li>Be consistent (visualize for 2-5 mins daily)</li>
        </ul>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">Select Visualization to Journal About</h3>
          <select
  value={selectedVizId}
  onChange={(e) => setSelectedVizId(e.target.value)}
  className="w-full p-2 border rounded mb-4 bg-white text-black dark:bg-gray-800 dark:text-white"
>
  <option value="">Select a visualization</option>
  {visualizations.map(viz => (
    <option key={viz.id} value={viz.id}>
      {viz.description} ({new Date(viz.date).toLocaleDateString()})
    </option>
  ))}
</select>


          {selectedVisualization && (
            <div className="mb-4 p-3 rounded">
              <h4 className="font-semibold">Selected Visualization:</h4>
              <p>{selectedVisualization.description}</p>
              {selectedVisualization.timeframe && (
                <p className="text-sm text-gray-600">
                  Timeframe: {selectedVisualization.timeframe}
                </p>
              )}
            </div>
          )}
        </div>

        {selectedVizId && (
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Journal Entry</h3>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Describe your visualization experience in detail..."
              className="w-full p-3 border rounded mb-4 h-40 min-h-[160px]"
            />

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Emotions During Visualization:</h4>
              <div className="flex flex-wrap gap-2">
                {availableEmotions.map(emotion => (
                  <button
                    key={emotion}
                    onClick={() => toggleEmotion(emotion)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      emotions.includes(emotion)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Clarity Rating: {clarityRating}/5</h4>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setClarityRating(star)}
                    className={`text-2xl ${
                      star <= clarityRating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddEntry}
              disabled={!journalText.trim()}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Add Journal Entry
            </button>
          </div>
        )}

        {relatedEntries.length > 0 && (
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-2">Previous Journal Entries</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {relatedEntries.map(entry => (
                <div key={entry.id} className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{entry.entry}</p>
                      {entry.emotions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {entry.emotions.map(emotion => (
                            <span 
                              key={emotion} 
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {emotion}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 flex items-center">
                        <span className="text-yellow-500 mr-1">
                          {'★'.repeat(entry.clarityRating)}
                          {'☆'.repeat(5 - entry.clarityRating)}
                        </span>
                        <span className="text-sm text-gray-600">
                          Clarity
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}