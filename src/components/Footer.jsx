import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ArrowUp,
  Heart,
  Globe,
  Users,
  BookOpen,
  Camera,
  Trophy,
  Send,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/", icon: <Globe className="w-4 h-4" /> },
    {
      name: "Detect Signs",
      href: "/detect",
      icon: <Camera className="w-4 h-4" />,
    },
    { name: "Learn", href: "/learn", icon: <BookOpen className="w-4 h-4" /> },
    {
      name: "Practice",
      href: "/practice",
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      name: "Community",
      href: "/community",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const resources = [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "Best Practices", href: "/best-practices" },
    { name: "FAQ", href: "/faq" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Our Mission", href: "/mission" },
    { name: "Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Accessibility", href: "/accessibility" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: <Facebook className="w-5 h-5" /> },
    { name: "Twitter", href: "#", icon: <Twitter className="w-5 h-5" /> },
    { name: "Instagram", href: "#", icon: <Instagram className="w-5 h-5" /> },
    { name: "LinkedIn", href: "#", icon: <Linkedin className="w-5 h-5" /> },
    { name: "GitHub", href: "#", icon: <Github className="w-5 h-5" /> },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <img
                  src="/Sign.svg"
                  alt="SignLearn AI Logo"
                  className="relative w-16 h-16 object-contain drop-shadow-sm"
                />
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    SignLearn AI
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Interactive Sign Language Learning
                  </p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed max-w-md">
                Empowering the deaf and hard-of-hearing community through
                cutting-edge AI technology. Breaking communication barriers with
                real-time sign language recognition and interactive learning.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                  <Mail className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  <a
                    href="mailto:contact@signlearnai.com"
                    className="hover:underline"
                  >
                    contact@signlearnai.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                  <Phone className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  <a href="tel:+1234567890" className="hover:underline">
                    +1 (234) 567-8900
                  </a>
                </div>
                <div className="flex items-start space-x-3 text-gray-300 group">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>
                    123 Innovation Drive
                    <br />
                    Tech Valley, CA 94000
                  </span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  Stay Updated
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  />
                  <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <span className="text-gray-500 group-hover:text-white transition-colors">
                        {link.icon}
                      </span>
                      <span className="hover:underline">{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Resources
              </h3>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors hover:underline flex items-center group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Company Links */}
              <h3 className="text-lg font-semibold text-white mb-6 mt-8">
                Company
              </h3>
              <ul className="space-y-3">
                {company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Stats */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Legal</h3>
              <ul className="space-y-3 mb-8">
                {legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Impact</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Active Users</span>
                    <span className="text-white font-semibold">10,000+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      Signs Recognized
                    </span>
                    <span className="text-white font-semibold">50+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Accuracy</span>
                    <span className="text-white font-semibold">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Languages</span>
                    <span className="text-white font-semibold">ASL + More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-gray-400">
                <span>© {currentYear} SignLearn AI. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for the deaf community.</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
              >
                <span className="text-sm">Back to Top</span>
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
