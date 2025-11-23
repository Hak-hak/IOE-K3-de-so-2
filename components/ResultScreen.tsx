import React from 'react';
import { Button } from './Button';
import { Trophy, CheckCircle, XCircle, RefreshCw, Eye, RotateCcw } from 'lucide-react';
import { UserAnswer } from '../types';

interface ResultScreenProps {
  userName: string;
  userAnswers: UserAnswer[];
  onRetryAll: () => void;
  onRetryWrong: () => void;
  onReviewWrong: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ 
  userName, 
  userAnswers, 
  onRetryAll,
  onRetryWrong,
  onReviewWrong
}) => {
  const correct = userAnswers.filter(a => a.isCorrect).length;
  const total = userAnswers.length;
  const incorrect = total - correct;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border border-slate-100">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-8 text-yellow-500 ring-8 ring-yellow-50">
          <Trophy className="w-12 h-12" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">Hoàn thành bài thi!</h2>
        <p className="text-lg text-slate-600 mb-8">Làm tốt lắm, <span className="font-bold text-blue-600">{userName}</span></p>
        
        <div className="relative mb-10 inline-block">
          <div className="text-7xl font-black text-blue-600 tracking-tight">{percentage}%</div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Độ chính xác</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-bold text-lg">Đúng</span>
            </div>
            <div className="text-3xl font-black text-green-600">{correct}</div>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <div className="flex items-center justify-center gap-2 mb-1">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-bold text-lg">Sai</span>
            </div>
            <div className="text-3xl font-black text-red-600">{incorrect}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={onRetryAll} size="md" variant="primary" className="shadow-lg shadow-blue-500/20">
                <RefreshCw className="w-5 h-5 mr-2" /> Chơi lại từ đầu
            </Button>
            
            {incorrect > 0 && (
                <>
                    <Button onClick={onRetryWrong} size="md" variant="secondary" className="shadow-lg shadow-emerald-500/20">
                        <RotateCcw className="w-5 h-5 mr-2" /> Làm lại câu sai
                    </Button>
                    <Button onClick={onReviewWrong} size="md" variant="outline" className="shadow-lg shadow-slate-200/50">
                        <Eye className="w-5 h-5 mr-2" /> Xem lại câu sai
                    </Button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};