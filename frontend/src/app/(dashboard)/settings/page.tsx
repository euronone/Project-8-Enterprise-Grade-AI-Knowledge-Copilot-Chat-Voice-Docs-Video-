'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { Camera, Check, Copy, CreditCard, ExternalLink, Key, Shield, Trash2, Users } from 'lucide-react';

import * as apiKeysApi from '@/lib/api/api_keys';
import type { ApiKey, GeneratedApiKey } from '@/lib/api/api_keys';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import * as authApi from '@/lib/api/auth';
import * as adminApi from '@/lib/api/admin';
import type { AdminUser } from '@/lib/api/admin';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'Include an uppercase letter').regex(/[0-9]/, 'Include a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', icon: <Users className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { id: 'integrations', label: 'Integrations', icon: <Key className="h-4 w-4" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [teamMembers, setTeamMembers] = useState<AdminUser[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [revealedKey, setRevealedKey] = useState<GeneratedApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (activeTab !== 'team') return;
    setTeamLoading(true);
    adminApi.listUsers().then(setTeamMembers).catch(() => {
      // Non-admins can't list users — silently ignore
    }).finally(() => setTeamLoading(false));
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'integrations') return;
    setKeysLoading(true);
    apiKeysApi.listApiKeys().then(setApiKeys).catch(() => {
      toast.error('Failed to load API keys');
    }).finally(() => setKeysLoading(false));
  }, [activeTab]);

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) { toast.error('Enter a name for this key'); return; }
    setGenerating(true);
    try {
      const generated = await apiKeysApi.generateApiKey(newKeyName.trim());
      setRevealedKey(generated);
      setApiKeys((prev) => [{
        id: generated.id,
        name: generated.name,
        keyPrefix: generated.keyPrefix,
        isActive: true,
        createdAt: generated.createdAt,
      }, ...prev]);
      setNewKeyName('');
      setShowForm(false);
    } catch {
      toast.error('Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevokeKey = async (id: string, name: string) => {
    if (!confirm(`Revoke "${name}"? Any apps using this key will stop working.`)) return;
    try {
      await apiKeysApi.revokeApiKey(id);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success('API key revoked');
    } catch {
      toast.error('Failed to revoke key');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await authApi.updateProfile(data);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed');
      passwordForm.reset();
    } catch {
      toast.error('Failed to change password');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">Settings</h1>
        <p className="mt-1 text-sm text-surface-500">
          Manage your account, security, and preferences.
        </p>
      </div>

      <div className="flex-1 p-6">
        <Tabs
          activeTab={activeTab}
          tabs={SETTINGS_TABS}
          variant="pills"
          onTabChange={setActiveTab}
        >
          {/* Profile */}
          <TabPanel className="max-w-2xl space-y-6 pt-6" id="profile">
            {/* Avatar section */}
            <Card variant="bordered">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar
                    name={session?.user?.name ?? ''}
                    size="xl"
                    src={session?.user?.image ?? undefined}
                  />
                  <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white dark:border-surface-900">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-surface-900 dark:text-surface-100">
                    {session?.user?.name}
                  </p>
                  <p className="text-sm text-surface-500">{session?.user?.email}</p>
                  <Badge className="mt-2" size="sm" variant="primary">
                    Pro Plan
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Profile form */}
            <Card variant="bordered">
              <h3 className="mb-4 text-base font-semibold text-surface-900 dark:text-surface-100">
                Profile Information
              </h3>
              <form className="space-y-4" onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <Input
                  error={profileForm.formState.errors.name?.message}
                  label="Full name"
                  {...profileForm.register('name')}
                />
                <Input
                  error={profileForm.formState.errors.email?.message}
                  label="Email address"
                  type="email"
                  {...profileForm.register('email')}
                />
                <Button
                  loading={profileForm.formState.isSubmitting}
                  type="submit"
                >
                  Save changes
                </Button>
              </form>
            </Card>
          </TabPanel>

          {/* Security */}
          <TabPanel className="max-w-2xl space-y-6 pt-6" id="security">
            <Card variant="bordered">
              <h3 className="mb-4 text-base font-semibold text-surface-900 dark:text-surface-100">
                Change Password
              </h3>
              <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <Input
                  error={passwordForm.formState.errors.currentPassword?.message}
                  label="Current password"
                  type="password"
                  {...passwordForm.register('currentPassword')}
                />
                <Input
                  error={passwordForm.formState.errors.newPassword?.message}
                  hint="At least 8 characters, 1 uppercase, 1 number"
                  label="New password"
                  type="password"
                  {...passwordForm.register('newPassword')}
                />
                <Input
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  label="Confirm new password"
                  type="password"
                  {...passwordForm.register('confirmPassword')}
                />
                <Button
                  loading={passwordForm.formState.isSubmitting}
                  type="submit"
                >
                  Update password
                </Button>
              </form>
            </Card>

            <Card variant="bordered">
              <h3 className="mb-1 text-base font-semibold text-surface-900 dark:text-surface-100">
                Two-Factor Authentication
              </h3>
              <p className="mb-4 text-sm text-surface-500">
                Add an extra layer of security to your account.
              </p>
              <Button variant="secondary">Enable 2FA</Button>
            </Card>
          </TabPanel>

          {/* Integrations */}
          <TabPanel className="max-w-2xl space-y-6 pt-6" id="integrations">
            <Card variant="bordered">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">
                    API Keys
                  </h3>
                  <p className="mt-1 text-sm text-surface-500">
                    Share your base URL <code className="rounded bg-surface-100 px-1.5 py-0.5 text-xs dark:bg-surface-800">http://localhost:8000</code> and a key so external apps can access KnowledgeForge.
                  </p>
                </div>
                {!showForm && (
                  <Button
                    size="sm"
                    leftIcon={<Key className="h-4 w-4" />}
                    onClick={() => { setShowForm(true); setRevealedKey(null); }}
                  >
                    New Key
                  </Button>
                )}
              </div>

              {/* New key form */}
              {showForm && (
                <div className="mb-5 flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-950">
                  <input
                    autoFocus
                    className="flex-1 rounded-md border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100"
                    placeholder="Key name, e.g. Production App"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateKey(); if (e.key === 'Escape') setShowForm(false); }}
                  />
                  <Button size="sm" loading={generating} onClick={handleGenerateKey}>
                    Generate
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              )}

              {/* Revealed key — shown once */}
              {revealedKey && (
                <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
                  <p className="mb-2 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Copy your key now — it won&apos;t be shown again.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 overflow-x-auto rounded bg-white px-3 py-2 text-xs font-mono text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
                      {revealedKey.rawKey}
                    </code>
                    <button
                      className="flex items-center gap-1.5 rounded-md border border-emerald-300 bg-white px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      onClick={() => handleCopy(revealedKey.rawKey)}
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <button
                    className="mt-2 text-xs text-emerald-600 underline dark:text-emerald-400"
                    onClick={() => setRevealedKey(null)}
                  >
                    I&apos;ve saved it, dismiss
                  </button>
                </div>
              )}

              {/* Keys list */}
              {keysLoading ? (
                <div className="py-6 text-center text-sm text-surface-400">Loading keys…</div>
              ) : apiKeys.length === 0 ? (
                <div className="py-8 text-center">
                  <Key className="mx-auto mb-3 h-8 w-8 text-surface-300" />
                  <p className="text-sm text-surface-500">No API keys yet. Generate one to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-surface-100 dark:divide-surface-800">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center gap-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-100 dark:bg-surface-800">
                        <Key className="h-4 w-4 text-surface-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                          {key.name}
                        </p>
                        <p className="text-xs text-surface-400 font-mono">
                          {key.keyPrefix}{'*'.repeat(20)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-surface-400">
                          Created {new Date(key.createdAt).toLocaleDateString()}
                        </p>
                        {key.lastUsedAt && (
                          <p className="text-xs text-surface-400">
                            Last used {new Date(key.lastUsedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        className="ml-2 rounded-md p-1.5 text-surface-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 transition-colors"
                        title="Revoke key"
                        onClick={() => handleRevokeKey(key.id, key.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Usage example */}
            <Card variant="bordered">
              <h3 className="mb-3 text-base font-semibold text-surface-900 dark:text-surface-100">
                How to use
              </h3>
              <p className="mb-3 text-sm text-surface-500">
                Pass your API key as a Bearer token in the <code className="rounded bg-surface-100 px-1 py-0.5 text-xs dark:bg-surface-800">Authorization</code> header:
              </p>
              <div className="relative rounded-lg bg-surface-900 p-4 dark:bg-surface-800">
                <pre className="overflow-x-auto text-xs text-surface-100">
{`curl -X POST http://localhost:8000/conversations \\
  -H "Authorization: Bearer kf_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "My App Conversation"}'`}
                </pre>
                <button
                  className="absolute right-3 top-3 rounded p-1 text-surface-400 hover:text-white"
                  onClick={() => handleCopy(`curl -X POST http://localhost:8000/conversations \\\n  -H "Authorization: Bearer kf_your_api_key" \\\n  -H "Content-Type: application/json" \\\n  -d '{"title": "My App Conversation"}'`)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-3 text-xs text-surface-400">
                Full API docs available at{' '}
                <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline dark:text-brand-400">
                  http://localhost:8000/docs
                </a>
              </p>
            </Card>
          </TabPanel>

          {/* Billing */}
          <TabPanel className="max-w-2xl space-y-6 pt-6" id="billing">
            <Card variant="bordered">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">
                    Pro Plan
                  </h3>
                  <p className="mt-1 text-sm text-surface-500">$49 / month per seat</p>
                  <p className="mt-2 text-sm text-surface-500">
                    Next billing date: <span className="font-medium">April 1, 2026</span>
                  </p>
                </div>
                <Badge variant="primary">Active</Badge>
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="secondary">Manage billing</Button>
                <Button variant="danger-ghost">Cancel plan</Button>
              </div>
            </Card>
          </TabPanel>

          {/* Team */}
          <TabPanel className="max-w-3xl space-y-6 pt-6" id="team">
            <Card variant="bordered">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">
                  Team Members
                </h3>
                <Button
                  size="sm"
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                  onClick={() => router.push('/admin')}
                >
                  Manage in Admin
                </Button>
              </div>
              {teamLoading ? (
                <div className="py-8 text-center text-sm text-surface-400">Loading team...</div>
              ) : teamMembers.length === 0 ? (
                <div className="py-8 text-center">
                  <Users className="mx-auto mb-3 h-8 w-8 text-surface-300" />
                  <p className="text-sm text-surface-500">
                    {(session?.user as { role?: string })?.role === 'Admin'
                      ? 'No team members yet. Invite people from the Admin panel.'
                      : 'Contact your admin to manage team members.'}
                  </p>
                  {(session?.user as { role?: string })?.role === 'Admin' && (
                    <Button size="sm" className="mt-3" onClick={() => router.push('/admin')}>
                      Go to Admin Panel
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-surface-100 dark:divide-surface-800">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 py-3">
                      <Avatar name={member.name} size="sm" status={member.status === 'active' ? 'online' : 'offline'} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                          {member.name}
                          {member.email === session?.user?.email && (
                            <span className="ml-2 text-xs text-surface-400">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-surface-500">{member.email}</p>
                      </div>
                      <Badge
                        size="sm"
                        variant={member.status === 'active' ? 'success' : 'default'}
                      >
                        {member.status}
                      </Badge>
                      <Badge size="sm" variant="default">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
