import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../types';
import { Button } from './Button';
import { AudioPlayer } from './AudioPlayer';
import { CheckCircle2, XCircle, HelpCircle, Lightbulb } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (response: string) => void;
  isAnswered: boolean;
  userAnswer?: string;
  isReviewMode?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, isAnswered, userAnswer, isReviewMode }) => {
  const [inputVal, setInputVal] = useState('');
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  
  useEffect(() => {
    setInputVal('');
    setSelectedParts([]);
    setShowHint(false); // Ẩn gợi ý khi chuyển câu hỏi
  }, [question.id]);

  const normalize = (str: string) => str ? str.replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase() : "";
  const isCorrect = () => userAnswer && normalize(userAnswer) === normalize(question.correctAnswer);

  const handleMCSelect = (opt: string) => !isAnswered && onAnswer(opt);
  
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnswered && inputVal.trim()) onAnswer(inputVal.trim());
  };
  
  const handlePartClick = (part: string) => {
    if (!isAnswered) {
      setSelectedParts(prev => 
        prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
      );
    }
  };
  
  const handleRearrangeSubmit = () => {
    if (!isAnswered && selectedParts.length > 0) {
      onAnswer(selectedParts.join(' '));
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
      switch (type) {
          case QuestionType.MULTIPLE_CHOICE: return 'Trắc nghiệm';
          case QuestionType.FILL_IN_BLANK: return 'Điền từ';
          case QuestionType.REARRANGE: return 'Sắp xếp câu';
          default: return type;
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 ring-1 ring-slate-100">
        {/* Header */}
        <div className="bg-slate-50/80 backdrop-blur px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-wide">
            <HelpCircle className="w-3 h-3 mr-1" />
            {getQuestionTypeLabel(question.type)}
          </span>
          <span className="text-xs font-bold text-slate-400">ID: {question.id}</span>
        </div>

        <div className="p-6 sm:p-10">
          {/* Media Section */}
          <div className="mb-6 space-y-6">
            {question.imageUrl && (
              <div className="flex justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <img 
                  src={question.imageUrl} 
                  alt="Question context" 
                  className="max-h-72 rounded-lg shadow-sm object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            {question.audioUrl && (
              <div className="flex justify-center">
                <AudioPlayer src={question.audioUrl} />
              </div>
            )}
          </div>

          {/* Question Text & Hint Button */}
          <div className="mb-8">
            <div className="flex justify-between items-start gap-4">
                 <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
                    {question.questionText}
                  </h2>
                  {!isAnswered && (
                    <button 
                        onClick={() => setShowHint(!showHint)}
                        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                            showHint 
                            ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400 ring-offset-1' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:text-yellow-600 hover:border-yellow-300'
                        }`}
                        title="Xem gợi ý để làm bài dễ hơn"
                    >
                        <Lightbulb className={`w-4 h-4 ${showHint ? 'fill-yellow-500' : ''}`} />
                        <span className="hidden sm:inline">{showHint ? 'Ẩn gợi ý' : 'Gợi ý'}</span>
                    </button>
                  )}
            </div>

            {/* Hint Box Display */}
            {showHint && !isAnswered && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-slate-700 animate-fade-in relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                    <div className="flex gap-3">
                         <div className="shrink-0 p-2 bg-yellow-100 rounded-lg text-yellow-600 h-fit">
                             <Lightbulb className="w-5 h-5" />
                         </div>
                         <div>
                             <p className="font-bold text-yellow-800 text-sm uppercase tracking-wide mb-1">Gợi ý:</p>
                             <p className="text-slate-800 leading-relaxed font-medium">{question.explanation}</p>
                         </div>
                    </div>
                </div>
            )}
          </div>
          
          {/* Multiple Choice */}
          {question.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options?.map((opt, idx) => {
                let buttonStyle = "bg-white hover:border-blue-400 border-slate-200 text-slate-700";
                if (isAnswered) {
                  if (opt === question.correctAnswer) buttonStyle = "bg-green-100 border-green-500 text-green-800 ring-1 ring-green-500";
                  else if (opt === userAnswer) buttonStyle = "bg-red-100 border-red-500 text-red-800 ring-1 ring-red-500";
                  else buttonStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                }

                return (
                  <button 
                    key={idx} 
                    onClick={() => handleMCSelect(opt)} 
                    disabled={isAnswered} 
                    className={`w-full p-4 rounded-xl text-left border-2 transition-all duration-200 font-medium flex items-center ${buttonStyle}`}
                  >
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold mr-3 text-sm shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in Blank */}
          {question.type === QuestionType.FILL_IN_BLANK && (
            <form onSubmit={handleInputSubmit} className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                value={isAnswered && userAnswer ? userAnswer : inputVal} 
                onChange={(e) => setInputVal(e.target.value)} 
                disabled={isAnswered} 
                className={`flex-1 p-4 rounded-xl border-2 outline-none transition-all font-medium text-lg ${
                  isAnswered 
                    ? (isCorrect() 
                        ? 'border-green-500 bg-green-50 text-green-900' 
                        : 'border-red-500 bg-red-50 text-red-900') 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`} 
                placeholder="Nhập câu trả lời..." 
              />
              {!isAnswered && (
                <Button type="submit" className="whitespace-nowrap">
                  Trả lời
                </Button>
              )}
            </form>
          )}

          {/* Rearrange */}
          {question.type === QuestionType.REARRANGE && (
            <div className="space-y-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {question.rearrangeParts?.map((part, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handlePartClick(part)} 
                    disabled={isAnswered || selectedParts.includes(part)} 
                    className={`px-4 py-2 rounded-lg font-semibold border-b-4 transition-all active:border-b-0 active:translate-y-1 ${
                      selectedParts.includes(part) 
                        ? 'opacity-30 bg-slate-100 border-slate-200 cursor-not-allowed' 
                        : 'bg-white border-slate-200 shadow-sm hover:border-blue-400 hover:text-blue-600 text-slate-600'
                    }`}
                  >
                    {part}
                  </button>
                ))}
              </div>
              
              <div className={`min-h-[80px] p-6 rounded-xl border-2 border-dashed flex flex-wrap gap-2 items-center justify-center transition-colors ${
                isAnswered 
                  ? (isCorrect() ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50') 
                  : 'border-slate-300 bg-slate-50'
              }`}>
                {selectedParts.length === 0 && !isAnswered && (
                  <span className="text-slate-400 text-sm font-medium">Nhấn vào các từ bên trên để sắp xếp</span>
                )}
                {selectedParts.map((part, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handlePartClick(part)} 
                    disabled={isAnswered} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-red-500 transition-colors"
                  >
                    {part}
                  </button>
                ))}
              </div>

              {!isAnswered && (
                <div className="flex justify-end">
                  <Button onClick={handleRearrangeSubmit} disabled={selectedParts.length === 0}>
                    Xác nhận
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Feedback Section (Shown after answering) */}
          {isAnswered && (
            <div className={`mt-10 p-6 rounded-2xl border animate-slide-up ${isCorrect() ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full shrink-0 ${isCorrect() ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {isCorrect() ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${isCorrect() ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect() ? 'Chính xác!' : 'Chưa chính xác'}
                  </h3>
                  {!isCorrect() && (
                    <div className="mb-3 text-red-700">
                      Đáp án đúng: <span className="font-bold bg-white px-2 py-0.5 rounded border border-red-200 ml-1">{question.correctAnswer}</span>
                    </div>
                  )}
                  <div className="text-slate-700 bg-white/80 p-4 rounded-xl border border-slate-200/50 mt-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-600 border-b border-blue-100 pb-2">
                        <Lightbulb className="w-4 h-4" />
                        <span className="font-bold text-sm uppercase tracking-wider">Giải thích chi tiết</span>
                    </div>
                    {question.explanation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};