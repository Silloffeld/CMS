import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type AccountForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

interface AccountProps {
    user: {
        name: string;
        email: string;
    };
    status?: string;
    flash?: {
        error?: string;
        success?: string;
    };
}

export default function Account({ user, status, flash }: AccountProps) {
    const { data, setData, post, processing, errors, reset } = useForm<AccountForm>({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('account.update'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Account Settings" description="View and update your account information">
            <Head title="Account" />

            {flash?.error && <div className="mb-4 text-center text-sm font-medium text-red-600">{flash.error}</div>}
            {flash?.success && <div className="mb-4 text-center text-sm font-medium text-green-600">{flash.success}</div>}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label className="text-text" htmlFor="name">
                            Name
                        </Label>
                        <Input id="name" type="text" required value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-text" htmlFor="email">
                            Email address
                        </Label>
                        <Input id="email" type="email" required value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-text" htmlFor="password">
                            New Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Leave blank to keep current password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-text" htmlFor="password_confirmation">
                            Confirm New Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        Update Account
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
