'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { Camera, CreditCard, Key, Shield, Users } from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import * as authApi from '@/lib/api/auth';

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
  const [activeTab, setActiveTab] = useState('profile');

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
              <h3 className="mb-4 text-base font-semibold text-surface-900 dark:text-surface-100">
                API Keys
              </h3>
              <p className="mb-4 text-sm text-surface-500">
                Use API keys to integrate KnowledgeForge with your applications.
              </p>
              <Button leftIcon={<Key className="h-4 w-4" />} variant="secondary">
                Generate API Key
              </Button>
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
                <Button size="sm">Invite member</Button>
              </div>
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {[
                  { name: 'Jane Smith', email: 'jane@company.com', role: 'Admin', status: 'Active' },
                  { name: 'Bob Johnson', email: 'bob@company.com', role: 'Member', status: 'Active' },
                  { name: 'Alice Chen', email: 'alice@company.com', role: 'Viewer', status: 'Pending' },
                ].map((member) => (
                  <div key={member.email} className="flex items-center gap-4 py-3">
                    <Avatar name={member.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                        {member.name}
                      </p>
                      <p className="text-xs text-surface-500">{member.email}</p>
                    </div>
                    <Badge
                      size="sm"
                      variant={member.status === 'Active' ? 'success' : 'warning'}
                    >
                      {member.status}
                    </Badge>
                    <Badge size="sm" variant="default">
                      {member.role}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
