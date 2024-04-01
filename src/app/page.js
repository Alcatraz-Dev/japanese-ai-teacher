import { Experience } from "@/components/Experience";

export const metadata = {
  openGraph: {
    title: "Sensei AI Pro ",
    description: "Learn Japanese with Sensei Ai Pro",
  },
};
export default function Home() {
  return (
    <main className="h-screen min-h-screen  ">
      <Experience />
    </main>
  );
}
