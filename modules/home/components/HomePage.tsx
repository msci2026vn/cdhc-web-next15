import { FeaturesBar } from "./FeaturesBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturesBar />
        {/* Các section khác sẽ thêm sau */}
      </main>
      <Footer />
    </>
  );
}
