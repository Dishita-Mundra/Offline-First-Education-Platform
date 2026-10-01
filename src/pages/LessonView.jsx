import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLesson, getCourse, saveProgress, addToSyncQueue, saveQuizAttempt, getQuizAttempts, isDownloaded } from '../db/db';
import { useAppContext } from '../context/AppContext';
import { PlayCircle, FileText, HelpCircle, ArrowLeft, CheckCircle, WifiOff } from 'lucide-react';

const LessonView = () => {
  const { id } = useParams();
  const { isOnline } = useAppContext();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('lesson'); // lesson, notes, quiz, video
  
  // Video state
  const [videoDownloaded, setVideoDownloaded] = useState(false);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [previousAttempt, setPreviousAttempt] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const l = await getLesson(id);
      setLesson(l);
      if (l) {
        const c = await getCourse(l.courseId);
        setCourse(c);
        
        if (l.hasVideo) {
          const downloaded = await isDownloaded(`video_${l.id}`);
          setVideoDownloaded(downloaded);
        }

        // Set default tab based on whether video exists
        if (!l.hasVideo && activeTab === 'video') {
          setActiveTab('lesson');
        } else if (l.hasVideo) {
          setActiveTab('video');
        }

        // Update progress just by opening
        handleProgressUpdate(l.id, 20);

        // Check if quiz already attempted
        if (l.quiz) {
          const attempts = await getQuizAttempts(l.id);
          if (attempts.length > 0) {
            // Get latest attempt
            const latest = attempts[attempts.length - 1];
            setPreviousAttempt(latest);
            setQuizSubmitted(true);
            setQuizScore(latest.score);
          }
        }
      }
    };
    loadData();
  }, [id]);

  const handleProgressUpdate = async (lessonId, percent) => {
    await saveProgress(lessonId, percent);
    if (!isOnline) {
      await addToSyncQueue('update_progress', { lessonId, percent });
    } else {
      console.log('Online: Progress updated directly to backend', { lessonId, percent });
    }
  };

  const handleQuizSubmit = async () => {
    if (!lesson.quiz) return;
    
    let score = 0;
    lesson.quiz.questions.forEach((q, idx) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const attemptData = {
      lessonId: lesson.id,
      courseId: lesson.courseId,
      answers: quizAnswers,
      score: score,
      total: lesson.quiz.questions.length
    };

    await saveQuizAttempt(attemptData);
    await handleProgressUpdate(lesson.id, 100); 

    if (!isOnline) {
      await addToSyncQueue('submit_quiz', attemptData);
    }
  };

  const handleQuizOptionChange = (questionId, option) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  if (!lesson || !course) return <div className="p-8 text-center text-slate-500">Loading lesson...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <Link to={`/student/course/${course.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to {course.title}
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
            <p className="text-slate-500 mt-1">{lesson.description}</p>
          </div>
          {!isOnline && (
            <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4 mr-1.5" /> Saved Locally
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6 flex flex-wrap space-x-2 sm:space-x-6">
          {lesson.hasVideo && (
            <button 
              onClick={() => setActiveTab('video')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'video' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <PlayCircle className="w-4 h-4 mr-2" /> Video
            </button>
          )}
          <button 
            onClick={() => setActiveTab('lesson')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'lesson' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <FileText className="w-4 h-4 mr-2" /> Read Lesson
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'notes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <FileText className="w-4 h-4 mr-2" /> Study Notes
          </button>
          {lesson.quiz && (
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'quiz' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <HelpCircle className="w-4 h-4 mr-2" /> Practice Test
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[400px]">
          {activeTab === 'video' && lesson.hasVideo && (
            <div className="h-full flex flex-col">
              {isOnline || videoDownloaded ? (
                <div className="w-full aspect-video bg-slate-900 rounded-lg relative flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white font-medium">Video Player</p>
                    {videoDownloaded && !isOnline && (
                      <div className="mt-2 text-xs text-green-400 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Playing from local download
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                  <WifiOff className="w-12 h-12 text-slate-400 mb-3" />
                  <h3 className="text-lg font-bold text-slate-700 mb-1">Video Not Available Offline</h3>
                  <p className="text-slate-500 text-sm max-w-md text-center">
                    Connect to the internet to download this video, or switch to the <b>Read Lesson</b> or <b>Study Notes</b> tabs to continue learning offline.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lesson' && (
            <div className="prose prose-slate max-w-none">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Lesson Text</h3>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <p className="text-slate-700 whitespace-pre-line text-lg leading-relaxed">{lesson.content}</p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" /> Key Takeaways
              </h3>
              <p className="text-yellow-900 whitespace-pre-line text-lg">{lesson.notes}</p>
            </div>
          )}

          {activeTab === 'quiz' && lesson.quiz && (
            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-slate-900">Practice Test</h3>
                {!isOnline && (
                  <span className="text-xs font-medium text-slate-500 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" /> Auto-saving locally
                  </span>
                )}
              </div>
              
              {quizSubmitted ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center max-w-md mx-auto mt-8">
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold">{quizScore}/{lesson.quiz.questions.length}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Test Completed!</h4>
                  <p className="text-slate-600 text-sm mb-6">Score saved on this device.</p>
                  
                  {!isOnline && (
                    <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 text-sm font-bold rounded-lg border border-amber-200 w-full justify-center">
                      Pending Sync
                    </div>
                  )}
                  {isOnline && previousAttempt && (
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-lg border border-green-200 w-full justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Test result synced
                    </div>
                  )}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <button 
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Retake Test
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {lesson.quiz.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                      <p className="font-bold text-slate-800 mb-5 text-lg">{idx + 1}. {q.question}</p>
                      <div className="space-y-3">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${quizAnswers[q.id] === opt ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' : 'hover:bg-slate-50 border-slate-200'}`}>
                            <input 
                              type="radio" 
                              name={q.id} 
                              value={opt}
                              checked={quizAnswers[q.id] === opt}
                              onChange={() => handleQuizOptionChange(q.id, opt)}
                              className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-slate-700 font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                      className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
                    >
                      Submit Test
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
