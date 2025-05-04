import { createBrowserRouter } from 'react-router-dom';
import PublicLearningPlans from '../pages/PublicLearningPlans';
import { AuthProvider } from '../context/AuthContext';

export const router = createBrowserRouter([
    {
        path: '/learningplans/public',
        element: (
            <AuthProvider>
                <PublicLearningPlans />
            </AuthProvider>
        ),
    },
    // ... existing routes ...
]); 