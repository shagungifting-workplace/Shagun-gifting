import { useLoadingStore } from "../store/useLoadingStore";

const GlobalLoader = () => {
    const { isLoading } = useLoadingStore();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        </div>
    );
};

export default GlobalLoader;
