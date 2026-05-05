import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1E2430] flex flex-col font-sans">
      
      {/* Simple Top Bar for Landing Page */}
      <nav className="border-b border-[#322D40] bg-[#1E2430] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Logo />
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-[#C8C5C7] hover:text-white font-medium transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="bg-[#563F7C] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#4A356A] transition-colors shadow-lg shadow-[#563F7C]/20">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#563F7C]/10 blur-[120px]"></div>
          <div className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#563F7C]/5 blur-[100px]"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#322D40] text-[#B3A1C9] border border-[#563F7C]/30 text-sm font-bold tracking-wider uppercase mb-8">
              Premium Real Estate Dashboard
            </span>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Exclusive properties.<br />
              <span className="text-[#B3A1C9]">Seamless deals.</span>
            </h1>
            
            <p className="text-xl text-[#C8C5C7] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              The trustworthy, transparent platform for buyers and sellers to negotiate exclusive real estate deals in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto bg-[#563F7C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#4A356A] transition-all shadow-lg shadow-[#563F7C]/25">
                Start Exploring
              </Link>
              <Link href="/login" className="w-full sm:w-auto bg-[#322D40] text-white border border-[#1E2430] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#322D40]/80 transition-all">
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
