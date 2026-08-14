import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { useSession } from 'better-auth/react';

export default function Home() {
  const { session, status } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Welcome to Tournaments Platform
        </h1>
        
        {status === 'loading' ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : session ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900">
                Hello, {session.user?.name || 'User'}!
              </p>
              <p className="text-gray-600">
                You are successfully logged in.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-3">My Tournaments</h3>
                <p className="text-gray-600">View and manage your tournaments</p>
                <Link href="/dashboard/tournaments" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
                  View Tournaments →
                </Link>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-3">Create Event</h3>
                <p className="text-gray-600">Start a new tournament</p>
                <Link href="/dashboard/create" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
                  Create Event →
                </Link>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-3">Analytics</h3>
                <p className="text-gray-600">View tournament statistics</p>
                <Link href="/dashboard/analytics" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
                  View Analytics →
                </Link>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline"
                onClick={async () => {
                  // Implement sign out
                  window.location.href = '/api/auth/signout';
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900">
                Get Started Today
              </p>
              <p className="text-gray-600 mb-6">
                Manage your tournaments with our powerful platform
              </p>
            </div>
            
            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full rounded-md px-4 py-3 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full rounded-md px-4 py-3 text-lg font-medium text-white border border-gray-300 hover:bg-gray-50"
              >
                Create Account
              </Link>
            </div>
            
            <div className="mt-8 text-center text-gray-500">
              <p>
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
