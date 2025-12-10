import AppLayout from '@/layouts/app-layout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Add Admin', href: '/addAdmin' },
];

export default function AddAdmin({ admins }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
    });
    const [success, setSuccess] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        setSuccess('');

        post(route('admin.addAdmin'), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccess('Admin added successfully!');
                reset('name', 'email', 'password');
            },
            onError: () => {
                setSuccess('');
            },
        });
    }
    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this admin?')) {
            router.delete(route('admin.delete', id), {
                preserveScroll: true,
                onSuccess: () => setSuccess('Admin deleted!'),
            });
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="m-5">
                <form method="post" className="m-3" onSubmit={handleSubmit}>
                    <label className="mb-2 block font-bold" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="mb-2 h-10 w-64 rounded-xl bg-primary p-2 text-black"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Enter admin name"
                        autoFocus
                    />
                    {errors.name && <div className="mb-2 text-red-600">{errors.name}</div>}

                    <label className="mb-2 block font-bold" htmlFor="email">
                        Admin Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="mb-2 h-10 w-64 rounded-xl bg-primary p-2 text-black"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="Enter admin email"
                    />
                    {errors.email && <div className="mb-2 text-red-600">{errors.email}</div>}

                    <label className="mb-2 block font-bold" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="mb-2 h-10 w-64 rounded-xl bg-primary p-2 text-black"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="Enter password"
                    />
                    {errors.password && <div className="mb-2 text-red-600">{errors.password}</div>}

                    <input type="hidden" name="is_admin" value="true" />

                    <button type="submit" className="mx-4 mt-2 rounded-xl bg-blue-600 px-4 py-2 text-white" disabled={processing}>
                        Add Admin
                    </button>
                    {success && <div className="mt-2 text-green-600">{success}</div>}
                </form>
            </div>
            <div className="m-5">
                <h2>Current Admins</h2>
                {Array.isArray(admins) &&
                    admins.map((admin) => (
                        <div className="mb-2 rounded-xl bg-primary p-2 text-black" key={admin.id}>
                            <h1>{admin.name}</h1>
                            <div>{admin.email}</div>
                            <div>{admin.id}</div>
                            <button onClick={() => handleDelete(admin.id)} className="ml-3 rounded-xl bg-red-600 px-3 py-1 text-white">
                                Delete
                            </button>
                        </div>
                    ))}
            </div>
        </AppLayout>
    );
}
