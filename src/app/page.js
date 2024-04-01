import { Experience } from "@/components/Experience";

export const metadata = {
  openGraph: {
    title: "Sensei AI ",
    description: "Learn Japanese with Sensei AI",
  },
};
export default function Home() {
  return (
    <main className="h-screen min-h-screen  ">
      <Experience />
    </main>
  );
}
