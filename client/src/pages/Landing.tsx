import { motion } from "framer-motion";
import { lazy } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Zap, Users, TrendingUp, Bot, Shield } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Resume Scanner",
      description: "Get instant ATS optimization with our advanced AI technology"
    },
    {
      icon: Zap,
      title: "Mock Interview Practice",
      description: "Practice with AI interviewer and get real-time feedback"
    },
    {
      icon: Users,
      title: "Virtual Job Fairs",
      description: "Connect with recruiters in immersive 3D environments"
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and get personalized learning paths"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security with end-to-end encryption"
    },
    {
      icon: GraduationCap,
      title: "Career Guidance",
      description: "Expert mentorship and alumni networking opportunities"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="floating"
          >
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold neon-text glitch">
                PlaceNet
              </h1>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-6">
              Welcome to the Future of{" "}
              <span className="neon-text">Placement</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Bridge students, recruiters, and institutions with cutting-edge AI technology, 
              cyberpunk aesthetics, and immersive experiences
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                size="lg" 
                className="cyber-btn text-lg px-8 py-4"
                onClick={() => window.location.href = '/login'}
                data-testid="button-login"
              >
                <Zap className="w-5 h-5 mr-2" />
                Enter the Matrix
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="glass-card border-neon-purple/30 text-lg px-8 py-4 hover:bg-neon-purple/10"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 neon-text">
              Cyberpunk Features
            </h3>
            <p className="text-xl text-muted-foreground">
              Next-generation tools powered by AI and designed for the future
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="floating"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <Card className="glass-card neon-border hover-lift card-3d h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-black" />
                    </div>
                    <h4 className="font-orbitron font-bold text-lg mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card neon-border p-12 holographic"
          >
            <h3 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 neon-text">
              Ready to Level Up Your Career?
            </h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students and recruiters already using PlaceNet
            </p>
            <Button 
              size="lg" 
              className="cyber-btn text-lg px-12 py-4"
              onClick={() => window.location.href = '/login'}
              data-testid="button-get-started"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-card border-t border-border/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-orbitron font-bold text-xl neon-text mb-4">PlaceNet</h3>
            <p className="text-muted-foreground mb-4">Powered by AI • Built for the Future</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
