import { Link, useNavigate } from 'react-router-dom'
import { BarChart3, User, LogOut, LogIn, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-card">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <BarChart3 size={18} color="#FF6B35" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-extrabold text-navy-900 leading-none tracking-tight">
              ROI <span className="text-brand-orange font-bold"> Navigator</span>
            </div>
            <div className="text-[10px] font-medium text-slate-400 mt-0.5 tracking-wide">by Leap Scholar</div>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold border border-navy-900 text-navy-900 px-3 py-1.5 rounded-full">
            <Sparkles size={11} />
            Leap AI Hackathon 2026
          </span>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-3.5 py-1 hover:border-brand-orange transition-colors cursor-pointer no-underline"
              >
                <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-bold">
                  {user.avatar}
                </div>
                <span className="text-sm font-semibold text-navy-900">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <button className="btn-orange flex items-center gap-2 px-4 py-2 text-sm">
                <LogIn size={14} />
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
