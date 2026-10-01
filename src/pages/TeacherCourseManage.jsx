import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, FileText, Upload, HelpCircle, Edit, Trash2, CheckCircle } from 'lucide-react';
const API_URL = 'http://localhost:5000/api';

const TeacherCourseManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lessons');

  // Modals state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Forms
  const [newLesson, setNewLesson] = useState({ title: '', chapter: '', description: '', notesContent: '', videoUrl: '' });
  const [resourceFile, setResourceFile] = useState(null);
  const [newQuiz, setNewQuiz] = useState({ title: '', description: '', questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }] });

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${API_URL}/teacher/courses/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setCourseData(data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const publishCourse = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const newStatus = courseData.course.status === 'published' ? 'draft' : 'published';
      await fetch(`${API_URL}/teacher/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ status: newStatus })
      });
      fetchCourseDetails();
    } catch(err) { console.error(err); }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await fetch(`${API_URL}/teacher/courses/${id}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(newLesson)
      });
      setShowLessonModal(false);
      setNewLesson({ title: '', chapter: '', description: '', notesContent: '', videoUrl: '' });
      fetchCourseDetails();
    } catch(err) { console.error(err); }
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();
    if(!resourceFile) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('file', resourceFile);
      formData.append('courseId', id);
      
      await fetch(`${API_URL}/teacher/resources/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formData
      });
      setShowResourceModal(false);
      setResourceFile(null);
      fetchCourseDetails();
    } catch(err) { console.error(err); }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await fetch(`${API_URL}/teacher/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ ...newQuiz, courseId: id, status: 'published' })
      });
      setShowQuizModal(false);
      fetchCourseDetails();
    } catch(err) { console.error(err); }
  };

  if(loading) return <div className="p-12 text-center text-slate-500">Loading course manager...</div>;
  if(!courseData) return <div className="p-12 text-center text-red-500">Course not found.</div>;

  const { course, lessons, quizzes, resources } = courseData;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/teacher/courses')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
          <p className="text-slate-500">Class {course.class} • {course.subject}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button onClick={publishCourse} className={`px-4 py-2 font-medium rounded-lg ${course.status === 'published' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
            {course.status === 'published' ? 'Unpublish' : 'Publish Course'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button onClick={() => setActiveTab('lessons')} className={`px-6 py-4 font-medium text-sm ${activeTab === 'lessons' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Lessons & Content</button>
          <button onClick={() => setActiveTab('resources')} className={`px-6 py-4 font-medium text-sm ${activeTab === 'resources' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Learning Resources</button>
          <button onClick={() => setActiveTab('quizzes')} className={`px-6 py-4 font-medium text-sm ${activeTab === 'quizzes' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Quizzes</button>
        </div>
        
        <div className="p-6">
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Course Lessons</h3>
                <button onClick={() => setShowLessonModal(true)} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                  <PlusCircle className="w-4 h-4 mr-1" /> Add Lesson
                </button>
              </div>
              {lessons.length === 0 ? <p className="text-slate-500 text-sm">No lessons created yet.</p> : (
                <div className="space-y-3">
                  {lessons.map((lesson, idx) => (
                    <div key={lesson._id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">{idx+1}</div>
                        <div>
                          <p className="font-bold text-slate-800">{lesson.title}</p>
                          <p className="text-xs text-slate-500">{lesson.chapter}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.videoUrl && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">Video</span>}
                        {lesson.notesContent && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">Notes</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">PDFs & Documents</h3>
                <button onClick={() => setShowResourceModal(true)} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                  <Upload className="w-4 h-4 mr-1" /> Upload Resource
                </button>
              </div>
              {resources.length === 0 ? <p className="text-slate-500 text-sm">No resources uploaded yet.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map(res => (
                    <div key={res._id} className="p-4 border border-slate-200 rounded-lg flex items-center gap-3">
                      <FileText className="w-8 h-8 text-red-500" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm truncate w-48">{res.fileName}</p>
                        <p className="text-xs text-slate-500">{(res.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Quizzes</h3>
                <button onClick={() => setShowQuizModal(true)} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                  <PlusCircle className="w-4 h-4 mr-1" /> Create Quiz
                </button>
              </div>
              {quizzes.length === 0 ? <p className="text-slate-500 text-sm">No quizzes created yet.</p> : (
                <div className="space-y-3">
                  {quizzes.map(quiz => (
                    <div key={quiz._id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="font-bold text-slate-800">{quiz.title}</p>
                          <p className="text-xs text-slate-500">{quiz.questions.length} Questions</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Published</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b font-bold text-lg flex justify-between">
              Add Lesson
              <button onClick={() => setShowLessonModal(false)}>&times;</button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              <input type="text" placeholder="Lesson Title" className="w-full border p-2 rounded" value={newLesson.title} onChange={e=>setNewLesson({...newLesson, title: e.target.value})} />
              <input type="text" placeholder="Chapter (Optional)" className="w-full border p-2 rounded" value={newLesson.chapter} onChange={e=>setNewLesson({...newLesson, chapter: e.target.value})} />
              <textarea placeholder="Lesson Text / Notes (Supports Offline Reading)" rows="5" className="w-full border p-2 rounded" value={newLesson.notesContent} onChange={e=>setNewLesson({...newLesson, notesContent: e.target.value})}></textarea>
              <input type="text" placeholder="Video URL (Optional)" className="w-full border p-2 rounded" value={newLesson.videoUrl} onChange={e=>setNewLesson({...newLesson, videoUrl: e.target.value})} />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={handleCreateLesson} className="bg-blue-600 text-white px-4 py-2 rounded">Save Lesson</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="font-bold text-lg mb-4">Upload Resource</h2>
            <input type="file" onChange={e => setResourceFile(e.target.files[0])} className="w-full border p-2 mb-4 rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowResourceModal(false)} className="px-4 py-2">Cancel</button>
              <button onClick={handleUploadResource} className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Basic Quiz Modal (Prototype) */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b font-bold text-lg flex justify-between">
              Create Quiz
              <button onClick={() => setShowQuizModal(false)}>&times;</button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              <input type="text" placeholder="Quiz Title" className="w-full border p-2 rounded" value={newQuiz.title} onChange={e=>setNewQuiz({...newQuiz, title: e.target.value})} />
              <div className="border p-4 rounded bg-slate-50 space-y-2">
                <h4 className="font-bold">Question 1</h4>
                <input type="text" placeholder="Question text" className="w-full border p-2 rounded" value={newQuiz.questions[0].question} onChange={e=>{
                  const q = [...newQuiz.questions]; q[0].question = e.target.value; setNewQuiz({...newQuiz, questions: q});
                }} />
                {newQuiz.questions[0].options.map((opt, i) => (
                  <input key={i} type="text" placeholder={`Option ${i+1}`} className="w-full border p-2 rounded" value={opt} onChange={e=>{
                    const q = [...newQuiz.questions]; q[0].options[i] = e.target.value; setNewQuiz({...newQuiz, questions: q});
                  }} />
                ))}
                <input type="text" placeholder="Correct Answer (Must match exactly one option)" className="w-full border p-2 rounded" value={newQuiz.questions[0].correctAnswer} onChange={e=>{
                  const q = [...newQuiz.questions]; q[0].correctAnswer = e.target.value; setNewQuiz({...newQuiz, questions: q});
                }} />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={handleCreateQuiz} className="bg-blue-600 text-white px-4 py-2 rounded">Save Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourseManage;
