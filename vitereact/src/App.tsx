import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'zustand';

// Import views
import UV_TaskList from '@/components/views/UV_TaskList.tsx';
import UV_TaskCreationModal from '@/components/views/UV_TaskCreationModal.tsx';
import UV_TaskEditModal from '@/components/views/UV_TaskEditModal.tsx';
import UV_TaskDeletionConfirmationModal from '@/components/views/UV_TaskDeletionConfirmationModal.tsx';

// Import a potential NotFound component
// import NotFoundView from '@/components/views/NotFoundView.tsx';

// Import your Zustand store
// Assuming your store is defined in a file like '@/store/taskStore.ts' and exported as 'useTaskStore'
import { useTaskStore } from '@/store/taskStore'; // Adjust the import path as needed

// Initialize QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Example: Globally disable retries for queries that don't need them
            // Consider specific query retries instead of a global setting if needed
            // retry: false,
            // Example: Set a global staleTime
            // staleTime: 5 * 60 * 1000, // 5 minutes
            // Suspense is often enabled globally with React Query unless you have specific reasons not to
            suspense: true, // Enable suspense for data fetching
        },
        mutations: {
            // Example: Configure default mutation options
        }
    }
});

// --- Global Error Handling ---
// Basic Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        // Consider integrating with a service like Sentry or Datadog here
    }

    render() {
        // @ts-ignore // Ignoring state type for simplicity, but ideally define state type
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="flex justify-center items-center h-screen bg-gray-100 text-red-600">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
                        <p>We're sorry, an unexpected error occurred. Please try refreshing the page.</p>
                        {/* Optionally, add a button to reload the page */}
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        // @ts-ignore
        return this.props.children;
    }
}

// --- Root Application Component ---
const App: React.FC = () => {
    // Initialization logic could go here, e.g., fetching user data on app load
    // useEffect(() => {
    //   // fetchUserData();
    // }, []);

    return (
        // Wrap with BrowserRouter for routing
        <BrowserRouter>
            {/* Provide the Zustand store to the application */}
            <Provider store={useTaskStore}>
                <QueryClientProvider client={queryClient}>
                    {/*
                        ErrorBoundary catches errors from components rendered below it.
                        Suspense is used here as a fallback for components that might be lazy-loaded
                        or for data fetching that uses React Query's suspense mode.
                    */}
                    <ErrorBoundary>
                        {/*
                            If using React Query suspense, you might want a global Suspense fallback
                            for initial data loading.
                        */}
                        <Suspense fallback={
                            <div className="flex justify-center items-center h-screen">
                                Loading Application...
                            </div>
                        }>
                            {/* Main container for structuring content */}
                            <div className="container mx-auto p-4">
                                <Routes>
                                    {/* Main task list view */}
                                    <Route path="/" element={<UV_TaskList />} />

                                    {/*
                                        Modal routes: These are currently set up to replace the entire view.
                                        A more typical modal pattern would involve nested routes that keep
                                        the main layout visible, or a dedicated modal context.
                                        For direct modal rendering, ensure these components handle their own closing.
                                    */}
                                    <Route path="/create-task" element={<UV_TaskCreationModal />} />
                                    <Route path="/edit-task/:task_id" element={<UV_TaskEditModal />} />
                                    <Route path="/delete-task-confirmation" element={<UV_TaskDeletionConfirmationModal />} />

                                    {/* Optional: Add a catch-all for 404 */}
                                    {/* <Route path="*" element={<NotFoundView />} /> */}
                                </Routes>
                            </div>
                        </Suspense>
                    </ErrorBoundary>
                </QueryClientProvider>
            </Provider>
        </BrowserRouter>
    );
};

export default App;