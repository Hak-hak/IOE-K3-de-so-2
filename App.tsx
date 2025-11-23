import React, { useState, useEffect } from 'react';
import { GameState, Question, UserAnswer } from './types';
import { QUIZ_DATA } from './constants';
import { StartScreen } from './components/StartScreen';
import { ResultScreen } from './components/ResultScreen';
import { QuestionCard } from './components/QuestionCard';
import { Button } from './components/Button';
import { ArrowLeft, ArrowRight, CheckSquare, Flag, LayoutGrid, X } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [userName, setUserName] = useState('');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Initialize Game
  const handleStart = (name: string) => {
    setUserName(name);
    startNewGame(QUIZ_DATA);
  };

  const startNewGame = (questions: Question[]) => {
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers([]);
    setIsReviewMode(false);
    setGameState(GameState.PLAYING);
    setShowQuestionGrid(false);
  };

  const handleAnswer = (response: string) => {
    const q = activeQuestions[currentIndex];
    const normalize = (s: string) => s.replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const isCorrect = normalize(response) === normalize(q.correctAnswer);
    
    setUserAnswers(prev => [
      ...prev.filter(a => a.questionId !== q.id),
      { questionId: q.id, userResponse: response, isCorrect }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
     handleNext();
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowQuestionGrid(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = () => {
    const unansweredCount = activeQuestions.length - userAnswers.length;
    if (unansweredCount > 0) {
        if (!confirm(`Bạn còn ${unansweredCount} câu chưa hoàn thành. Bạn có chắc chắn muốn nộp bài không?`)) {
            return;
        }
    }
    setGameState(GameState.FINISHED);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Result Screen Handlers
  const handleRetryAll = () => {
    startNewGame(QUIZ_DATA);
  };

  const handleRetryWrong = () => {
    const wrongIds = userAnswers.filter(a => !a.isCorrect).map(a => a.questionId);
    const wrongQuestions = QUIZ_DATA.filter(q => wrongIds.includes(q.id));
    if (wrongQuestions.length > 0) {
      startNewGame(wrongQuestions);
    }
  };

  const handleReviewWrong = () => {
    const wrongIds = userAnswers.filter(a => !a.isCorrect).map(a => a.questionId);
    const wrongQuestions = QUIZ_DATA.filter(q => wrongIds.includes(q.id));
    
    if (wrongQuestions.length > 0) {
      setActiveQuestions(wrongQuestions);
      setCurrentIndex(0);
      setIsReviewMode(true);
      setGameState(GameState.PLAYING);
      // Keep existing user answers for review
      setShowQuestionGrid(false);
    }
  };

  if (gameState === GameState.START) return <StartScreen onStart={handleStart} />;
  
  if (gameState === GameState.FINISHED) return (
    <ResultScreen 
      userName={userName} 
      userAnswers={userAnswers} 
      onRetryAll={handleRetryAll}
      onRetryWrong={handleRetryWrong}
      onReviewWrong={handleReviewWrong}
    />
  );

  const currentQ = activeQuestions[currentIndex];
  const answer = userAnswers.find(a => a.questionId === currentQ.id);
  const isAnswered = !!answer;
  const isLast = currentIndex === activeQuestions.length - 1;

  // Calculate status for Grid
  const getQuestionStatus = (qId: number) => {
      if (currentQ.id === qId) return 'current';
      const ans = userAnswers.find(a => a.questionId === qId);
      if (ans) return ans.isCorrect ? 'correct' : 'incorrect';
      return 'unanswered';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 pb-32">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white px-4 sm:px-6 py-4 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-20">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 shrink-0">
                {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block font-bold text-slate-700 truncate max-w-[150px]">{userName}</div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
             {isReviewMode && (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Chế độ xem lại
                </span>
            )}
            <button 
                onClick={() => setShowQuestionGrid(true)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors text-slate-700 font-bold text-sm"
            >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Danh sách câu hỏi</span>
                <span className="inline sm:hidden">{currentIndex + 1}/{activeQuestions.length}</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Câu</span>
                <span className="font-black text-blue-600 text-lg">{currentIndex + 1}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-slate-500">{activeQuestions.length}</span>
            </div>
        </div>
      </div>

      <QuestionCard 
        question={currentQ} 
        onAnswer={handleAnswer} 
        isAnswered={isAnswered || isReviewMode} 
        userAnswer={answer?.userResponse}
        isReviewMode={isReviewMode}
      />

      {/* Navigation Grid Modal */}
      {showQuestionGrid && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                  <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800">Danh sách câu hỏi</h3>
                      <button onClick={() => setShowQuestionGrid(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-4 overflow-y-auto grid grid-cols-5 sm:grid-cols-8 gap-2">
                      {activeQuestions.map((q, idx) => {
                          const status = getQuestionStatus(q.id);
                          let bgClass = "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200";
                          if (status === 'current') bgClass = "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300";
                          else if (status === 'correct') bgClass = "bg-green-100 text-green-700 border-green-300";
                          else if (status === 'incorrect') bgClass = "bg-red-100 text-red-700 border-red-300";
                          else if (status === 'unanswered') bgClass = "bg-white text-slate-700 border-slate-300 border-dashed";

                          return (
                              <button 
                                key={q.id} 
                                onClick={() => handleJumpToQuestion(idx)}
                                className={`h-10 rounded-lg font-bold text-sm border ${bgClass} transition-all`}
                              >
                                  {idx + 1}
                              </button>
                          )
                      })}
                  </div>
                  <div className="p-4 border-t bg-slate-50 rounded-b-2xl text-xs flex gap-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div> Đúng</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div> Sai</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-slate-300 border-dashed rounded"></div> Chưa làm</div>
                  </div>
              </div>
          </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        <div className="w-full max-w-4xl mx-auto flex justify-between gap-3">
          <Button 
            onClick={handlePrev} 
            variant="outline" 
            disabled={currentIndex === 0}
            className="flex items-center px-4"
          >
            <ArrowLeft className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Trước</span>
          </Button>

          <div className="flex gap-3">
            {isAnswered || isReviewMode ? (
              !isLast ? (
                <Button onClick={handleNext} className="flex items-center shadow-blue-500/30">
                  Câu tiếp theo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleFinish} variant="secondary" className="flex items-center shadow-emerald-500/30">
                  {isReviewMode ? 'Kết thúc xem lại' : 'Nộp bài'} <CheckSquare className="w-4 h-4 ml-2" />
                </Button>
              )
            ) : (
              <Button variant="outline" onClick={handleSkip} className="text-slate-500 hover:text-slate-700 border-dashed hover:border-slate-400">
                Bỏ qua <Flag className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          
           {/* Placeholder for layout symmetry */}
           {isAnswered && !isLast && <div className="hidden sm:block w-[1px]"></div>}
        </div>
      </div>
    </div>
  );
};

export default App;