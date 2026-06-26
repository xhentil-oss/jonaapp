import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import OnboardingScreen from './pages/OnboardingScreen'
import LoginScreen from './pages/LoginScreen'
import RegisterScreen from './pages/RegisterScreen'
import ForgotPasswordScreen from './pages/ForgotPasswordScreen'
import HomeScreen from './pages/HomeScreen'
import CategoriesScreen from './pages/CategoriesScreen'
import CourseListScreen from './pages/CourseListScreen'
import CourseDetailScreen from './pages/CourseDetailScreen'
import PaywallScreen from './pages/PaywallScreen'
import LessonPlayerScreen from './pages/LessonPlayerScreen'
import MyCoursesScreen from './pages/MyCoursesScreen'
import CertificatesScreen from './pages/CertificatesScreen'
import ProfileScreen from './pages/ProfileScreen'
import SettingsScreen from './pages/SettingsScreen'
import CheckoutScreen from './pages/CheckoutScreen'
import EditProfileScreen from './pages/EditProfileScreen'
import EditPasswordScreen from './pages/EditPasswordScreen'
import EditEmailScreen from './pages/EditEmailScreen'
import SearchScreen from './pages/SearchScreen'
import NotificationsScreen from './pages/NotificationsScreen'
import VideoQualityScreen from './pages/VideoQualityScreen'
import DownloadsScreen from './pages/DownloadsScreen'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/categories" element={<CategoriesScreen />} />
          <Route path="/courses" element={<CourseListScreen />} />
          <Route path="/course/:id" element={<CourseDetailScreen />} />
          <Route path="/paywall" element={<PaywallScreen />} />
          <Route path="/lesson/:id" element={<LessonPlayerScreen />} />
          <Route path="/my-courses" element={<MyCoursesScreen />} />
          <Route path="/certificates" element={<CertificatesScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/checkout/:id" element={<CheckoutScreen />} />
          <Route path="/edit-profile" element={<EditProfileScreen />} />
          <Route path="/edit-password" element={<EditPasswordScreen />} />
          <Route path="/edit-email" element={<EditEmailScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/video-quality" element={<VideoQualityScreen />} />
          <Route path="/downloads" element={<DownloadsScreen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
