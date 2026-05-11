import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { MessageCircle, Shield, Zap, Users, ArrowRight, Star, Lock, Globe, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import Navbar from '@/components/layout/Navbar'

export default function LandingPage() {
  const navigate = useNavigate()
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-void-950 overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-whisper-400/10 dark:bg-whisper-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-void-400/10 dark:bg-void-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-whisper-300/5 dark:bg-whisper-400/5 rounded-full blur-3xl" />
        </div>

        {/* Floating cards */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-8 top-32 hidden lg:block"
        >
          <div className="glass rounded-2xl p-4 w-52 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-ink-700 dark:text-void-300 leading-relaxed">"You're honestly the most genuine person I know 💫"</p>
                <p className="text-xs text-ink-400 dark:text-void-500 mt-1">Anonymous · 2m ago</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-10 top-40 hidden lg:block"
        >
          <div className="glass rounded-2xl p-4 w-48 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-whisper-500" />
              <span className="text-xs font-semibold text-ink-700 dark:text-void-200">New message!</span>
            </div>
            <p className="text-xs text-ink-500 dark:text-void-400">"Your energy is contagious ✨"</p>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-whisper-200/50 dark:border-whisper-800/30 text-whisper-600 dark:text-whisper-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-whisper-500 animate-pulse" />
              Trusted by 50,000+ users
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-ink-950 dark:text-void-50 leading-[1.05] tracking-tight mb-6"
          >
            Receive anonymous
            <span className="block text-gradient italic">messages from anyone.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg sm:text-xl text-ink-500 dark:text-void-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Share your unique link. Let friends, followers, and the curious world send you anonymous thoughts, confessions, and questions — completely private.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" onClick={() => navigate('/signup')} className="group">
              Create your WhisperBox
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-ink-400 dark:text-void-500 mt-4"
          >
            Free forever · No credit card required
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-ink-300 dark:border-void-600 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-ink-400 dark:bg-void-500" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-ink-950 dark:text-void-50 mb-4">
              Everything you need
            </h2>
            <p className="text-ink-500 dark:text-void-400 max-w-xl mx-auto">
              A complete anonymous messaging platform with powerful features for creators and curious minds.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:shadow-xl hover:shadow-whisper-500/5 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-whisper-50 dark:bg-whisper-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-whisper-500">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-ink-900 dark:text-void-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-ink-500 dark:text-void-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white/50 dark:bg-void-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-ink-950 dark:text-void-50 mb-4">
              Loved by creators
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-ink-600 dark:text-void-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-whisper-300 to-whisper-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800 dark:text-void-200">{t.name}</p>
                    <p className="text-xs text-ink-400 dark:text-void-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-whisper-500/10 to-void-500/10 rounded-3xl" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold text-ink-950 dark:text-void-50 mb-4">
                Ready to hear the truth?
              </h2>
              <p className="text-ink-500 dark:text-void-400 mb-8">
                Join thousands of people discovering what others really think.
              </p>
              <Button size="lg" onClick={() => navigate('/signup')} className="group">
                Start for free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200 dark:border-void-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-whisper-500 flex items-center justify-center">
              <MessageCircle size={12} className="text-white" />
            </div>
            <span className="font-display font-semibold text-ink-800 dark:text-void-200">WhisperBox</span>
          </div>
          <p className="text-sm text-ink-400 dark:text-void-500">© 2024 WhisperBox. Built with ❤️</p>
          <div className="flex gap-4 text-sm text-ink-400 dark:text-void-500">
            <a href="#" className="hover:text-ink-700 dark:hover:text-void-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink-700 dark:hover:text-void-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-ink-700 dark:hover:text-void-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  { icon: <Lock size={20} />, title: 'Truly Anonymous', desc: 'Senders are never identified. No account required to send messages.' },
  { icon: <Zap size={20} />, title: 'Real-time Updates', desc: 'Messages appear instantly. Never miss a whisper with live notifications.' },
  { icon: <Shield size={20} />, title: 'Spam Protected', desc: 'Rate limiting, AI moderation, and reporting tools keep things clean.' },
  { icon: <MessageCircle size={20} />, title: 'Rich Messaging', desc: 'Emoji support, reactions, and more to express exactly what you mean.' },
  { icon: <Globe size={20} />, title: 'Shareable Link', desc: 'Your unique link works anywhere — bio, tweets, TikTok, Instagram.' },
  { icon: <Users size={20} />, title: 'Analytics', desc: 'Track message trends, peak times, and engagement on your dashboard.' },
]

const testimonials = [
  { name: 'Sarah K.', role: 'Content Creator', text: "I get the most heartfelt messages from fans who wouldn't say it publicly. WhisperBox changed how I connect with my community." },
  { name: 'Marcus T.', role: 'Student', text: "Perfect for collecting honest feedback on my music. People say what they actually think — it's been invaluable for improving." },
  { name: 'Priya M.', role: 'Influencer', text: "My followers love the anonymity. The engagement is so much more genuine than public comments. Absolutely recommend." },
]
