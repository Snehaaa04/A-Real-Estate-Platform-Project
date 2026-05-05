import Link from 'next/link';
import { Building2 } from 'lucide-react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export default function Logo({ className = '', onClick }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`} onClick={onClick}>
      <div className="w-8 h-8 rounded-lg bg-[#563F7C] flex items-center justify-center mr-2 shadow-lg shadow-[#563F7C]/30">
        <Building2 className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
        Clear<span className="text-[#B3A1C9]">Estate</span>
      </span>
    </Link>
  );
}
