// import React from "react";
// import FAQsSection from "./FAQsSection";
// import StudentGuide from "./StudentGuide";
// import AlumniGuide from "./AlumniGuide";
// import ContactSupport from "./ContactSupport";
// import PoliciesSection from "./PoliciesSection";
// import AdminDashboard from "./AdminDashboard";
// import ReportProblem from "./ReportProblem";
// import Feedback from "./Feedback";

// export default function HelpSupportPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800">
//       {/* Header */}
//       <header className="bg-blue-600 text-white py-6 text-center shadow-md">
//         <h1 className="text-3xl font-semibold">Help & Support</h1>
//         <p className="text-blue-100 mt-2">
//           We're here to assist you — explore guides, policies, and FAQs.
//         </p>
//       </header>

//       {/* Content Sections */}
//       <main className="max-w-6xl mx-auto p-6 space-y-10">
//         <FAQsSection />
//         <StudentGuide />
//         <AlumniGuide />
//         <ContactSupport />
//         <PoliciesSection />
//         <AdminDashboard />
//         <ReportProblem />
//         <Feedback />
//       </main>

//       {/* Footer */}
//       <footer className="bg-blue-600 text-white text-center py-4 mt-10">
//         © {new Date().getFullYear()} YourCompany | All rights reserved.
//       </footer>
//     </div>
//   );
// }


// import React from "react";
// import FAQsSection from "./FAQsSection";
// import StudentGuide from "./StudentGuide";
// import AlumniGuide from "./AlumniGuide";
// import ContactSupport from "./ContactSupport";
// import PoliciesSection from "./PoliciesSection";
// import AdminDashboard from "./AdminDashboard";
// import ReportProblem from "./ReportProblem";
// import Feedback from "./Feedback";

// export default function HelpSupportPage() {
//   return (
//     <div className="min-h-screen bg-[#0b041a] text-gray-200">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-purple-700 to-blue-600 py-10 text-center shadow-lg">
//         <h1 className="text-4xl font-semibold text-white tracking-wide">
//           Help & Support
//         </h1>
//         <p className="text-gray-200 mt-2 text-lg">
//           We’re here to assist you — explore guides, policies, and FAQs.
//         </p>
//       </header>

//       {/* Content */}
//       <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
//         <section className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)]">
//           <FAQsSection />
//         </section>

//         <section className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)]">
//           <StudentGuide />
//         </section>

//         <section className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)]">
//           <AlumniGuide />
//         </section>

//         <section className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)]">
//           <ContactSupport />
//         </section>

//         <section className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)]">
//           <ReportProblem />
//         </section>

//         <section className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)]">
//           <Feedback />
//         </section>

//         <section className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)]">
//           <PoliciesSection />
//         </section>

//         <section className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)]">
//           <AdminDashboard />
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="bg-[#13052a] text-gray-300 text-center py-6 mt-12 border-t border-purple-800/30">
//         © {new Date().getFullYear()} YourCompany | All Rights Reserved.
//       </footer>
//     </div>
//   );
// }


// import React from "react";
// import FAQsSection from "../components/HelpSupport/FAQsSection";
// import StudentGuide from "../components/HelpSupport/StudentGuide";
// import AlumniGuide from "../components/HelpSupport/AlumniGuide";
// import ContactSupport from "../components/HelpSupport/ContactSupport";
// import PoliciesSection from "../components/HelpSupport/PoliciesSection";
// import AdminDashboard from "../components/HelpSupport/AdminDashboard";
// import ReportProblem from "../components/HelpSupport/ReportProblem";
// import Feedback from "../components/HelpSupport/Feedback";
// import Navbar from '../components/Navbar';
// import withSidebarToggle from '../hocs/withSidebarToggle';

// export default function HelpSupportPage({onSidebarToggle}) {
//   return (
//     <>
//     <Navbar onSidebarToggle={onSidebarToggle} />
//     <div className="min-h-screen bg-[#0b041a] text-gray-200 overflow-x-hidden">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-purple-700 to-blue-600 py-10 text-center shadow-lg">
//         <h1 className="text-4xl font-semibold text-white tracking-wide">
//           Help & Support
//         </h1>
//         <p className="text-gray-200 mt-2 text-lg">
//           We’re here to assist you — explore guides, policies, and FAQs.
//         </p>
//       </header>

//       {/* Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
//         {[
//           FAQsSection,
//           StudentGuide,
//           AlumniGuide,
//           ContactSupport,
//           ReportProblem,
//           Feedback,
//           PoliciesSection,
//           AdminDashboard,
//         ].map((Section, index) => (
//           <section
//             key={index}
//             className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_20px_rgba(128,0,255,0.15)] w-full overflow-hidden"
//           >
//             <Section />
//           </section>
//         ))}
//       </main>

//       {/* Footer */}
//       <footer className="bg-[#13052a] text-gray-300 text-center py-6 mt-12 border-t border-purple-800/30">
//         © {new Date().getFullYear()} B07 | All Rights Reserved.
//       </footer>
//     </div>
//     </>
//   );
// }

import React from "react";
import FAQsSection from "../components/HelpSupport/FAQsSection";
import StudentGuide from "../components/HelpSupport/StudentGuide";
import AlumniGuide from "../components/HelpSupport/AlumniGuide";
import ContactSupport from "../components/HelpSupport/ContactSupport";
import PoliciesSection from "../components/HelpSupport/PoliciesSection";
import AdminDashboard from "../components/HelpSupport/AdminDashboard";
import ReportProblem from "../components/HelpSupport/ReportProblem";
import Feedback from "../components/HelpSupport/Feedback";
import Navbar from "../components/Navbar";

export default function HelpSupportPage({ onSidebarToggle }) {
  return (
    <>
      <Navbar onSidebarToggle={onSidebarToggle} />
      <div className="min-h-screen bg-[#0b041a] text-gray-200 overflow-x-hidden flex flex-col">
        {/* Header */}
        <header className="bg-[#15072b] py-16 px-4 text-center shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-white tracking-wide drop-shadow-lg">
              Help & Support
            </h1>
            <p className="text-gray-200 mt-4 text-lg sm:text-xl leading-relaxed">
              We’re here to assist you — explore guides, policies, and FAQs.
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          {[
            FAQsSection,
            StudentGuide,
            AlumniGuide,
            ContactSupport,
            ReportProblem,
            Feedback,
            PoliciesSection,
            AdminDashboard,
          ].map((Section, index) => (
            <section
              key={index}
              className="bg-[#15072b] rounded-3xl p-8 shadow-[0_0_25px_rgba(128,0,255,0.2)] w-full overflow-hidden transition-transform hover:scale-[1.01] duration-300"
            >
              <Section />
            </section>
          ))}
        </main>

        {/* Footer */}
        <footer className="bg-[#13052a] text-gray-400 text-center py-6 mt-12 border-t border-purple-800/30 text-sm">
          © {new Date().getFullYear()} B07 | All Rights Reserved.
        </footer>
      </div>
    </>
  );
}

