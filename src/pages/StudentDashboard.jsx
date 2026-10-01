import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen, CheckCircle, Clock, FileText, Download, ArrowRight, HardDrive, Zap } from 'lucide-react';
import { fetchStudentCourses } from '../services/api';

const StudentDashboard = () => {
  const { isOnline } = useAppContext();
  const [courses, setCourses] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real scenario we'd fetch this from IDB for offline
  const [downloads] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setStudentInfo(user);

    const loadData = async () => {
      try {
        if (user && user._id) {
          if (isOnline) {
             const { syncInboundData } = await import('../services/syncService');
             await syncInboundData(user._id);
          }
          const crs = await fetchStudentCourses(user._id);
          setCourses(crs);
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const videoDownloads = downloads.filter(d => d.type === 'video').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header - Compact */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Good morning, {studentInfo?.name || 'Student'} 👋</h1>
          <p className="text-sm text-slate-500 mt-0.5">Class {studentInfo?.class || '8'} • Section {studentInfo?.section || 'A'}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg flex items-center text-sm font-bold border ${isOnline ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
          {isOnline ? (
            <><div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div> Online · Sync up to date</>
          ) : (
            <><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Offline · Changes saved locally</>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area: 8 cols (approx 66%) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Small Offline Banner */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg shadow-sm border border-slate-700 p-4 text-white flex items-start sm:items-center">
            <Zap className="w-5 h-5 text-amber-400 mr-3 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-bold text-sm">Ready for offline learning</p>
              <p className="text-xs text-slate-300 mt-0.5">Your notes, practice tests and learning progress are available even without internet.</p>
            </div>
          </div>
          
          {/* My Enrolled Courses */}
          <section>
            <h2 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-3 ml-1 mt-2">My Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 text-center text-slate-500 py-8">Loading enrolled courses...</div>
              ) : courses.length === 0 ? (
                <div className="col-span-2 text-center text-slate-500 py-8 bg-white rounded-lg border border-slate-200">
                  You are not enrolled in any courses yet.
                </div>
              ) : (
                courses.map((course) => {
                  const progress = 0; // Future enhancement: fetch real progress
                  return (
                    <div key={course._id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:border-blue-300 transition-colors flex flex-col h-full">
                      <div className="mb-3">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{course.subject}</span>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight mt-1">{course.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{course.description}</p>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-medium text-slate-600">{progress}% complete</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        
                        <Link 
                          to={`/student/course/${course._id}`}
                          className="w-full inline-flex justify-center items-center px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-bold text-sm hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          {progress > 0 ? 'Continue' : 'Start Course'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: 4 cols (approx 33%) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center">
                <HardDrive className="w-4 h-4 mr-2 text-slate-500" />
                Offline Ready
              </h2>
            </div>
            
            <div className="p-4 sm:p-5">
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Always Available Offline</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-center text-sm font-medium text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2.5 shrink-0" /> Notes
                  </li>
                  <li className="flex items-center text-sm font-medium text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2.5 shrink-0" /> Practice Tests
                  </li>
                  <li className="flex items-center text-sm font-medium text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2.5 shrink-0" /> Quizzes
                  </li>
                  <li className="flex items-center text-sm font-medium text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2.5 shrink-0" /> Learning Progress
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Optional Downloads</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-center justify-between text-sm text-slate-600">
                    <span className="flex items-center">
                      <Download className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" /> Videos
                    </span>
                    <span className="font-bold text-slate-900">{videoDownloads} downloaded</span>
                  </li>
                  <li className="flex items-center justify-between text-sm text-slate-600">
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" /> PDFs
                    </span>
                    <span className="font-bold text-slate-900">0 downloaded</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/student/downloads" 
                className="block text-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors py-2 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                Manage Offline Content <ArrowRight className="w-3 h-3 inline ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
