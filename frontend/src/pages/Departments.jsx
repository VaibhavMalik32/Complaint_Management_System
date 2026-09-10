import { useEffect, useState } from "react";

import {
    getDepartments,
    getOrganizations,
    createDepartment
} from "../api";


export default function Departments() {

    const [departments, setDepartments] =
        useState([]);

    const [organizations, setOrganizations] =
        useState([]);

    const [form, setForm] = useState({
        organization_id: "",
        name: "",
        description: ""
    });


    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            const [d, o] =
                await Promise.all([
                    getDepartments(),
                    getOrganizations()
                ]);

            setDepartments(
                d.departments || []
            );

            setOrganizations(
                o.organizations || []
            );

        } catch (error) {

            alert(error.message);

        }
    };


    const submit = async e => {

        e.preventDefault();

        try {

            await createDepartment(form);

            setForm({
                organization_id: "",
                name: "",
                description: ""
            });

            loadData();

        } catch (error) {

            alert(error.message);

        }
    };


    return (

        <div className="p-8">

            <h1 className="text-2xl font-bold">
                Departments
            </h1>

            <p className="text-gray-500 mt-1 mb-8">
                Manage departments
            </p>


            <form
                onSubmit={submit}
                className="bg-white border rounded-xl p-6 mb-8"
            >

                <div className="grid md:grid-cols-3 gap-4">

                    <select
                        required
                        value={form.organization_id}
                        onChange={e =>
                            setForm({
                                ...form,
                                organization_id:
                                    e.target.value
                            })
                        }
                        className="border rounded-lg px-4 py-3"
                    >

                        <option value="">
                            Select Organization
                        </option>

                        {organizations.map(org => (

                            <option
                                key={org.organization_id}
                                value={org.organization_id}
                            >
                                {org.name}
                            </option>

                        ))}

                    </select>


                    <input
                        required
                        placeholder="Department name"
                        value={form.name}
                        onChange={e =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                        className="border rounded-lg px-4 py-3"
                    />


                    <input
                        placeholder="Description"
                        value={form.description}
                        onChange={e =>
                            setForm({
                                ...form,
                                description:
                                    e.target.value
                            })
                        }
                        className="border rounded-lg px-4 py-3"
                    />

                </div>


                <button className="mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg">
                    Add Department
                </button>

            </form>


            <div className="bg-white border rounded-xl overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left px-6 py-4">
                                Department
                            </th>

                            <th className="text-left px-6 py-4">
                                Organization
                            </th>

                            <th className="text-left px-6 py-4">
                                Description
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {departments.map(dept => (

                            <tr
                                key={dept.department_id}
                                className="border-t"
                            >

                                <td className="px-6 py-4 font-medium">
                                    {dept.name}
                                </td>

                                <td className="px-6 py-4">
                                    {dept.organization_name}
                                </td>

                                <td className="px-6 py-4 text-gray-500">
                                    {dept.description || "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}