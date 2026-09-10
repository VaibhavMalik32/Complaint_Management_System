import { useEffect, useState } from "react";

import {
    getCategories,
    getOrganizations,
    createCategory
} from "../api";


export default function Categories() {

    const [categories, setCategories] =
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

            const [c, o] =
                await Promise.all([
                    getCategories(),
                    getOrganizations()
                ]);

            setCategories(
                c.categories || []
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

            await createCategory(form);

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
                Categories
            </h1>

            <p className="text-gray-500 mt-1 mb-8">
                Manage complaint categories
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
                        placeholder="Category name"
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
                    Add Category
                </button>

            </form>


            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                {categories.map(category => (

                    <div
                        key={category.category_id}
                        className="bg-white border rounded-xl p-6"
                    >

                        <p className="text-xs text-blue-600 font-semibold">
                            {category.organization_name}
                        </p>

                        <h2 className="text-lg font-semibold mt-2">
                            {category.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            {category.description || "No description"}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}