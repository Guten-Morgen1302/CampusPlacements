import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Video, MessageSquare, FileText, Calendar, Mail, Phone, UserPlus, Heart, ChevronLeft, ChevronRight, GraduationCap, Building2, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

// Mock alumni data for demonstration
const mockAlumni = [
  {
    id: 1,
    name: "Priya Sharma",
    batch: "2020",
    company: "Google",
    role: "Software Engineer",
    domain: "Technology",
    location: "Bangalore",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b2c5?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    sessions: 127
  },
  {
    id: 2,
    name: "Arjun Patel",
    batch: "2019",
    company: "Microsoft",
    role: "Product Manager",
    domain: "Product",
    location: "Hyderabad",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    sessions: 89
  },
  {
    id: 3,
    name: "Kavya Reddy",
    batch: "2018",
    company: "Amazon",
    role: "Data Scientist",
    domain: "Data Science",
    location: "Chennai",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    sessions: 156
  },
  {
    id: 4,
    name: "Rahul Singh",
    batch: "2017",
    company: "Flipkart",
    role: "Engineering Manager",
    domain: "Technology",
    location: "Mumbai",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    sessions: 203
  },
  {
    id: 5,
    name: "Ananya Gupta",
    batch: "2021",
    company: "Zomato",
    role: "UX Designer",
    domain: "Design",
    location: "Delhi",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    sessions: 67
  },
  {
    id: 6,
    name: "Vikram Joshi",
    batch: "2016",
    company: "Paytm",
    role: "VP Engineering",
    domain: "Technology",
    location: "Noida",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    sessions: 289
  }
];

const testimonials = [
  {
    id: 1,
    text: "The mentorship I received helped me land my dream job at a top tech company. The guidance was invaluable!",
    author: "Sanjay Kumar",
    batch: "2023",
    company: "TCS"
  },
  {
    id: 2,
    text: "Alumni webinars gave me insights into industry trends that I couldn't find anywhere else. Highly recommend!",
    author: "Meera Iyer",
    batch: "2023",
    company: "Infosys"
  },
  {
    id: 3,
    text: "The discussion forums are amazing! I got answers to all my interview prep questions from experienced alumni.",
    author: "Rohit Pandey",
    batch: "2024",
    company: "Wipro"
  }
];

export default function AlumniConnect() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const domains = ["All", "Technology", "Product", "Data Science", "Design", "Finance", "Consulting"];

  const filteredAlumni = mockAlumni.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === "All" || alumni.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation user={user || {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        role: 'student',
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }} />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Connect. Learn. Grow
          </motion.h1>
          <motion.h2 
            className="text-2xl md:text-3xl text-cyan-300 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            with Alumni
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Get guidance, mentorship, and career insights directly from your alumni network.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Users className="mr-2 h-5 w-5" />
              Find a Mentor
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Alumni Connect Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Mentorship Programs", desc: "One-on-one sessions with alumni", color: "from-cyan-500 to-blue-500" },
              { icon: Video, title: "Live Webinars", desc: "Scheduled expert talks", color: "from-purple-500 to-pink-500" },
              { icon: MessageSquare, title: "Discussion Forums", desc: "Q&A boards for guidance", color: "from-green-500 to-teal-500" },
              { icon: FileText, title: "Resource Sharing", desc: "Alumni posting notes & tips", color: "from-orange-500 to-red-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Directory Section */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Alumni Directory
          </motion.h2>
          
          {/* Search and Filter */}
          <motion.div 
            className="flex flex-col md:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, company, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {domains.map((domain) => (
                <Button
                  key={domain}
                  variant={selectedDomain === domain ? "default" : "outline"}
                  onClick={() => setSelectedDomain(domain)}
                  className={selectedDomain === domain 
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" 
                    : "border-slate-600 text-gray-300 hover:bg-slate-700"
                  }
                >
                  {domain}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Alumni Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni, index) => (
              <motion.div
                key={alumni.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={alumni.photo}
                        alt={alumni.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/30 group-hover:border-cyan-500 transition-colors duration-300"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{alumni.name}</h3>
                        <p className="text-cyan-400 text-sm">{alumni.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{alumni.company}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-slate-700 text-cyan-300">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Batch {alumni.batch}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700 text-purple-300">
                        {alumni.domain}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700 text-pink-300">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alumni.location}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 font-semibold">{alumni.rating}</span>
                        <span className="text-gray-400 text-sm">({alumni.sessions} sessions)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                        <Mail className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Student Success Stories
          </motion.h2>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg md:text-xl text-gray-300 mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-center">
                      <p className="text-white font-semibold">{testimonials[currentTestimonial].author}</p>
                      <p className="text-cyan-400 text-sm">Batch {testimonials[currentTestimonial].batch} • {testimonials[currentTestimonial].company}</p>
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTestimonial}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextTestimonial}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Your Alumni are Your Strongest Network
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of students who have transformed their careers through alumni mentorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-xl">
              Connect Now
            </Button>
            <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 text-lg font-semibold rounded-xl">
              Become a Mentor
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-700">
            <p className="text-gray-400 mb-4">Connect with us:</p>
            <div className="flex justify-center gap-4">
              <a href="mailto:tpo@college.edu" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                📧 tpo@college.edu
              </a>
              <a href="tel:+911234567890" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                📞 +91 12345 67890
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}