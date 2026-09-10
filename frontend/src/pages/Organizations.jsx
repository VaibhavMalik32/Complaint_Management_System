import { useEffect, useState } from "react";

import {
    getOrganizations,
    createOrganization
} from "../api";


export default function Organizations() {

    const [organizations, setOrganizations] =
        useState([]);

    const [showForm, setShowForm] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        type: "",
        description: ""
    });


    useEffect(() => {
        loadOrganizations();
    }, []);


    const loadOrganizations = async () => {

        try {

            const data =
                await getOrganizations();

            setOrganizations(
                data.organizations || []
            );

        } catch (error) {

            alert(error.message);

        }
    };


    const submit = async e => {

        e.preventDefault();

        try {

            await createOrganization(form);

            setForm({
                name: "",
                type: "",
                description: ""
            });

            setShowForm(false);

            loadOrganizations();

        } catch (error) {

            alert(error.message);

        }
    };


    return (

        <Page title="Organizations">

            <button
                onClick={() =>
                    setShowForm(!showForm)
                }
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg"
            >
                + Add Organization
            </button>


            {showForm && (

                <form
                    onSubmit={submit}
                    className="bg-white border rounded-xl p-6 mt-6"
                >

                    <Input
                        label="Name"
                        value={form.name}
                        onChange={e =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                    />

                    <Input
                        label="Type"
                        value={form.type}
                        onChange={e =>
                            setForm({
                                ...form,
                                type: e.target.value
                            })
                        }
                    />

                    <div className="mt-4">

                        <label className="text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            rows="3"
                            value={form.description}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    description:
                                        e.target.value
                                })
                            }
                            className="w-full border rounded-lg px-4 py-3 mt-2"
                        />

                    </div>


                    <button
                        className="mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
                    >
                        Create
                    </button>

                </form>

            )}


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">

                {organizations.map(org => (

                    <div
                        key={org.organization_id}
                        className="bg-white border rounded-xl p-6"
                    >

                        <h2 className="font-semibold text-lg">
                            {org.name}
                        </h2>

                        <p className="text-sm text-blue-600 mt-1">
                            {org.type}
                        </p>

                        <p className="text-sm text-gray-500 mt-3">
                            {org.description || "No description"}
                        </p>

                    </div>

                ))}

            </div>

        </Page>
    );
}


function Page({ title, children }) {

    return (

        <div className="p-8">

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-2xl font-bold">
                        {title}
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage {title.toLowerCase()}
                    </p>

                </div>

                {Array.isArray(children)
                    ? children[0]
                    : null}

            </div>


            {Array.isArray(children)
                ? children.slice(1)
                : children}

        </div>
    );
}


function Input({
    label,
    value,
    onChange
}) {

    return (

        <div className="mb-4">

            <label className="block text-sm font-medium mb-2">
                {label}
            </label>

            <input
                required
                value={value}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-3"
            />

        </div>
    );
}