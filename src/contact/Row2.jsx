import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  MapPin,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

function Row2() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Contact message:", formData);
    toast.success("Message sent! We'll get back to you shortly.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="bg-dark-50 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-7 lg:p-8"
          >
            <div className="mb-7 flex items-center gap-3 border-b border-dark-100 pb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <MessageSquare size={20} className="text-primary-500" />
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-dark-950">
                  Send us a message
                </h3>

                <p className="mt-1 text-xs text-dark-400">
                  We usually respond within a few hours.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0800 000 0000"
                    className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                  className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 px-4 text-sm text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  required
                  className="w-full resize-none rounded-xl border border-dark-200 bg-dark-50 p-4 text-sm text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover"
            >
              Send Message
              <Send size={16} />
            </button>
          </form>

          {/* Info aside */}
          <aside className="relative overflow-hidden rounded-3xl bg-dark-950 p-6 text-white sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-500/15 blur-2xl" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500">
                <MapPin size={20} />
              </div>

              <h3 className="mt-6 font-heading text-xl font-bold">
                Find us here
              </h3>

              <p className="mt-3 text-sm leading-6 text-dark-300">
                Lagos, Nigeria. Open every day for dine-in, pickup, and
                delivery.
              </p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=85"
                  alt="Map preview of restaurant location"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              <div className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm text-dark-300">
                <p>+234 000 000 0000</p>
                <p>hello@resvill.com</p>
                <p>Mon - Sun: 9AM - 10PM</p>
              </div>

              <div className="mt-7 flex items-center gap-2">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <FaFacebookF size={13} />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <FaInstagram size={14} />
                </a>

                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <FaTwitter size={13} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Row2;
