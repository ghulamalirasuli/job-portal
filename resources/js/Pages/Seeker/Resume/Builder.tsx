import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import { FileText, Plus, Save, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import { RichTextEditor } from '@/Components/ui/RichTextEditor';
import { Alert } from '@/Components/ui/Alert';
import { Avatar } from '@/Components/ui/Avatar';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface Experience {
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
}

interface Education {
    school: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
}

interface Language {
    language: string;
    level: string;
}

interface Props extends PageProps {
    profile: {
        name: string;
        email: string;
        headline: string | null;
        location: string | null;
        country: string | null;
        phone: string | null;
        avatar_url: string | null;
    };
    resume: {
        summary: string;
        experiences: Experience[];
        education: Education[];
        skills: string[];
        languages: Language[];
    };
    completeness: number;
}

const inputClass = 'block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export default function ResumeBuilder() {
    const { t } = useTranslation();
    const { profile, resume, completeness, flash } = usePage<Props>().props;
    const [skillInput, setSkillInput] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        summary: resume.summary ?? '',
        experiences: resume.experiences?.length ? resume.experiences : [emptyExperience()],
        education: resume.education?.length ? resume.education : [emptyEducation()],
        skills: resume.skills ?? [],
        languages: resume.languages?.length ? resume.languages : [{ language: '', level: '' }],
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/seeker/resume', { preserveScroll: true });
    };

    const addExperience = () => setData('experiences', [...data.experiences, emptyExperience()]);
    const addEducation = () => setData('education', [...data.education, emptyEducation()]);

    const addSkill = () => {
        const skill = skillInput.trim();
        if (!skill || data.skills.includes(skill)) return;
        setData('skills', [...data.skills, skill]);
        setSkillInput('');
    };

    return (
        <AppLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('resume.title')}</h1>
                        <p className="mt-1 text-sm text-muted">{t('resume.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted">{t('resume.completeness')}</p>
                            <p className="text-lg font-bold text-brand-700 dark:text-brand-400">{completeness}%</p>
                        </div>
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${completeness}%` }} />
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={t('resume.title')} />
            {flash?.success ? <div className="mb-4"><Alert tone="success">{flash.success}</Alert></div> : null}

            <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[320px_1fr]">
                <aside className="space-y-4">
                    <div className="surface-panel p-6">
                        <div className="flex items-center gap-4">
                            <Avatar name={profile.name} src={profile.avatar_url ?? undefined} size="lg" />
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{profile.name}</p>
                                <p className="text-sm text-muted">{profile.email}</p>
                                {profile.headline ? <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{profile.headline}</p> : null}
                            </div>
                        </div>
                        <div className="mt-4 space-y-1 text-sm text-muted">
                            {[profile.location, profile.country].filter(Boolean).join(', ') || null}
                            {profile.phone ? <p>{profile.phone}</p> : null}
                        </div>
                    </div>
                    <div className="surface-panel p-4 text-sm text-muted">
                        <FileText className="mb-2 size-5 text-brand-600" />
                        {t('resume.tip')}
                    </div>
                </aside>

                <div className="space-y-6">
                    <Section title={t('resume.summary')}>
                        <RichTextEditor value={data.summary} onChange={(html) => setData('summary', html)} placeholder={t('resume.summary_placeholder')} />
                        {errors.summary ? <p className="mt-1 text-sm text-red-600">{errors.summary}</p> : null}
                    </Section>

                    <Section title={t('resume.experience')} action={<Button type="button" size="sm" variant="outline" onClick={addExperience}><Plus className="size-4" />{t('resume.add_experience')}</Button>}>
                        {data.experiences.map((exp, index) => (
                            <div key={index} className="surface-panel space-y-3 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{t('resume.experience')} #{index + 1}</p>
                                    {data.experiences.length > 1 ? (
                                        <button type="button" onClick={() => setData('experiences', data.experiences.filter((_, i) => i !== index))} className="text-red-600"><Trash2 className="size-4" /></button>
                                    ) : null}
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <FormField id={`exp-title-${index}`} label={t('resume.job_title')}><Input value={exp.title} onChange={(e) => updateExperience(setData, data.experiences, index, 'title', e.target.value)} /></FormField>
                                    <FormField id={`exp-company-${index}`} label={t('resume.company')}><Input value={exp.company} onChange={(e) => updateExperience(setData, data.experiences, index, 'company', e.target.value)} /></FormField>
                                    <FormField id={`exp-start-${index}`} label={t('resume.start_date')}><Input type="month" value={exp.start_date} onChange={(e) => updateExperience(setData, data.experiences, index, 'start_date', e.target.value)} /></FormField>
                                    <FormField id={`exp-end-${index}`} label={t('resume.end_date')}><Input type="month" value={exp.end_date} disabled={exp.current} onChange={(e) => updateExperience(setData, data.experiences, index, 'end_date', e.target.value)} /></FormField>
                                </div>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(setData, data.experiences, index, 'current', e.target.checked)} />{t('resume.current_role')}</label>
                                <RichTextEditor value={exp.description} onChange={(html) => updateExperience(setData, data.experiences, index, 'description', html)} placeholder={t('resume.experience_placeholder')} />
                            </div>
                        ))}
                    </Section>

                    <Section title={t('resume.education')} action={<Button type="button" size="sm" variant="outline" onClick={addEducation}><Plus className="size-4" />{t('resume.add_education')}</Button>}>
                        {data.education.map((edu, index) => (
                            <div key={index} className="surface-panel grid gap-3 p-4 sm:grid-cols-2">
                                <FormField id={`edu-school-${index}`} label={t('resume.school')}><Input value={edu.school} onChange={(e) => updateEducation(setData, data.education, index, 'school', e.target.value)} /></FormField>
                                <FormField id={`edu-degree-${index}`} label={t('resume.degree')}><Input value={edu.degree} onChange={(e) => updateEducation(setData, data.education, index, 'degree', e.target.value)} /></FormField>
                                <FormField id={`edu-field-${index}`} label={t('resume.field')}><Input value={edu.field} onChange={(e) => updateEducation(setData, data.education, index, 'field', e.target.value)} /></FormField>
                                <FormField id={`edu-start-${index}`} label={t('resume.start_date')}><Input type="month" value={edu.start_date} onChange={(e) => updateEducation(setData, data.education, index, 'start_date', e.target.value)} /></FormField>
                            </div>
                        ))}
                    </Section>

                    <Section title={t('resume.skills')}>
                        <div className="flex gap-2">
                            <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder={t('resume.skill_placeholder')} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                            <Button type="button" variant="outline" onClick={addSkill}><Plus className="size-4" /></Button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {data.skills.map((skill) => (
                                <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
                                    {skill}
                                    <button type="button" onClick={() => setData('skills', data.skills.filter((s) => s !== skill))}><X className="size-3.5" /></button>
                                </span>
                            ))}
                        </div>
                    </Section>

                    <Section title={t('resume.languages')}>
                        {data.languages.map((lang, index) => (
                            <div key={index} className="grid gap-3 sm:grid-cols-2">
                                <Input value={lang.language} placeholder={t('resume.language')} onChange={(e) => updateLanguage(setData, data.languages, index, 'language', e.target.value)} className={inputClass} />
                                <Input value={lang.level} placeholder={t('resume.level')} onChange={(e) => updateLanguage(setData, data.languages, index, 'level', e.target.value)} className={inputClass} />
                            </div>
                        ))}
                    </Section>

                    <Button type="submit" disabled={processing} size="lg"><Save className="size-4" />{t('resume.save')}</Button>
                </div>
            </form>
        </AppLayout>
    );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                {action}
            </div>
            {children}
        </div>
    );
}

function emptyExperience(): Experience {
    return { title: '', company: '', location: '', start_date: '', end_date: '', current: false, description: '' };
}

function emptyEducation(): Education {
    return { school: '', degree: '', field: '', start_date: '', end_date: '' };
}

function updateExperience(
    setData: (key: 'experiences', value: Experience[]) => void,
    list: Experience[],
    index: number,
    key: keyof Experience,
    value: string | boolean,
) {
    const next = list.map((item, i) => {
        if (i !== index) return item;
        const updated: Experience = { ...item, [key]: value } as Experience;
        if (key === 'current' && value === true) updated.end_date = '';
        return updated;
    });
    setData('experiences', next);
}

function updateEducation(
    setData: (key: 'education', value: Education[]) => void,
    list: Education[],
    index: number,
    key: keyof Education,
    value: string,
) {
    const next = list.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    setData('education', next);
}

function updateLanguage(
    setData: (key: 'languages', value: Language[]) => void,
    list: Language[],
    index: number,
    key: keyof Language,
    value: string,
) {
    const next = list.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    setData('languages', next);
}
