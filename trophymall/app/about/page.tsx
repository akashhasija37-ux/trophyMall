import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-4xl font-bold mb-4">
            About Me
          </h1>

          <p className="text-lg opacity-90">
            Passionate developer building modern web applications with clean code and great user experience.
          </p>

        </div>
      </section>


      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h2 className="text-3xl font-bold mb-6">
            Who I Am
          </h2>

          <p className="text-gray-600 mb-4">
            I am a passionate full-stack developer focused on building modern,
            scalable and user-friendly web applications. I enjoy solving
            complex problems and creating efficient digital solutions.
          </p>

          <p className="text-gray-600 mb-4">
            My expertise includes modern technologies like React, Next.js,
            Node.js, and cloud-based architectures. I aim to deliver high
            performance, secure and scalable applications.
          </p>

          <p className="text-gray-600">
            I continuously learn new technologies and best practices to
            stay updated in the fast-changing tech industry.
          </p>

        </div>

        <div className="bg-white shadow-lg rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4">
            Quick Highlights
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li>✔ Full-Stack Web Development</li>
            <li>✔ React / Next.js Specialist</li>
            <li>✔ REST API & Backend Integration</li>
            <li>✔ Responsive UI Design</li>
            <li>✔ Performance & SEO Optimization</li>
          </ul>
        </div>

      </section>


      {/* Skills Section */}
      <section className="bg-white py-16">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            My Skills
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">

            <div className="p-6 rounded-lg shadow-md">
              <h4 className="font-semibold">React</h4>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <h4 className="font-semibold">Next.js</h4>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <h4 className="font-semibold">Node.js</h4>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <h4 className="font-semibold">JavaScript</h4>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <h4 className="font-semibold">Tailwind CSS</h4>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <h4 className="font-semibold">MongoDB</h4>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <h4 className="font-semibold">API Integration</h4>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <h4 className="font-semibold">Git / GitHub</h4>
            </div>

          </div>

        </div>

      </section>


      {/* Experience Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-center mb-12">
          My Experience
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-white shadow-md rounded-xl p-8">
            <h3 className="font-semibold text-lg mb-2">
              Freelance Web Developer
            </h3>

            <p className="text-gray-600 text-sm mb-2">
              2023 – Present
            </p>

            <p className="text-gray-600">
              Developing modern websites and applications for businesses,
              startups, and personal brands.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-8">
            <h3 className="font-semibold text-lg mb-2">
              Frontend Developer
            </h3>

            <p className="text-gray-600 text-sm mb-2">
              React / Next.js Projects
            </p>

            <p className="text-gray-600">
              Building responsive user interfaces and high-performance web
              apps using modern frameworks.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="bg-indigo-600 text-white py-16 text-center">

        <h2 className="text-3xl font-bold mb-4">
          Let’s Work Together
        </h2>

        <p className="mb-6 opacity-90">
          If you have a project or idea, feel free to reach out.
        </p>

        <Link
          href="/contact"
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Contact Me
        </Link>

      </section>

    </main>
  );
}