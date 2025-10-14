'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[#E5D5C0] shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.jpg"
              alt="Paperpatch"
              width={150}
              height={50}
              className="transition-transform duration-150 group-hover:scale-105"
              priority
            />
          </Link>
          
          {/* Admin link hidden - access directly via /ahnaf URL */}
          <nav className="flex items-center space-x-4">
            {/* Uncomment for local development:
            <Link
              href="/ahnaf"
              className="text-sm text-[#6B5444] hover:text-[#8B6F47] transition-colors font-medium"
            >
              Admin
            </Link>
            */}
          </nav>
        </div>
      </div>
    </header>
  );
}
