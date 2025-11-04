import Header from '@/components/layout/header';
import MshkurStudio from '@/components/mshkur-studio';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <MshkurStudio />
      </main>
    </div>
  );
}
