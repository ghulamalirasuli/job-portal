import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import { Avatar } from '@/Components/ui/Avatar';
import { Button } from '@/Components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface SeekerProfileProps extends PageProps {
    profile: {
        headline: string | null;
        location: string | null;
        country: string | null;
        phone: string | null;
        summary: string | null;
        visibility: 'public' | 'private';
        avatar_url: string | null;
    };
}

export default function SeekerProfilePage() {
    const { t } = useTranslation();
    const { auth, profile } = usePage<SeekerProfileProps>().props;

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        headline: profile.headline ?? '',
        location: profile.location ?? '',
        country: profile.country ?? '',
        phone: profile.phone ?? '',
        summary: profile.summary ?? '',
        visibility: profile.visibility,
        avatar: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/seeker/profile', { forceFormData: true });
    };

    return (
        <AppLayout
            header={
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{t('profile.seeker_profile')}</h1>
                </div>
            }
        >
            <Head title={t('profile.seeker_profile')} />

            <Card>
                <CardHeader>
                    <CardTitle>{t('profile.seeker_profile')}</CardTitle>
                    <CardDescription>{t('profile.seeker_headline_help')}</CardDescription>
                </CardHeader>

                <form onSubmit={submit} className="space-y-5" noValidate encType="multipart/form-data">
                    <div className="flex items-center gap-4">
                        <Avatar
                            name={auth.user?.name ?? ''}
                            src={profile.avatar_url ?? undefined}
                            size="lg"
                        />
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                {t('profile.seeker_avatar')}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData('avatar', e.target.files?.[0] ?? null)
                                }
                                className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                            />
                            {errors.avatar ? (
                                <p className="mt-1 text-xs text-red-600">{errors.avatar}</p>
                            ) : null}
                        </div>
                    </div>

                    <FormField id="headline" label={t('profile.seeker_headline')} error={errors.headline}>
                        <Input
                            id="headline"
                            value={data.headline}
                            invalid={Boolean(errors.headline)}
                            onChange={(e) => setData('headline', e.target.value)}
                        />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="location" label={t('profile.seeker_location')} error={errors.location}>
                            <Input
                                id="location"
                                value={data.location}
                                invalid={Boolean(errors.location)}
                                onChange={(e) => setData('location', e.target.value)}
                            />
                        </FormField>
                        <FormField id="country" label={t('auth.country')} error={errors.country}>
                            <Input
                                id="country"
                                maxLength={2}
                                value={data.country}
                                invalid={Boolean(errors.country)}
                                onChange={(e) => setData('country', e.target.value.toUpperCase())}
                                placeholder="DE"
                            />
                        </FormField>
                    </div>

                    <FormField id="phone" label={t('profile.seeker_phone')} error={errors.phone}>
                        <Input
                            id="phone"
                            value={data.phone}
                            invalid={Boolean(errors.phone)}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                    </FormField>

                    <FormField id="summary" label={t('profile.seeker_summary')} error={errors.summary}>
                        <textarea
                            id="summary"
                            rows={5}
                            value={data.summary}
                            onChange={(e) => setData('summary', e.target.value)}
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </FormField>

                    <FormField id="visibility" label={t('profile.seeker_visibility')} error={errors.visibility}>
                        <div className="space-y-2">
                            {(['public', 'private'] as const).map((v) => (
                                <label key={v} className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={v}
                                        checked={data.visibility === v}
                                        onChange={() => setData('visibility', v)}
                                        className="size-4 border-slate-300 text-brand-600 focus:ring-brand-500"
                                    />
                                    {v === 'public'
                                        ? t('profile.seeker_visibility_public')
                                        : t('profile.seeker_visibility_private')}
                                </label>
                            ))}
                        </div>
                    </FormField>

                    <div className="flex items-center gap-3">
                        <Button type="submit" isLoading={processing}>
                            {t('common.save')}
                        </Button>
                        {recentlySuccessful ? (
                            <span className="text-sm text-green-600">{t('profile.saved')}</span>
                        ) : null}
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
}
