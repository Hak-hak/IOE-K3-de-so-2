import React, { useState } from 'react';
import { Button } from './Button';
import { GraduationCap } from 'lucide-react';

interface StartScreenProps {
  onStart: (name: string) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">IOE K3 - Đề số 2</h1>
          <p className="text-slate-500">Luyện thi tiếng Anh IOE cùng AI Master</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Họ và tên</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn..." 
              className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-lg font-medium placeholder:text-slate-300"
              required
            />
          </div>
          <Button type="submit" className="w-full shadow-xl shadow-blue-500/40" size="lg" disabled={!name.trim()}>
            Bắt đầu làm bài
          </Button>
        </form>
      </div>
    </div>
  );
};