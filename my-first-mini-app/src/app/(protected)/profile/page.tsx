import { Page } from '@/components/PageLayout';
import { Profile } from '@/components/Profile';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default function ProfilePage() {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar title="Profile" />
      </Page.Header>
      <Page.Main className="mb-16">
        <Profile />
      </Page.Main>
    </>
  );
}