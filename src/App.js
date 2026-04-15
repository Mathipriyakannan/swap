import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import FeaturesPage from './components/FeaturesPage';
import AdminDashboard from './components/AdminDashboard';
import AdminUserRegisterForm from './components/AdminUserRegisterForm';
import OrderDashboard from './components/OrderDashboard';
import SwapKnowledgePosts from './components/SwapKnowledgePosts';
import SearchPage from './components/SearchPage';
import ConnectWithTeacher from './components/ConnectWithTeacher';
import SettingsPage from './components/SettingsPage';
import StaffListPage from './components/StaffListPage';
import DoubtFormPage from './components/DoubtFormPage';
import RoleSelectionPage from './components/RoleSelectionPage';
import AdminViewPage from './components/AdminViewPage';
import SendMessagePage from './components/SendMessagePage';
import ViewRequestPage from './components/ViewRequestPage';
import StaffLogin from './components/StaffLogin';
import StudentChatPage from './components/StudentChatPage';
import StudentMessagesPage from './components/StudentMessagesPage';
import ViewSentMessagesPage from './components/ViewSentMessagesPage';
import FeedbackPage from './components/FeedbackPage';
import StudentProfilePage from './components/StudentProfilePage';
import AdminViewFeedback from './components/AdminViewFeedback';
import MeetRoom from './components/MeetRoom';
import CreatePostPage from "./components/CreatePostPage";
import PopularPosts from "./components/PopularPosts";
import SocialFeedPage from './components/SocialFeedPage';
import StaffPostPage from "./components/StaffPostPage";
import StudentPostPage from './components/StudentPostPage';
import StudentMyPosts from './components/StudentMyPosts';
import StudentViewPage from './components/StudentViewPage'; 
import LoginFormm from './components/LoginFormm';
import UserDataTable from './components/UserDataTable';
import ManagerLogin from "./components/ManagerLogin";
import ApprovalPage from "./components/ApprovalPage";
import StaffDetailsPage from './components/StaffDetailsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
            <Route path="/admin/approvals" element={<ApprovalPage />} />
            <Route path="/login/:userType" element={<LoginFormm />} />
<Route path="/student-details" element={<UserDataTable />} />   
     <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/register-user" element={<AdminUserRegisterForm />} />
        <Route path="/swap-posts" element={<SwapKnowledgePosts />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/admin/order-dashboard" element={<OrderDashboard />} />
        <Route path="/connect/:staffId" element={<ConnectWithTeacher />} />
        <Route path="/google-meet" element={<ConnectWithTeacher />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/staff/:subject" element={<StaffListPage />} />
        <Route path="/form/:subject/:staff" element={<DoubtFormPage />} />
        <Route path="/choose-role" element={<RoleSelectionPage />} />
        <Route path="/admin/message-student/:id" element={<SendMessagePage />} />
        <Route path="/student/messages" element={<StudentMessagesPage />} />
        <Route path="/admin/view-requests/:studentId" element={<ViewRequestPage />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/admin/view/:id" element={<AdminViewPage />} />
        <Route path="/student/chat" element={<StudentChatPage />} />
        <Route path="/admin/sent-messages" element={<ViewSentMessagesPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/my-profile" element={<StudentProfilePage />} />
        <Route path="/student/view/:id" element={<StudentViewPage />} />    
        <Route path="/admin/view-feedbacks" element={<AdminViewFeedback />} />
        <Route path="/student/meet-room" element={<MeetRoom />} />
        <Route path="/social-feed" element={<SocialFeedPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
                 <Route path="/popular" element={<PopularPosts />} />
                 <Route path="/admin/staff-post" element={<StaffPostPage />} />
                 <Route path="/student-post" element={<StudentPostPage />} />
                   <Route path="/manager" element={<ManagerLogin />} />
       <Route path="/my-posts" element={<StudentMyPosts />} />
         <Route path="/staff-details" element={<StaffDetailsPage />} />
      </Routes>

    </Router>
  );
  
};

export default App;
