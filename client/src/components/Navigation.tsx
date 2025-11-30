import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Bell, 
  User as UserIcon, 
  LogOut,
  Menu,
  X,
  Home,
  Users,
  Building2,
  FileText,
  Target,
  Briefcase,
  BarChart3,
  Trophy,
  TrendingUp,
  Video,
  Zap
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Link, useLocation } from 'wouter';

interface NavigationProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    profileImageUrl?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };
}

export default function Navigation({ user }: NavigationProps) {
  const { logout } = useFirebaseAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [location] = useLocation();

  const navigateToPage = (path: string) => {
    window.location.href = path;
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  // Memoize navigation items for multi-page student navigation
  const navigationItems = useMemo(() => [
    ...(user.role === 'student' ? [
      { id: 'dashboard', label: 'Dashboard', href: '/student/dashboard', icon: Home },
      { id: 'resume-scanner', label: 'Resume Scanner', href: '/student/resume-scanner', icon: FileText },
      { id: 'interview-practice', label: 'Interview Practice', href: '/student/interview-practice', icon: Target },
      { id: 'cover-letter', label: 'Cover Letter', href: '/student/cover-letter', icon: Briefcase },
    ] : []),
    ...(user.role === 'recruiter' ? [
      { id: 'recruiter', label: 'Recruiter Dashboard', action: () => scrollToSection('recruiter') },
      { id: 'job-fair', label: 'Job Fair', action: () => scrollToSection('job-fair') },
    ] : []),
    ...(user.role === 'admin' ? [
      { id: 'admin', label: 'Admin Overview', action: () => scrollToSection('admin') },
    ] : []),
  ], [user.role]);

  // Memoize cross-role navigation links
  const roleNavigationItems = useMemo(() => [
    ...(user.role === 'recruiter' ? [] : []),
  ], [user.role]);

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection('dashboard')}
            data-testid="logo-placenet"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
              <GraduationCap className="text-black text-lg" />
            </div>
            <h1 className="text-xl font-orbitron font-bold neon-text">PlaceNet</h1>
          </motion.div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center justify-center flex-1 mx-4">
              <div className="flex items-center space-x-2 xl:space-x-4 max-w-5xl overflow-x-auto scrollbar-hide">
                {/* Current page navigation */}
                {navigationItems.map(item => (
                  item.href ? (
                    <Link key={item.id} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`cyber-btn text-xs xl:text-sm whitespace-nowrap flex-shrink-0 ${location === item.href ? 'text-neon-cyan bg-neon-cyan/10' : ''}`}
                        data-testid={`nav-${item.id}`}
                      >
                        {item.icon && <item.icon className="w-3 h-3 xl:w-4 xl:h-4 mr-1 xl:mr-2" />}
                        {item.label}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="cyber-btn text-xs xl:text-sm whitespace-nowrap flex-shrink-0"
                      onClick={item.action}
                      data-testid={`nav-${item.id}`}
                    >
                      {item.label}
                    </Button>
                  )
                ))}
                
                {/* Role-based portal links */}
                {roleNavigationItems.length > 0 && (
                  <div className="border-l border-border/20 pl-2 xl:pl-4 ml-2 xl:ml-4 flex space-x-1">
                    {roleNavigationItems.map(item => (
                      <Button
                        key={item.id}
                        variant="outline"
                        size="sm"
                        className="glass-card text-xs whitespace-nowrap flex-shrink-0"
                        onClick={item.action}
                        data-testid={`portal-${item.id}`}
                      >
                        <item.icon className="w-3 h-3 mr-1" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Current Role Badge */}
            <Badge className={`
              ${user.role === 'student' ? 'bg-neon-cyan/20 text-neon-cyan' : ''}
              ${user.role === 'recruiter' ? 'bg-neon-purple/20 text-neon-purple' : ''}
              ${user.role === 'admin' ? 'bg-neon-green/20 text-neon-green' : ''}
              border border-current/30 capitalize
            `}>
              {user.role}
            </Badge>
            
            {/* Notifications */}
            <Link href={user.role === 'recruiter' ? '/recruiter/notifications' : '/student/notifications'}>
              <Button 
                variant="ghost" 
                size="icon"
                className="glass-card relative hover:bg-white/10 transition-all duration-300"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5 text-neon-cyan" />
                <Badge className="absolute -top-1 -right-1 bg-neon-pink w-3 h-3 p-0 animate-pulse" />
              </Button>
            </Link>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                  data-testid="img-user-profile"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              )}
              
              {!isMobile && (
                <span className="text-sm font-medium" data-testid="text-user-name">
                  {user.firstName || 'User'}
                </span>
              )}
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="glass-card hover:bg-red-500/10 transition-all duration-300"
              data-testid="button-logout"
            >
              <LogOut className="h-5 w-5 text-red-400" />
            </Button>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="glass-card"
                data-testid="button-mobile-menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <motion.div 
            className="py-4 border-t border-border/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-2">
              {/* Current page navigation */}
              {navigationItems.map(item => (
                item.href ? (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`cyber-btn w-full justify-start ${location === item.href ? 'text-neon-cyan bg-neon-cyan/10' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                      data-testid={`mobile-nav-${item.id}`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                      {item.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="cyber-btn w-full justify-start"
                    onClick={item.action}
                    data-testid={`mobile-nav-${item.id}`}
                  >
                    {item.label}
                  </Button>
                )
              ))}
              
              {/* Role-based portal links */}
              {roleNavigationItems.length > 0 && (
                <>
                  <div className="border-t border-border/20 my-2" />
                  {roleNavigationItems.map(item => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className="glass-card w-full justify-start"
                      onClick={item.action}
                      data-testid={`mobile-portal-${item.id}`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
