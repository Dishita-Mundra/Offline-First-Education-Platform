import React, { useEffect, useState } from 'react';
import { Users, BookOpen, PlusCircle, BarChart3, Search, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTeacherStudents } from '../services/api';

const TeacherDashboard = () => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setTeacherInfo(user);
    
    const loadData = async () => {
      try {
        const students = await fetchTeacherStudents();
        setEnrolledStudents(students);
      } catch (err) {
        console.error("Failed to load students", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredStudents = enrolledStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.schoolId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = enrolledStudents.length;
  // Unique courses count
  const allCourseIds = new Set();
  enrolledStudents.forEach(s => s.enrolledCourses.forEach(c => allCourseIds.add(c.courseId)));
  const activeCourses = allCourseIds.size;
  
  const avgProgress = totalStudents > 0 
    ? Math.round(enrolledStudents.reduce((acc, s) => acc + s.averageProgress, 0) / totalStudents) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {teacherInfo?.name || 'Teacher'}</h1>
        <p className="text-slate-500 mt-1">Teacher ID: {teacherInfo?.schoolId}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Enrolled Students</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalStudents}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Courses</p>
              <h3 className="text-2xl font-bold text-slate-900">{activeCourses}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Completion</p>
              <h3 className="text-2xl font-bold text-slate-900">{avgProgress}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Content Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 uppercase">Content Management</h2>
          <p className="text-sm text-slate-500">Create and manage your course materials</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/teacher/courses" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors">
            <PlusCircle className="w-8 h-8 mb-2" />
            <span className="font-bold">+ Create Course</span>
          </Link>
          <Link to="/teacher/courses" className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700">
            <BookOpen className="w-8 h-8 mb-2 text-purple-500" />
            <span className="font-bold">Manage Courses</span>
          </Link>
          <Link to="/teacher/courses" className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700">
            <svg className="w-8 h-8 mb-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <span className="font-bold">Upload Resource</span>
          </Link>
          <Link to="/teacher/courses" className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700">
            <svg className="w-8 h-8 mb-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-bold">Create Quiz</span>
          </Link>
        </div>
      </div>

      {/* Enrolled Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 uppercase">Enrolled Students</h2>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full rounded-md border border-slate-300 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">School ID</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Enrolled Courses</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                      <div className="text-xs">Loading records from database...</div>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                    <td className="px-6 py-4">{student.schoolId}</td>
                    <td className="px-6 py-4">Class {student.class} • {student.section}</td>
                    <td className="px-6 py-4">{student.enrolledCourses.length} {student.enrolledCourses.length === 1 ? 'Course' : 'Courses'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">{Math.round(student.averageProgress)}%</span>
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${student.averageProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'Never'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  ID: {selectedStudent.schoolId} • Class {selectedStudent.class} {selectedStudent.section}
                </p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Enrolled Courses</h3>
              
              <div className="space-y-4">
                {selectedStudent.enrolledCourses.map(course => (
                  <div key={course.courseId} className="border border-slate-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{course.courseTitle || 'Unknown Course'}</h4>
                        <p className="text-sm text-slate-500">Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-blue-600">{course.progress}%</span>
                        <span className="text-xs font-medium text-slate-500 uppercase">Progress</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Lessons</p>
                        <p className="text-sm font-semibold text-slate-900">Pending Sync</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Latest Quiz</p>
                        <p className="text-sm font-semibold text-slate-900">Pending Sync</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Last Activity</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedStudent.lastActivity ? new Date(selectedStudent.lastActivity).toLocaleDateString() : 'None'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Sync Status</p>
                        <p className="text-sm font-medium text-green-600 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span> Synced
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
