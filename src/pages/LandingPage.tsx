// src/pages/LandingPage.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    title: "How It Started",
    content:
      "She Can Foundation was founded by a group of individuals who shared a common vision of creating a world where every woman has the opportunity to thrive and succeed. With a shared passion and a determination to create positive change, we set out to make our vision a reality.",
    image: "/howstart.avif",
  },
  {
    title: "What is She Can?",
    content:
      "She Can Foundation is a non-profit organization dedicated to empowering women and creating a more equitable society. We provide support, resources, and training to women in communities across the globe through campaigns and initiatives.",
    image: "/who we.avif",
  },
  {
    title: "About Us",
    content:
      "We are a registered NGO under the Indian Society Act, 1860, committed to empowering women. Through our collaboration with local groups and our sustainable programs, we aim to revolutionize society and create a better world for all.",
    image: "/touch.avif",
  },
  {
    title: "The Story",
    content:
      "Join our team and make a difference in the lives of women in need. At She Can Foundation, we are committed to creating positive change across the globe. Be part of our mission—one woman at a time.",
    image: "/certificate.avif",
  },
  {
    title: "Donate Now",
    content:
      "With your support, we can continue to provide education, skill-building, and other opportunities to women. Your donation, no matter how small, can change lives and create a ripple effect of hope and empowerment.",
    image: "/donate.avif",
  },
  {
    title: "A Message from the Founder",
    content:
      "Together, we can break down barriers and empower women. Join us in our mission to create a world where every woman has the opportunity to thrive and succeed.",
    image: "/to.avif",
    author: "Reeta Mishra",
  },
];

const founderImages = ["/to.avif", "/get.avif", "/he.avif", "/r.avif"];

export default function LandingPage() {
  const [referralCode, setReferralCode] = useState("");
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const navigate = useNavigate();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const handleDonateClick = () => {
    const code = referralCode.trim() || "INT0BD0FA";
    navigate(`/donate/${code}`);
    setShowReferralModal(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      {/* Dynamic background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sections[activeSection].image}
          className="fixed inset-0 -z-10 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${sections[activeSection].image})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      </AnimatePresence>
      {/* Overlay */}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm -z-10" />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        <img src="/src/logo.png" alt="Logo" className="h-10" />
        <div className="space-x-6 font-medium text-sm text-gray-700">
          <a href="#about" className="hover:text-green-600">About</a>
          <button onClick={() => navigate("/auth")} className="hover:text-blue-600">Login / Sign Up</button>
          <button onClick={() => setShowReferralModal(true)} className="hover:text-green-600">Donate</button>
        </div>
      </nav>

      {/* Section Cards */}
      <div className="snap-y snap-mandatory h-screen overflow-y-auto">
        {sections.map((section, idx) => (
          <section
            key={idx}
            ref={(el) => (sectionRefs.current[idx] = el)}
            className="snap-start min-h-screen flex items-center justify-center px-6"
          >
            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-xl max-w-6xl w-full flex flex-col md:flex-row items-center gap-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold text-green-700">{section.title}</h2>
                <p className="text-gray-800 text-lg whitespace-pre-line">{section.content}</p>

                {section.author && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-xl font-bold italic text-green-700">Together, we can make a difference</h3>
                    <p className="text-sm italic text-gray-500">— {section.author}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {founderImages.map((img, i) => (
                        <motion.img
                          key={i}
                          src={img}
                          alt={`Founder ${i}`}
                          onClick={() => setModalImage(img)}
                          className="rounded-xl object-cover h-32 w-full cursor-pointer shadow-md hover:scale-105 transition-transform"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="md:w-1/2 flex justify-center">
                <motion.img
                  src={section.image}
                  alt={section.title}
                  onClick={() => setModalImage(section.image)}
                  className="rounded-2xl shadow-lg max-h-[300px] object-cover cursor-pointer hover:scale-105 transition-transform"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 mt-10 mb-4">
        © 2025 She Can Foundation ·{" "}
        <a href="mailto:president@shecanfoundation.org" className="underline hover:text-green-600">
          Contact Us
        </a>
      </footer>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalImage(null)}
          >
            <motion.img
              src={modalImage}
              alt="Preview"
              className="max-w-full max-h-full rounded-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Referral Modal */}
      <AnimatePresence>
        {showReferralModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReferralModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-auto"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-green-700 mb-4">Enter Referral Code</h2>
              <input
                type="text"
                placeholder="Referral Code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="border w-full px-4 py-2 mb-4 rounded-md"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonateClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Donate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
