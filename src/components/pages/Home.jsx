import React from "react";
import {
  Camera,
  Users,
  BookOpen,
  Shield,
  Globe,
  Brain,
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SignLanguageHomePage() {
  const features = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Real-Time Detection",
      description:
        "Advanced AI and OpenCV technology for instant sign language recognition through your webcam",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Learning",
      description:
        "Custom-trained CNN models that continuously improve recognition accuracy",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Interactive Learning",
      description:
        "Comprehensive tutorials and resources to master sign language at your own pace",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Driven",
      description:
        "Share experiences, reviews, and learn from others in our inclusive community",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description:
        "JWT authentication and role-based access control for your safety",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Cross-Platform",
      description:
        "Access from any device - desktop, tablet, or mobile browser",
    },
  ];

  const benefits = [
    "Bridge communication gaps in education and healthcare",
    "Promote digital inclusivity for deaf and hard-of-hearing communities",
    "Real-time translation without additional hardware",
    "Scalable web-based solution accessible anywhere",
    "Cost-effective alternative to human interpreters",
    "Continuous learning and improvement through AI",
  ];

  const industries = [
    {
      name: "Education",
      desc: "Supporting students in classrooms and online learning",
    },
    { name: "Healthcare", desc: "Improving patient-caregiver communication" },
    { name: "Corporate", desc: "Enhancing customer service accessibility" },
    { name: "Government", desc: "Ensuring equal access to public services" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center h-5">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-full mb-4">
                🚀 AI-Powered Communication Technology
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Sign Language Detection
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">
                  Using AI
                </span>
              </h1>
              <p className="text-xl md:text-xl text-gray-600 mb-8 max-w-4xl lg:max-w-none leading-relaxed">
                Breaking communication barriers with real-time sign language
                recognition. Empowering the deaf and hard-of-hearing community
                through cutting-edge AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
                <Link to="/detect">
                  <button className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    Try Demo Now
                  </button>
                </Link>
                <button className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            {/* OpenCV Detection Visual */}
            <div className="relative">
              <div className="shadow-2xl border-0 overflow-hidden bg-gray-900 rounded-lg">
                <div className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
                    {/* Webcam feed simulation */}
                    <div className="absolute inset-4 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg border border-gray-600">
                      {/* Hand outline detection */}
                      <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 400 300"
                      >
                        {/* Hand skeleton points */}
                        <g className="animate-pulse">
                          {/* Palm */}
                          <circle cx="200" cy="180" r="3" fill="#ffffff" />
                          <circle cx="180" cy="160" r="2" fill="#ffffff" />
                          <circle cx="220" cy="160" r="2" fill="#ffffff" />
                          <circle cx="200" cy="200" r="2" fill="#ffffff" />
                          <circle cx="160" cy="180" r="2" fill="#ffffff" />

                          {/* Fingers */}
                          <circle cx="180" cy="120" r="2" fill="#ffffff" />
                          <circle cx="180" cy="100" r="2" fill="#ffffff" />
                          <circle cx="200" cy="110" r="2" fill="#ffffff" />
                          <circle cx="200" cy="90" r="2" fill="#ffffff" />
                          <circle cx="220" cy="120" r="2" fill="#ffffff" />
                          <circle cx="220" cy="100" r="2" fill="#ffffff" />
                          <circle cx="240" cy="140" r="2" fill="#ffffff" />
                          <circle cx="240" cy="120" r="2" fill="#ffffff" />

                          {/* Connecting lines */}
                          <line
                            x1="200"
                            y1="180"
                            x2="180"
                            y2="160"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0.7"
                          />
                          <line
                            x1="200"
                            y1="180"
                            x2="220"
                            y2="160"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0.7"
                          />
                          <line
                            x1="180"
                            y1="160"
                            x2="180"
                            y2="120"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0.7"
                          />
                          <line
                            x1="180"
                            y1="120"
                            x2="180"
                            y2="100"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0.7"
                          />
                          <line
                            x1="200"
                            y1="180"
                            x2="200"
                            y2="110"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0.7"
                          />
                          <line
                            x1="200"
                            y1="110"
                            x2="200"
                            y2="90"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0.7"
                          />
                        </g>
                      </svg>

                      {/* Detection box */}
                      <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-white rounded-lg animate-pulse">
                        <div className="absolute -top-7 left-0 bg-white text-black px-2 py-1 text-sm font-bold rounded">
                          Hand Detected: "Hello" (98.5%)
                        </div>
                      </div>
                    </div>

                    {/* Status indicators */}
                    <div className="absolute top-15 right-15 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        OpenCV Active
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                        AI Processing
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        Real-time
                      </div>
                    </div>

                    {/* Bottom info panel */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4">
                      <div className="text-white text-center">
                        <div className="text-sm text-gray-300 mb-1">
                          Detected Sign:
                        </div>
                        <div className="text-2xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                          "HELLO"
                        </div>
                        <div className="text-xs text-gray-400 mt-1 mb-2">
                          Confidence: 98.5% | FPS: 30
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating tech badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                <Camera className="h-6 w-6 text-black" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg border-2 border-gray-200">
                <Brain className="h-6 w-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">
                {" "}
                Seamless Communication
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines advanced AI with user-friendly
              design to create an inclusive communication experience for
              everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border border-gray-200 shadow-md hover:scale-105 hover:border-gray-800 rounded-lg bg-white"
              >
                <div className="text-center pb-4 p-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transforming Lives Through
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">
                  Inclusive Technology
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI-powered sign language detection system is designed to
                break down communication barriers and create a more inclusive
                world for the deaf and hard-of-hearing community.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-gray-800 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="shadow-2xl border-0 overflow-hidden rounded-lg">
                <div className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <Heart className="h-20 w-20 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-4">
                        84.7M+ LKR Impact
                      </h3>
                      <p className="text-gray-300 text-lg">
                        Projected positive economic impact by Year 4
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold">2,115%</div>
                          <div className="text-gray-400 text-sm">ROI</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold">5+</div>
                          <div className="text-gray-400 text-sm">
                            Industries
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Empowering Multiple Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our versatile platform serves diverse sectors, creating
              accessibility and inclusion wherever communication matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 border border-gray-200 shadow-md group hover:scale-105 hover:border-gray-800 rounded-lg bg-white"
              >
                <div className="p-6">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-gray-800 to-black rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {industry.name}
                  </h3>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {industry.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Bridge Communication Barriers?
          </h2>
          <p className="text-xl mb-8 text-gray-300 leading-relaxed">
            Join thousands of users who are already experiencing the power of
            AI-driven sign language recognition. Start your journey towards
            inclusive communication today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
              <Play className="mr-2 h-5 w-5" />
              Start Free Trial
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200 flex items-center justify-center">
              View Documentation
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">Real-Time</div>
              <div className="text-gray-400">Processing</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Cross-Platform</div>
              <div className="text-gray-400">Compatibility</div>
            </div>
            <div>
              <div className="text-3xl font-bold">AI-Powered</div>
              <div className="text-gray-400">Accuracy</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
