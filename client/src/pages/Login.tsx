import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Lock, Mail, Eye, EyeOff, User } from "lucide-react";
import { signIn, signUp, getUserRole } from "@/lib/firebase";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (!firstName || !lastName) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }
      }

      // Use backend authentication directly
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          uid: `student-${Date.now()}`,
          email: email,
          displayName: isSignUp ? `${firstName} ${lastName}` : email.split('@')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      const user = data.user;
      
      // Redirect based on role
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else if (user.role === 'recruiter') {
        window.location.href = '/recruiter';
      } else {
        window.location.href = '/student';
      }
    } catch (error: any) {
      setError(isSignUp ? "Failed to create account. Please try again." : "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="cyberpunk-bg"></div>
      
      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-card neon-border">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-2xl font-orbitron font-bold neon-text">
                PlaceNet
              </h1>
            </div>
            <CardTitle className="text-xl font-orbitron">
              {isSignUp ? 'Create Student Account' : 'Login to PlaceNet'}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {isSignUp 
                ? 'Fill in your details to create your student account' 
                : 'Enter your credentials to continue'
              }
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="glass-card border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="firstName">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="glass-card pl-10 border-border/20"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="lastName">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="glass-card pl-10 border-border/20"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-card pl-10 border-border/20"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-card pl-10 pr-10 border-border/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="cyber-btn w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="dna-loader-small"></div>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>
            </form>
            
            {/* Toggle between sign in and sign up */}
            <div className="mt-6 pt-6 border-t border-border/20 text-center relative z-50">
              <p className="text-sm text-muted-foreground mb-3">
                {isSignUp 
                  ? "Already have an account?" 
                  : "Don't have a student account?"
                }
              </p>
              <button
                type="button"
                className="px-4 py-2 text-cyan-400 hover:text-cyan-300 bg-transparent border-none cursor-pointer font-medium transition-colors duration-200"
                data-testid="toggle-signup-btn"
                style={{
                  position: 'relative',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                  display: 'inline-block',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Button clicked! Current state:", isSignUp);
                  setIsSignUp(!isSignUp);
                  setError("");
                  setFirstName("");
                  setLastName("");
                }}
              >
                {isSignUp ? "Back to Login" : "Create Student Account"}
              </button>
              
              {!isSignUp && (
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>Admin/Recruiter? Use your provided credentials to sign in.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}