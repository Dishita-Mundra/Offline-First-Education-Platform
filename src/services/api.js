const API_URL = '/api';

export const login = async (schoolId, password, role) => {
  let response;
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId, password, role })
    });
  } catch (error) {
    throw new Error('Unable to connect to the server. Please try again.');
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Invalid response from server. Please try again.');
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Invalid response from server. Please try again.');
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Login failed');
  }
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchTeacherStudents = async () => {
  const response = await fetch(`${API_URL}/teacher/students`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
};

export const fetchCourseStudents = async (courseId) => {
  const response = await fetch(`${API_URL}/teacher/courses/${courseId}/students`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch course students');
  return response.json();
};

export const enrollStudent = async (courseId, studentId) => {
  const response = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentId })
  });
  if (!response.ok) throw new Error('Failed to enroll student');
  return response.json();
};

export const removeStudent = async (courseId, studentId) => {
  const response = await fetch(`${API_URL}/courses/${courseId}/students/${studentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to remove student');
  return response.json();
};

export const fetchStudentCourses = async (studentId) => {
  const response = await fetch(`${API_URL}/students/${studentId}/courses`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch student courses');
  return response.json();
};

export const fetchStudentOfflineData = async (studentId) => {
  const response = await fetch(`${API_URL}/students/${studentId}/offline-data`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch offline data');
  return response.json();
};

export const syncData = async (queue) => {
  const response = await fetch(`${API_URL}/sync`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ queue })
  });
  if (!response.ok) throw new Error('Failed to sync data');
  return response.json();
};
