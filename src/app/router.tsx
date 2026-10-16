import { createBrowserRouter } from 'react-router'

import { AppShell } from '@/components/layout/AppShell'
import { ExplorePage } from '@/features/explore/ExplorePage'
import { FeedPage } from '@/features/feed/FeedPage'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { ProfilePage } from '@/features/profile/ProfilePage'

import { NotFound } from './NotFound'

export const routes = [
  { path: 'welcome', element: <OnboardingPage /> },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'you', element: <ProfilePage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
