import { NavLink } from "react-router-dom";

export default function Sidebar({ role = "admin" }) {

    const userLinks = [
        {
            name: "Dashboard",
            path: "/"
        },
        {
            name: "My Complaints",
            path: "/user/complaints"
        }
    ];


    const adminLinks = [
        {
            name: "Dashboard",
            path: "/admin"
        },
        {
            name: "Complaints",
            path: "/complaints"
        },
        {
            name: "Management",
            path: "/management"
        },
        {
            name: "Organizations",
            path: "/organizations"
        },
        {
            name: "Departments",
            path: "/departments"
        },
        {
            name: "Categories",
            path: "/categories"
        },
        {
            name: "Staff",
            path: "/staff"
        }
    ];


    const links = role === "user"
        ? userLinks
        : adminLinks;


    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white">

            {/* Logo */}

            <div className="px-6 py-6 border-b border-slate-800">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                        C
                    </div>

                    <div>

                        <h1 className="font-bold">
                            Complaint
                        </h1>

                        <p className="text-xs font-bold">
                            Management System
                        </p>

                    </div>

                </div>

            </div>


            {/* Navigation */}

            <nav className="p-4 space-y-1">

                <p className="text-xs uppercase text-slate-500 font-semibold px-3 mb-3">
                    {role === "user" ? "User Menu" : "Admin Menu"}
                </p>


                {links.map(link => (

                    <NavLink
                        key={link.path}
                        to={link.path}
                        end
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm transition ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>

                ))}

            </nav>

        </aside>
    );
}