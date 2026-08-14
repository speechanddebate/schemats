import Link from 'next/link';
import { signOut } from '@/app/lib/auth';
import { useSession } from 'better-auth/react';
import { Menu } from '@/app/components/ui/menu';
import { Button } from '@/app/components/ui/button';
import { Avatar } from '@/app/components/ui/avatar';
import { Moon } from 'lucide-react';

export function Header() {
  const { session, status } = useSession();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Tournaments
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              <Avatar
                className="h-8 w-8"
                src={session.user.image ?? '/default-avatar.png'}
                alt={`${session.user.name}'s avatar`}
              />
              <div className="flex items-center space-x-2 text-sm font-medium">
                <span>{session.user.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    await signOut();
                    window.location.href = '/';
                  }}
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="ml-3 rounded-md px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
