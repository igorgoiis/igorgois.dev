import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Focus } from "@/components/focus";
import { Story } from "@/components/story";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Stack } from "@/components/stack";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Focus />
        <Story />
        <Projects locale={locale as Locale} />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
