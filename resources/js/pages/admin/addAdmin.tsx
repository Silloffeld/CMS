import { useState } from "react";
import { router, useForm } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";

const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Add Admin", href: "/addAdmin" },
];

export default function AddAdmin( { admins } ) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
    });
    const [success, setSuccess] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setSuccess("");

        post(route("admin.addAdmin"), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccess("Admin added successfully!");
                reset("name", "email", "password");
            },
            onError: () => {
                setSuccess("");
            },
        });
    }
    function handleDelete(id) {
        if (confirm("Are you sure you want to delete this admin?")) {
            router.delete(route("admin.deleteAdmin", id), {
                preserveScroll: true,
                onSuccess: () => setSuccess("Admin deleted!"),
            });
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="m-5">
                <form method="post" className="m-3 " onSubmit={handleSubmit}>
                    <label className="block mb-2 font-bold" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="w-64 h-10 bg-primary rounded-xl p-2 mb-2 text-black"
                        value={data.name}
                        onChange={e => setData("name", e.target.value)}
                        required
                        placeholder="Enter admin name"
                        autoFocus
                    />
                    {errors.name && (
                        <div className="text-red-600 mb-2">{errors.name}</div>
                    )}

                    <label className="block mb-2 font-bold" htmlFor="email">
                        Admin Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-64 h-10 bg-primary rounded-xl p-2 mb-2 text-black"
                        value={data.email}
                        onChange={e => setData("email", e.target.value)}
                        required
                        placeholder="Enter admin email"
                    />
                    {errors.email && (
                        <div className="text-red-600 mb-2">{errors.email}</div>
                    )}

                    <label className="block mb-2 font-bold" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-64 h-10 bg-primary rounded-xl p-2 mb-2 text-black"
                        value={data.password}
                        onChange={e => setData("password", e.target.value)}
                        required
                        placeholder="Enter password"
                    />
                    {errors.password && (
                        <div className="text-red-600 mb-2">{errors.password}</div>
                    )}

                    <input
                        type="hidden"
                        name="is_admin"
                        value="true"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white mx-4 px-4 py-2 rounded-xl mt-2"
                        disabled={processing}
                    >
                        Add Admin
                    </button>
                    {success && (
                        <div className="text-green-600 mt-2">{success}</div>
                    )}
                </form>
            </div>
            <div className="m-5">
                <h2>Current Admins</h2>
                {Array.isArray(admins) && admins.map(admin => (
                    <div className="bg-primary text-black rounded-xl p-2 mb-2" key={admin.id}>
                        <h1>{admin.name}</h1>
                        <div>{admin.email}</div>
                        <div>{admin.id}</div>
                        <button
                            onClick={() => handleDelete(admin.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-xl ml-3"
                        >
                            Delete
                        </button>
                    </div>

                ))}
            </div>

        </AppLayout>
    );
}
