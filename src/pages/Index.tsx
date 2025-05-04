
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { BookOpen, GraduationCap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageContainer className="text-center">
      <div className="flex flex-col items-center justify-center space-y-8 pt-10">
        <div className="relative">
          <div className="absolute inset-0 bg-teacher-purple/20 blur-xl rounded-full"></div>
          <div className="relative bg-white p-6 rounded-full shadow-lg animate-float">
            <GraduationCap size={56} className="text-teacher-purple" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-teacher-purple">
          Welcome to your Teacher Companion!
        </h1>
        
        <div className="max-w-2xl">
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Let's get started with understanding the context of your classroom. 
            After that, please record a 1-minute video of yourself teaching the concept so we can give you feedback!
          </p>
        </div>
        
        <div className="flex gap-4 items-center justify-center">
          <Button 
            onClick={() => navigate('/teacher-form')} 
            className="bg-gradient-to-r from-teacher-purple to-teacher-blue hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all"
          >
            Let's Get Started
            <BookOpen className="ml-2" />
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-primary/10">
            <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <span className="text-teacher-purple font-bold text-lg">1</span>
            </div>
            <h3 className="text-lg font-semibold text-teacher-purple mb-2">Tell Us About You</h3>
            <p className="text-gray-500">Share your teaching experience and the subjects you teach</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-primary/10">
            <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <span className="text-teacher-purple font-bold text-lg">2</span>
            </div>
            <h3 className="text-lg font-semibold text-teacher-purple mb-2">Tell Us About Your Students</h3>
            <p className="text-gray-500">Help us understand your classroom's composition</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-primary/10">
            <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <span className="text-teacher-purple font-bold text-lg">3</span>
            </div>
            <h3 className="text-lg font-semibold text-teacher-purple mb-2">Record Your Teaching</h3>
            <p className="text-gray-500">Share a short video of your teaching style for feedback</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
