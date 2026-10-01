import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Settings, Users, ArrowRight } from 'lucide-react';
// We'll assume a fetch utility or just use fetch API
const API_URL = 'http://localhost:5000/api';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Course State
  const [newCourse, setNewCourse] = useState({ title: '', subject: '', class: '', section: '', description: '', status: 'draft' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      if(!token) return;

      const response = await fetch(`${API_URL}/teacher/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_URL}/teacher/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(newCourse)
      });
      if(response.ok) {
        setShowCreateModal(false);
        fetchCourses();
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Course
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Courses Yet</h3>
          <p className="text-slate-500 mb-6">Create your first course to start teaching.</p>
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
              <div className="h-32 bg-slate-100 border-b border-slate-200 flex items-center justify-center relative">
                {course.status === 'published' ? (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Published</span>
                ) : (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">Draft</span>
                )}
                <BookOpen className="w-12 h-12 text-slate-300" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">
                  Class {course.class} {course.section ? `- Sec ${course.section}` : ''} • {course.subject}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{course.title}</h3>
                
                <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center"><BookOpen className="w-3 h-3 mr-1"/> Lessons</p>
                    <p className="font-semibold text-slate-700">{course.lessonsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center"><Users className="w-3 h-3 mr-1"/> Students</p>
                    <p className="font-semibold text-slate-700">{course.studentsCount}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1 flex items-center">Avg. Progress</p>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden mr-2">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.avgProgress}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{course.avgProgress}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button 
                  onClick={() => navigate(`/teacher/courses/${course._id}`)}
                  className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Manage Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Create New Course</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
            </div>
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                <input required type="text" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Linear Equations" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input required type="text" value={newCourse.subject} onChange={e => setNewCourse({...newCourse, subject: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Mathematics" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                  <input required type="text" value={newCourse.class} onChange={e => setNewCourse({...newCourse, class: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. 8" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Course description..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-md">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
