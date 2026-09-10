import { useEffect, useState } from "react";

import {
    getStaff,
    getAvailableUsers,
    getDepartments,
    createStaff
} from "../api";


export default function Staff() {

    const [staff, setStaff] = useState([]);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] =
        useState([]);

    const [form, setForm] = useState({
        user_id: "",
        department_id: "",
        designation: ""
    });


    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            const [
                staffData,
                usersData,
                departmentsData
            ] = await Promise.all([
                getStaff(),
                getAvailableUsers(),
                getDepartments()
            ]);

            setStaff(
                staffData.staff || []
            );

            setUsers(
                usersData.users || []
            );

            setDepartments(
                departmentsData.departments || []
            );

        } catch (error) {

            alert(error.message);

        }
    };


    const submit = async e => {

        e.preventDefault();

        try {

            await createStaff(form);

            setForm({
                user_id: "",
                department_id: "",
                designation: ""
            });

            loadData();

        } catch (error) {

            alert(error.message);

        }
    };


    return (

        <div className="p-8">

            <h1 className="text-2xl font-bold">
                Staff
            </h1>

            <p className="text-gray-500 mt-1 mb-8">
                Manage complaint handling staff
            </p>


            <form
                onSubmit={submit}
                className="bg-white border rounded-xl p-6 mb-8"
            >

                <div className="grid md:grid-cols-3 gap-4">

                    <select
                        required
                        value={form.user_id}
                        onChange={e =>
                            setForm({
                                ...form,
                                user_id:
                                    e.target.value
                            })
                        }
                        className="border rounded-lg px-4 py-3"
                    >

                        <option value="">
                            Select User
                        </option>

                        {users.map(user => (

                            <option
                                key={user.user_id}
                                value={user.user_id}
                            >
                                {user.name}
                            </option>

                        ))}

                    </select>


                    <select
                        required
                        value={form.department_id}
                        onChange={e =>
                            setForm({
                                ...form,
                                department_id:
                                    e.target.value
                            })
                        }
                        className="border rounded-lg px-4 py-3"
                    >

                        <option value="">
                            Select Department
                        </option>

                        {departments.map(dept => (

                            <option
                                key={dept.department_id}
                                value={dept.department_id}
                            >
                                {dept.name}
                            </option>

                        ))}

                    </select>


                    <input
                        required
                        placeholder="Designation"
                        value={form.designation}
                        onChange={e =>
                            setForm({
                                ...form,
                                designation:
                                    e.target.value
                            })
                        }
                        className="border rounded-lg px-4 py-3"
                    />

                </div>


                <button className="mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg">
                    Add Staff
                </button>

            </form>


            <div className="bg-white border rounded-xl overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left px-6 py-4">
                                Name
                            </th>

                            <th className="text-left px-6 py-4">
                                Email
                            </th>

                            <th className="text-left px-6 py-4">
                                Department
                            </th>

                            <th className="text-left px-6 py-4">
                                Designation
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {staff.map(member => (

                            <tr
                                key={member.staff_id}
                                className="border-t"
                            >

                                <td className="px-6 py-4 font-medium">
                                    {member.user_name}
                                </td>

                                <td className="px-6 py-4">
                                    {member.email}
                                </td>

                                <td className="px-6 py-4">
                                    {member.department_name}
                                </td>

                                <td className="px-6 py-4">
                                    {member.designation}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}