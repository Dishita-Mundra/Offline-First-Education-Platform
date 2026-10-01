import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDownloads, removeDownload } from '../db/db';
import { Trash2, HardDrive, CheckCircle, ArrowRight, PlayCircle, FileText, HelpCircle, BarChart2 } from 'lucide-react';

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    const dls = await getDownloads();
    setDownloads(dls);
  };

  const handleRemove = async (id) => {
    if (window.confirm('Remove this video? You will need internet to watch it again.')) {
      await removeDownload(id);
      loadDownloads();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Offline Library</h1>
          <p className="text-slate-500 mt-2">Manage your device storage and offline materials</p>
        </div>
      </div>

      {/* Always Available Section */}
      <section>
        <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">Always Available</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-600 mb-6">
            The following core materials are automatically saved to your device as you browse, ensuring you can always learn even without internet.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Study Notes</h3>
                <p className="text-xs text-slate-500 mt-1">Lesson text and key takeaways</p>
                <span className="inline-flex items-center text-xs font-bold text-green-600 mt-2"><CheckCircle className="w-3 h-3 mr-1" /> Ready</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg mr-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Practice Tests</h3>
                <p className="text-xs text-slate-500 mt-1">All course quizzes</p>
                <span className="inline-flex items-center text-xs font-bold text-green-600 mt-2"><CheckCircle className="w-3 h-3 mr-1" /> Ready</span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg mr-4">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Progress</h3>
                <p className="text-xs text-slate-500 mt-1">Completion & scores</p>
                <span className="inline-flex items-center text-xs font-bold text-green-600 mt-2"><CheckCircle className="w-3 h-3 mr-1" /> Saving Locally</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Downloads Section */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Optional Downloads</h2>
          <div className="text-xs font-bold text-slate-500">
            <HardDrive className="w-4 h-4 inline mr-1" />
            Storage Used: {downloads.length > 0 ? (downloads.length * 45) : 0} MB
          </div>
        </div>
        
        {downloads.length === 0 ? (
          <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
              <PlayCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">No videos downloaded</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">
              You haven't downloaded any large media files. You can still access all text lessons and tests offline.
            </p>
            <Link to="/student/courses" className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            {downloads.map(dl => (
              <div key={dl.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center mr-4 shrink-0 relative overflow-hidden">
                    <PlayCircle className="w-6 h-6 z-10 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                      Video Lesson
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{dl.title}</h3>
                    <div className="text-sm text-slate-500 mt-1 flex items-center">
                      <span>{dl.size || '45 MB'}</span>
                      <span className="mx-2">•</span>
                      <span className="text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Available Offline</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-16 sm:ml-0">
                  <Link
                    to={`/student/lesson/${dl.lessonId}`}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors flex items-center"
                  >
                    Watch <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                  <button
                    onClick={() => handleRemove(dl.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove video"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DownloadsPage;
