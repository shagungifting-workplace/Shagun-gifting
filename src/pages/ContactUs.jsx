import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaInstagram,
    FaFacebookF,
    FaLinkedin,
} from "react-icons/fa";
import emailjs from 'emailjs-com';
import { useState } from "react";
import toast from "react-hot-toast";

const FloatingInput = ({ label, name, type = "text", value, onChange, required = false }) => {
    return (
        <div className="relative w-full">
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                required={required}
                onChange={onChange}
                placeholder={label}
                className="peer h-14 w-full border-2 border-gray-300 rounded-lg px-3 pt-6 text-sm placeholder-transparent focus:outline-none focus:border-[#f45b0b] transition-all"
            />
            <label
                htmlFor={name}
                className="absolute left-3 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#f45b0b]"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        </div>
    );
};

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        emailjs.send(
            service_id,
            template_id,
            formData,
            public_key
        )
        .then(() => {
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', phone: '', message: '' });
        })
        .catch(() => {
            toast.error('Failed to send message. Try again.');
        });
    };

    return (
        <section className="bg-[#fef3eb] px-4 md:py-10 py-5">

            {/* form */}
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="sm:text-4xl text-3xl font-bold text-[#f45b0b] mb-3">Get in Touch</h2>
                <p className="text-gray-700 md:mb-10 mb-5">
                    Whether you have questions about Shagun’s kiosks, need event support,
                    or want to partner with us, just fill out the form and we'll respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="md:space-y-6 space-y-4 text-left">
                    <FloatingInput
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <FloatingInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FloatingInput
                        label="Phone (Optional)"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <div className="relative w-full">
                        <textarea
                            name="message"
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Message"
                            className="peer w-full border-2 border-gray-300 rounded-lg px-3 pt-6 text-sm placeholder-transparent focus:outline-none focus:border-[#f45b0b]"
                        ></textarea>
                        <label
                            htmlFor="message"
                            className="absolute left-3 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#f45b0b]"
                        >
                            Message <span className="text-red-500">*</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="border text-[#A44B56] border-[#F4B5A1] md:py-3 md:px-6 py-2 px-4 rounded-lg font-semibold hover:bg-white transition-all duration-300"
                    >
                        Send a request
                    </button>
                </form>
            </div>

            {/* Contact Info */}
            <div className="mt-16 text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-6">Or Reach Us Directly</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm sm:text-base">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaEnvelope className="text-gray-600" />
                        info@myshagun.co.in
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaInstagram className="text-gray-600" />
                        @myshagun
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaPhoneAlt className="text-gray-600" />
                        +91 97015 13880
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaFacebookF className="text-gray-600" />
                        /myshagun
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaMapMarkerAlt className="text-gray-600" />
                        Hyderabad, Telangana
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaLinkedin className="text-gray-600" />
                        /company/myshagun
                    </div>
                </div>
            </div>
        </section>
    );
}
