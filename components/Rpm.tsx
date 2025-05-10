'use client';
import { Target, List, Zap, Star, CheckCircle, Circle, ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { RPMTask } from '../types';

interface RPMDailyPlannerProps {
  tasks: RPMTask[];
  addTask: (purpose: string, outcome: string, actions: string[]) => void;
  toggleCompletion: (id: string) => void;
  toggleStar: (id: string) => void;
  deleteTask: (id: string) => void;
}

export function RPMDailyPlanner({ 
  tasks, 
  addTask,
  toggleCompletion,
  toggleStar,
  deleteTask
}: RPMDailyPlannerProps) {
  const [purpose, setPurpose] = useState('');
  const [outcome, setOutcome] = useState('');
  const [actionSteps, setActionSteps] = useState<string[]>(['']);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const handleAddTask = () => {
    if (purpose.trim() && outcome.trim() && actionSteps.some(step => step.trim())) {
      addTask(purpose.trim(), outcome.trim(), actionSteps.filter(step => step.trim()));
      setPurpose('');
      setOutcome('');
      setActionSteps(['']);
    }
  };

  const addActionStep = () => {
    setActionSteps([...actionSteps, '']);
  };

  const updateActionStep = (index: number, value: string) => {
    const newSteps = [...actionSteps];
    newSteps[index] = value;
    setActionSteps(newSteps);
  };

  const removeActionStep = (index: number) => {
    if (actionSteps.length > 1) {
      const newSteps = [...actionSteps];
      newSteps.splice(index, 1);
      setActionSteps(newSteps);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Zap size={20} className=" dark:" />
        <h2 className="dark:text-white">RPM Daily Planner by Tonny Robbins</h2>
      </div>



      <div className="space-y-4 p-4 rounded-lg shadow-sm border dark:border-gray-700 dark:bg-gray-800">
      <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
    <Target size={16} className=" dark:" /> Purpose (Why is this important?)
  </label>
  <input
    type="text"
    value={purpose}
    onChange={(e) => setPurpose(e.target.value)}
    placeholder="Example: To build a strong and healthy body"
    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
    <CheckCircle size={16} className=" dark:" /> Desired Outcome (What specific result?)
  </label>
  <input
    type="text"
    value={outcome}
    onChange={(e) => setOutcome(e.target.value)}
    placeholder="Example: Complete a 45-minute workout"
    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
  />
</div>


        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <List size={16} className=" dark:" /> Massive Action Plan
          </label>
          <div className="space-y-2">
            {actionSteps.map((step, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateActionStep(index, e.target.value)}
                  placeholder={`Action step ${index + 1}`}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                />
                {actionSteps.length > 1 && (
                  <button
                    onClick={() => removeActionStep(index)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addActionStep}
              className="text-sm text-blue-600 hover:text-blue-700 dark: dark:hover:text-blue-300 flex items-center gap-1"
            >
              <Plus size={14} /> Add another action step
            </button>
          </div>
        </div>

        <button
          onClick={handleAddTask}
          className={`w-full p-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium ${
            purpose.trim() && outcome.trim() && actionSteps.some(step => step.trim())
              ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
          }`}
          disabled={!purpose.trim() || !outcome.trim() || !actionSteps.some(step => step.trim())}
        >
          <Plus size={18} />
          Add RPM Task
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold dark:text-white">Today's RPM Plan</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tasks.filter(t => !t.completed).length} remaining
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 mt-2">
            <Target size={24} className="mx-auto mb-2 dark:text-gray-600" />
            <p className="dark:text-gray-500">No RPM tasks yet</p>
            <p className="text-sm mt-1 dark:text-gray-500">Start by adding your first task above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...tasks]
              .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0))
              .map(task => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg ${task.completed ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'} ${
                    task.starred ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' : 'dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleCompletion(task.id)}
                        className={`mt-1 flex-shrink-0 ${
                          task.completed ? 'text-green-500 dark:text-green-400' : 'text-gray-300 hover:text-gray-400 dark:text-gray-500 dark:hover:text-gray-400'
                        }`}
                      >
                        {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'dark:text-white'}`}>
                            {task.purpose}
                          </p>
                          {task.starred && <Star size={16} className=" fill-blue-500 dark: dark:fill-blue-400" />}
                        </div>
                        <p className={`text-sm ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                          {task.desiredOutcome}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStar(task.id)}
                        className={`p-1 ${task.starred ? ' dark:' : 'text-gray-300 hover: dark:text-gray-400 dark:hover:'}`}
                      >
                        <Star size={16} fill={task.starred ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-gray-300 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        {expandedTask === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {expandedTask === task.id && (
                    <div className="mt-3 pl-9">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                        <List size={14} className=" dark:" /> Action Plan
                      </h4>
                      <ul className="space-y-2">
                        {task.massiveActionPlan.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className={`mt-1 flex-shrink-0 ${
                              task.completed ? 'text-green-500 dark:text-green-400' : 'text-gray-300 dark:text-gray-500'
                            }`}>
                              {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                            </div>
                            <span className={`text-sm ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'dark:text-gray-300'}`}>
                              {step}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}