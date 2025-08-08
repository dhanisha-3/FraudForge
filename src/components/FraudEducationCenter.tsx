import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Target,
  Activity,
  Clock,
  BookOpen,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Pause,
  RefreshCw,
  Zap,
  Lock,
  Video,
  Youtube,
  Star,
  ThumbsUp,
  MessageSquare,
  ExternalLink,
  Download,
  Share2,
  Bookmark,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  category: "phishing" | "scams" | "identity_theft" | "credit_card" | "investment" | "general";
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

interface EducationModule {
  id: string;
  title: string;
  description: string;
  category: string;
  videos: YouTubeVideo[];
  progress: number;
  completed: boolean;
  estimatedTime: string;
}

interface UserProgress {
  videosWatched: number;
  totalVideos: number;
  completedModules: number;
  totalModules: number;
  knowledgeScore: number;
  certificates: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface FraudTip {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  icon: string;
}

const FraudEducationCenter = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [educationModules, setEducationModules] = useState<EducationModule[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    videosWatched: 0,
    totalVideos: 0,
    completedModules: 0,
    totalModules: 0,
    knowledgeScore: 0,
    certificates: []
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [fraudTips, setFraudTips] = useState<FraudTip[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const YOUTUBE_API_KEY = (import.meta as any).env?.VITE_YOUTUBE_API_KEY as string | undefined;

  // Financial fraud education topics
  const fraudTopics = [
    "financial fraud prevention",
    "phishing scams awareness",
    "credit card fraud protection",
    "identity theft prevention",
    "investment scams warning",
    "online banking security",
    "cryptocurrency fraud",
    "romance scams financial",
    "elder fraud prevention",
    "business email compromise"
  ];

  // Fetch videos from YouTube API
  const fetchYouTubeVideos = async (query: string) => {
    if (!YOUTUBE_API_KEY) {
      // Graceful fallback: do not call API, return empty set
      return [];
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();

      // Get additional video details
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      const detailsData = await detailsResponse.json();

      const processedVideos: YouTubeVideo[] = data.items.map((item: any, index: number) => {
        const details = detailsData.items[index];
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          duration: details?.contentDetails?.duration || "PT0M0S",
          viewCount: details?.statistics?.viewCount || "0",
          likeCount: details?.statistics?.likeCount || "0",
          category: categorizeVideo(item.snippet.title + " " + item.snippet.description),
          difficulty: getDifficulty(item.snippet.title + " " + item.snippet.description),
          tags: extractTags(item.snippet.title + " " + item.snippet.description)
        };
      });

      return processedVideos;
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Categorize video based on content
  const categorizeVideo = (content: string): YouTubeVideo['category'] => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('phishing') || lowerContent.includes('email scam')) return 'phishing';
    if (lowerContent.includes('identity theft') || lowerContent.includes('personal information')) return 'identity_theft';
    if (lowerContent.includes('credit card') || lowerContent.includes('card fraud')) return 'credit_card';
    if (lowerContent.includes('investment') || lowerContent.includes('ponzi') || lowerContent.includes('pyramid')) return 'investment';
    if (lowerContent.includes('scam') || lowerContent.includes('fraud')) return 'scams';
    return 'general';
  };

  // Determine difficulty level
  const getDifficulty = (content: string): YouTubeVideo['difficulty'] => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('advanced') || lowerContent.includes('expert') || lowerContent.includes('professional')) return 'advanced';
    if (lowerContent.includes('intermediate') || lowerContent.includes('detailed') || lowerContent.includes('in-depth')) return 'intermediate';
    return 'beginner';
  };

  // Extract relevant tags
  const extractTags = (content: string): string[] => {
    const tags: string[] = [];
    const lowerContent = content.toLowerCase();

    const tagKeywords = [
      'security', 'fraud', 'scam', 'phishing', 'identity', 'credit', 'banking',
      'investment', 'cryptocurrency', 'online', 'mobile', 'prevention', 'awareness',
      'protection', 'safety', 'cybersecurity', 'financial', 'money', 'theft'
    ];

    tagKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return tags.slice(0, 5); // Limit to 5 tags
  };

  // Format duration from ISO 8601 to readable format
  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  };

  // Format view count
  const formatViewCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  // Load initial videos
  useEffect(() => {
    const loadInitialVideos = async () => {
      const allVideos: YouTubeVideo[] = [];

      // Fetch videos for each fraud topic
      for (const topic of fraudTopics.slice(0, 3)) { // Limit to 3 topics initially
        const topicVideos = await fetchYouTubeVideos(topic);
        allVideos.push(...topicVideos);
      }

      setVideos(allVideos);

      // Create education modules
      const modules: EducationModule[] = [
        {
          id: "phishing-basics",
          title: "Phishing & Email Scams",
          description: "Learn to identify and avoid phishing attacks and email scams",
          category: "phishing",
          videos: allVideos.filter(v => v.category === 'phishing'),
          progress: 0,
          completed: false,
          estimatedTime: "45 min"
        },
        {
          id: "identity-protection",
          title: "Identity Theft Prevention",
          description: "Protect your personal information from identity thieves",
          category: "identity_theft",
          videos: allVideos.filter(v => v.category === 'identity_theft'),
          progress: 0,
          completed: false,
          estimatedTime: "60 min"
        },
        {
          id: "financial-scams",
          title: "Financial Scams Awareness",
          description: "Recognize and avoid common financial scams and frauds",
          category: "scams",
          videos: allVideos.filter(v => v.category === 'scams'),
          progress: 0,
          completed: false,
          estimatedTime: "90 min"
        }
      ];

      setEducationModules(modules);
      setUserProgress(prev => ({
        ...prev,
        totalVideos: allVideos.length,
        totalModules: modules.length
      }));
    };

    loadInitialVideos();

    // Initialize quiz questions
    setQuizQuestions([
      {
        id: "q1",
        question: "What is the most common way fraudsters try to steal personal information?",
        options: ["Phone calls", "Phishing emails", "Text messages", "Social media"],
        correctAnswer: 1,
        explanation: "Phishing emails are the most common method used by fraudsters to steal personal information by impersonating legitimate organizations.",
        category: "phishing"
      },
      {
        id: "q2",
        question: "Which of the following is a red flag for investment fraud?",
        options: ["Guaranteed high returns", "Detailed risk disclosure", "Registered with authorities", "Long track record"],
        correctAnswer: 0,
        explanation: "Guaranteed high returns with little or no risk is a classic sign of investment fraud. All investments carry some level of risk.",
        category: "investment"
      },
      {
        id: "q3",
        question: "What should you do if you receive a suspicious OTP message?",
        options: ["Share it immediately", "Ignore and delete", "Call the bank to verify", "Forward to friends"],
        correctAnswer: 2,
        explanation: "Always verify suspicious OTP messages by calling your bank or service provider directly using their official contact information.",
        category: "otp"
      }
    ]);

    // Initialize fraud tips
    setFraudTips([
      {
        id: "tip1",
        title: "Never Share OTPs",
        description: "OTPs are meant for you only. Legitimate organizations will never ask for your OTP over phone or email.",
        category: "otp",
        severity: "critical",
        icon: "🔐"
      },
      {
        id: "tip2",
        title: "Verify Before You Trust",
        description: "Always verify the identity of callers claiming to be from banks or government agencies through official channels.",
        category: "verification",
        severity: "high",
        icon: "✅"
      },
      {
        id: "tip3",
        title: "Check URLs Carefully",
        description: "Look for HTTPS and verify the exact spelling of website URLs before entering sensitive information.",
        category: "online",
        severity: "high",
        icon: "🔗"
      },
      {
        id: "tip4",
        title: "Be Wary of Urgency",
        description: "Fraudsters often create false urgency. Take time to think and verify before making financial decisions.",
        category: "psychology",
        severity: "medium",
        icon: "⏰"
      }
    ]);
  }, []);

  // Handle video selection
  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsPlaying(true);

    // Update user progress
    setUserProgress(prev => ({
      ...prev,
      videosWatched: prev.videosWatched + 1,
      knowledgeScore: Math.min(100, prev.knowledgeScore + 5)
    }));
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const searchResults = await fetchYouTubeVideos(searchQuery + " financial fraud prevention");
    setVideos(searchResults);
  };

  // Handle quiz answer
  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);

    setTimeout(() => {
      const currentQuestion = quizQuestions[currentQuestionIndex];
      if (answerIndex === currentQuestion.correctAnswer) {
        setQuizScore(prev => prev + 1);
        setUserProgress(prev => ({
          ...prev,
          knowledgeScore: Math.min(100, prev.knowledgeScore + 10)
        }));
      }

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz completed
        const finalScore = (quizScore / quizQuestions.length) * 100;
        if (finalScore >= 80) {
          setUserProgress(prev => ({
            ...prev,
            certificates: [...prev.certificates, "Fraud Awareness Certificate"]
          }));
        }
        setShowQuiz(false);
        setCurrentQuestionIndex(0);
        setQuizScore(0);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  // Start quiz
  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
  };

  // Filter videos by category
  const filteredVideos = currentCategory === "all"
    ? videos
    : videos.filter(video => video.category === currentCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "phishing": return "text-red-500";
      case "scams": return "text-orange-500";
      case "identity_theft": return "text-purple-500";
      case "credit_card": return "text-blue-500";
      case "investment": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-500";
      case "intermediate": return "text-yellow-500";
      case "advanced": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="fraud-education" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <GraduationCap className="w-4 h-4 mr-2" />
            Financial Fraud Education Center
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Learn to Protect Yourself from Financial Fraud
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive educational resources and expert videos to help you identify, prevent, and respond to financial fraud
          </p>
        </div>

        {/* User Progress Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Video className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{userProgress.videosWatched}</span>
              </div>
              <div className="text-sm text-muted-foreground">Videos Watched</div>
              <Progress value={(userProgress.videosWatched / userProgress.totalVideos) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">{userProgress.completedModules}</span>
              </div>
              <div className="text-sm text-muted-foreground">Modules Completed</div>
              <Progress value={(userProgress.completedModules / userProgress.totalModules) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">{userProgress.knowledgeScore}</span>
              </div>
              <div className="text-sm text-muted-foreground">Knowledge Score</div>
              <Progress value={userProgress.knowledgeScore} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold">{userProgress.certificates.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Certificates Earned</div>
              <Progress value={(userProgress.certificates.length / 5) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search fraud education videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <select
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="phishing">Phishing</option>
                <option value="scams">Scams</option>
                <option value="identity_theft">Identity Theft</option>
                <option value="credit_card">Credit Card</option>
                <option value="investment">Investment</option>

            {!YOUTUBE_API_KEY && (
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                Set VITE_YOUTUBE_API_KEY in your .env to enable live video fetching. Showing empty results.
              </div>
            )}

                <option value="general">General</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={startQuiz}>
              <Brain className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Resources
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share Progress
            </Button>
          </div>
        </div>

        {/* Quiz Modal */}
        <AnimatePresence>
          {showQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowQuiz(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card p-6 rounded-lg border border-primary/20 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Fraud Awareness Quiz</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setShowQuiz(false)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {quizQuestions[currentQuestionIndex] && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} className="h-2" />
                    </div>

                    <h4 className="text-lg font-medium mb-4">
                      {quizQuestions[currentQuestionIndex].question}
                    </h4>

                    <div className="space-y-3">
                      {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedAnswer === index
                              ? index === quizQuestions[currentQuestionIndex].correctAnswer
                                ? "default"
                                : "destructive"
                              : "outline"
                          }
                          className="w-full justify-start h-auto p-4 text-left"
                          onClick={() => handleQuizAnswer(index)}
                          disabled={selectedAnswer !== null}
                        >
                          <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>

                    {selectedAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-background/50 rounded border border-border/50"
                      >
                        <p className="text-sm">
                          <strong>Explanation:</strong> {quizQuestions[currentQuestionIndex].explanation}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Youtube className="w-5 h-5 mr-2 text-red-500" />
              Educational Video Player
            </h3>

            {selectedVideo ? (
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">{selectedVideo.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span>{selectedVideo.channelTitle}</span>
                    <span>{formatViewCount(selectedVideo.viewCount)}</span>
                    <span>{formatDuration(selectedVideo.duration)}</span>
                    <Badge variant="outline" className={cn("text-xs", getCategoryColor(selectedVideo.category))}>
                      {selectedVideo.category.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", getDifficultyColor(selectedVideo.difficulty))}>
                      {selectedVideo.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedVideo.description.substring(0, 200)}...
                  </p>

                  {selectedVideo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Youtube className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">Select a Video to Start Learning</h4>
                  <p className="text-muted-foreground">Choose from our curated collection of financial fraud education videos</p>
                </div>
              </div>
            )}
          </Card>

          {/* Video Library */}
          <div className="space-y-6">
            {/* Education Modules */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-accent" />
                Learning Modules
              </h3>

              <div className="space-y-3">
                {educationModules.map((module) => (
                  <motion.div
                    key={module.id}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{module.title}</span>
                      <Badge variant={module.completed ? "default" : "outline"}>
                        {module.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{module.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span>{module.videos.length} videos</span>
                      <span>{module.estimatedTime}</span>
                    </div>
                    <Progress value={module.progress} className="h-2 mt-2" />
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Video List */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2 text-accent" />
                Video Library
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {filteredVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={cn(
                        "p-3 bg-background/50 rounded-lg border cursor-pointer hover:bg-background/70 transition-colors",
                        selectedVideo?.id === video.id ? "border-primary" : "border-border/50"
                      )}
                      onClick={() => handleVideoSelect(video)}
                    >
                      <div className="flex space-x-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{video.channelTitle}</span>
                            <span>•</span>
                            <span>{formatDuration(video.duration)}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={cn("text-xs", getCategoryColor(video.category))}>
                              {video.category.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs", getDifficultyColor(video.difficulty))}>
                              {video.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredVideos.length === 0 && !isLoading && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No videos found. Try adjusting your search or category filter.
                  </div>
                )}

                {isLoading && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading educational videos...
                  </div>
                )}
              </div>
            </Card>

            {/* Fraud Prevention Tips */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-accent" />
                Fraud Prevention Tips
              </h3>

              <div className="space-y-3">
                {fraudTips.map((tip) => (
                  <motion.div
                    key={tip.id}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{tip.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{tip.title}</h4>
                          <Badge variant={
                            tip.severity === "critical" ? "destructive" :
                            tip.severity === "high" ? "default" :
                            tip.severity === "medium" ? "secondary" : "outline"
                          }>
                            {tip.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-accent" />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={startQuiz}>
                  <Brain className="w-4 h-4 mr-2" />
                  Take Knowledge Quiz
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Safety Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Family
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FraudEducationCenter;
