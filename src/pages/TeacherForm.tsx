
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { ProgressBar } from "@/components/ProgressBar";
import { CheckCircle, User, Users, School } from "lucide-react";

const TeacherForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Teacher information
    name: '',
    grade: '',
    subject: '',
    topics: '',
    language: '',
    yearsTeaching: '',
    
    // Student information
    numStudents: '',
    numBoys: '',
    numGirls: '',
    expectedAttendance: '',
    competence: '',
    
    // Challenges
    challenges: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/video-recording');
  };

  return (
    <PageContainer>
      <ProgressBar currentStep={2} totalSteps={3} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teacher-purple mb-2">Teacher Profile Questionnaire</h1>
        <p className="text-gray-600">Please fill out this form to help us understand your teaching context better.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Teacher Information Section */}
        <div className="section-card">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-teacher-purple mr-2" />
            <h2 className="text-xl font-semibold text-teacher-purple">Tell me about yourself...</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="grade" className="form-label">Grade</label>
              <input
                id="grade"
                name="grade"
                type="text"
                required
                className="form-input"
                value={formData.grade}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="form-input"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="topics" className="form-label">Topics being covered</label>
              <input
                id="topics"
                name="topics"
                type="text"
                required
                className="form-input"
                value={formData.topics}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="language" className="form-label">Language of instruction</label>
              <input
                id="language"
                name="language"
                type="text"
                required
                className="form-input"
                value={formData.language}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="yearsTeaching" className="form-label">How many years have you been teaching this grade?</label>
              <input
                id="yearsTeaching"
                name="yearsTeaching"
                type="number"
                min="0"
                required
                className="form-input"
                value={formData.yearsTeaching}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Students Information Section */}
        <div className="section-card">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-teacher-blue mr-2" />
            <h2 className="text-xl font-semibold text-teacher-blue">Tell me about your students...</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
              <label htmlFor="numStudents" className="form-label">Number of students</label>
              <input
                id="numStudents"
                name="numStudents"
                type="number"
                min="0"
                required
                className="form-input"
                value={formData.numStudents}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="numBoys" className="form-label">Number of boys</label>
              <input
                id="numBoys"
                name="numBoys"
                type="number"
                min="0"
                required
                className="form-input"
                value={formData.numBoys}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="numGirls" className="form-label">Number of girls</label>
              <input
                id="numGirls"
                name="numGirls"
                type="number"
                min="0"
                required
                className="form-input"
                value={formData.numGirls}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="expectedAttendance" className="form-label">Expected Attendance (%)</label>
              <input
                id="expectedAttendance"
                name="expectedAttendance"
                type="number"
                min="0"
                max="100"
                required
                className="form-input"
                value={formData.expectedAttendance}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group md:col-span-2">
              <label htmlFor="competence" className="form-label">Grade level competence of students</label>
              <input
                id="competence"
                name="competence"
                type="text"
                required
                className="form-input"
                value={formData.competence}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Challenges Section */}
        <div className="section-card">
          <div className="flex items-center mb-4">
            <School className="h-6 w-6 text-teacher-teal mr-2" />
            <h2 className="text-xl font-semibold text-teacher-teal">What are the challenges you face in the classroom?</h2>
          </div>
          
          <div className="input-group">
            <label htmlFor="challenges" className="form-label">
              E.g., student engagement is usually low, students don't show up on time etc.
            </label>
            <textarea
              id="challenges"
              name="challenges"
              rows={4}
              required
              className="form-input"
              value={formData.challenges}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            type="submit"
            className="bg-gradient-to-r from-teacher-purple to-teacher-blue text-white px-8 py-3 rounded-xl text-lg shadow-lg hover:opacity-90 transition-all"
          >
            Continue to Video Recording
            <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default TeacherForm;
