import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"
// import ContactForm from "@/app/components/contactform"

export default function ContactPage() {
  return (
    <div className="flex bg-black text-white min-h-screen">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="p-8">

          {/* <div className="mb-6">
            <h1 className="text-3xl font-semibold">Contact Us</h1>
            <p className="text-gray-400">
              Reach out to our team for support, queries, or partnership opportunities.
            </p>
          </div> */}

          {/* <ContactForm /> */}

        </main>
      </div>
    </div>
  )
}