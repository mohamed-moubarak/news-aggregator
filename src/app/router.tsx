import { createBrowserRouter, type RouteObject } from 'react-router'

import { AppShell } from '@/components/layout/AppShell'
import { FeedPage } from '@/features/feed/FeedPage'

import { NotFound } from './NotFound'

/**
 * The feed (landing page) ships in the main bundle; other pages load on demand
 * so the date picker, drawers and onboarding don't slow down first paint.
 */
export const routes: RouteObject[] = [
  {
    path: 'welcome',
    lazy: async () => ({
      Component: (await import('@/features/onboarding/OnboardingPage')).OnboardingPage,
    }),
  },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <FeedPage /> },
      {
        path: 'explore',
        lazy: async () => ({
          Component: (await import('@/features/explore/ExplorePage')).ExplorePage,
        }),
      },
      {
        path: 'you',
        lazy: async () => ({
          Component: (await import('@/features/profile/ProfilePage')).ProfilePage,
        }),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
