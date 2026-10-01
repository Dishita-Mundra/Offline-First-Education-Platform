import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse, getLessonsByCourse, markDownloaded, isDownloaded, removeDownload } from '../db/db';
import { useAppContext } from '../context/AppContext';
import { Download, CheckCircle, ChevronRight, BookOpen, AlertCircle, FileText, PlayCircle, HelpCircle } from 'lucide-react';

const CourseView = () => {
  const { id } = useParams();
  const { isOnline } = useAppContext();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [downloadStatus, setDownloadStatus] = useState({});
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const c = await getCourse(id);
      setCourse(c);
      
      const ls = await getLessonsByCourse(id);
      setLessons(ls);

      const status = {};
      for (const lesson of ls) {
        if (lesson.hasVideo) {
          status[lesson.id] = await isDownloaded(`video_${lesson.id}`);
        }
      }
      setDownloadStatus(status);
    };
    loadData();
  }, [id]);

  const handleDownloadVideo = async (lesson) => {
    if (!isOnline) {
      alert("You need to be online to download videos.");
      return;
    }
    
    setDownloading(prev => ({ ...prev, [lesson.id]: 0 }));

    // Simulate download progress
    for (let i = 10; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 300));
      setDownloading(prev => ({ ...prev, [lesson.id]: i }));
    }

    await markDownloaded({
      id: `video_${lesson.id}`,
      type: 'video',
      lessonId: lesson.id,
      courseId: id,
      title: `${course.title} - ${lesson.title} Video`,
      size: lesson.videoSize || '45 MB'
    });
    
    setDownloadStatus(prev => ({ ...prev, [lesson.id]: true }));
    setDownloading(prev => {
      const newState = { ...prev };
      delete newState[lesson.id];
      return newState;
    });
  };

  if (!course) return <div className="p-8 text-center text-slate-500">Loading course...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-800 px-6 py-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <BookOpen className="w-64 h-64 -mr-16 -mt-16" />
          </div>
          <div className="relative z-10">
            <span className="bg-blue-700 text-blue-100 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              {course.subject} • Class {course.class}
            </span>
            <h1 className="text-3xl font-bold mt-4 mb-2">{course.title}</h1>
            <p className="text-blue-100 max-w-2xl text-lg">{course.description}</p>
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Lessons</h2>
        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            const hasVideo = lesson.hasVideo;
            const videoDownloaded = downloadStatus[lesson.id];
            const isDownloading = downloading[lesson.id] !== undefined;
            const progress = downloading[lesson.id];
            
            return (
              <div key={lesson.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between border-b border-slate-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center mr-4 shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-slate-500">{lesson.description}</p>
                    </div>
                  </div>
                  <Link 
                    to={`/student/lesson/${lesson.id}`}
                    className="hidden sm:flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    Open Lesson <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="p-4 sm:p-5 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Always Available Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-slate-400 mr-3" />
                        <span className="text-sm font-bold text-slate-800">Study Notes & Text</span>
                      </div>
                      <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3 mr-1" /> Available Offline
                      </span>
                    </div>
                    
                    {lesson.quiz && (
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <HelpCircle className="w-5 h-5 text-slate-400 mr-3" />
                          <span className="text-sm font-bold text-slate-800">Practice Test</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3 mr-1" /> Available Offline
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Optional Download Section */}
                  {hasVideo && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-slate-200 h-full">
                        <div className="flex items-center mb-3 sm:mb-0">
                          <PlayCircle className="w-5 h-5 text-blue-500 mr-3" />
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Video Lesson</span>
                            <span className="text-xs text-slate-500">{lesson.videoSize}</span>
                          </div>
                        </div>
                        
                        <div className="shrink-0 w-full sm:w-auto">
                          {videoDownloaded ? (
                            <span className="flex items-center justify-center text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded border border-green-100">
                              <CheckCircle className="w-4 h-4 mr-1.5" /> Video Available Offline
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDownloadVideo(lesson)}
                              disabled={isDownloading || !isOnline}
                              className={`w-full sm:w-auto flex items-center justify-center px-3 py-2 rounded text-xs font-bold transition-colors ${
                                !isOnline ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                isDownloading ? 'bg-blue-50 text-blue-600 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {isDownloading ? (
                                `Downloading... ${progress}%`
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5 mr-1.5" />
                                  Download for Offline
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Mobile open button */}
                <div className="sm:hidden p-4 border-t border-slate-200 bg-white">
                  <Link 
                    to={`/student/lesson/${lesson.id}`}
                    className="flex justify-center items-center w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm"
                  >
                    Open Lesson
                  </Link>
                </div>
                
                {isDownloading && (
                  <div className="w-full bg-slate-200 h-1">
                    <div className="bg-blue-600 h-1 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
