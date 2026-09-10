import Sidebar from "./Sidebar";

export default function Layout({ role, children }) {
    return (
        <div className="min-h-screen bg-gray-50 -ml-70">

            <Sidebar role={role} />

            <main className="ml-64">
                {children}
            </main>

        </div>
    );
}