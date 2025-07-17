import React, { useEffect } from 'react';

export default function PrivacyPolicy() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="px-4 sm:px-6 md:px-10 py-10 max-w-6xl mx-auto text-gray-800">
            <h1 className="md:text-3xl text-2xl sm:text-3xl font-bold mb-6 text-center text-[#c0392b]">
                Shagun - Website Compliance Content
            </h1>

            {/* 1. Our Offerings */}
            <section className="md:mb-8 mb-6">
                <h2 className="md:text-xl text-lg font-semibold md:mb-2 mb-1 text-[#d35400]">1. Our Offerings</h2>
                <p className="mb-2 md:text-base text-sm">
                    Shagun provides seamless gifting experiences for Indian weddings and functions. Below are our key services:
                </p>
                <p className="md:mb-2 mb-1 md:text-base text-sm font-medium text-[#2980b9]">
                    Shagun Envelope Vending Machine - QR Gifting Setup
                </p>
                <p className="md:mb-2 mb-1 md:text-base text-sm">
                    Provide your guests with a seamless digital gifting experience using our QR-based envelope vending machines. Best suited for weddings and Indian traditional events.
                </p>
                <p className="md:mb-2 mb-1 md:text-base text-sm">
                    <strong className="text-[#27ae60]">Price:</strong> ₹1,999 per event Fixed service Fee.
                </p>
                <p className="md:mt-4 mt-2 md:mb-2 mb-1 md:text-base text-sm font-medium text-[#2980b9]">
                    Event Gifting Dashboard Access
                </p>
                <p className="md:mb-2 mb-1 md:text-base text-sm">
                    Track guest gift transactions in real-time, manage QR codes, and download reports for every function hosted.
                </p>
                <p className='md:text-base text-sm'>
                    <strong className="text-[#27ae60]">Price:</strong> ₹4,999 per event (including up to 200 envelopes & premier service, including pre-wedding shooting etc., video display on kiosk)
                </p>
            </section>

            {/* 2. Guest Payment Methods */}
            <section className="md:mb-8 mb-6">
                <h2 className="md:text-xl text-lg font-semibold md:mb-2 mb-1 text-[#d35400]">2. Guest Payment Methods (Interim Setup)</h2>
                <p className="mb-2 md:text-base text-sm">
                    Untill our Razorpay-powered payment infrastructure is live, Shagun currently supports two guest payment flows:
                </p>
                <p className="font-medium mb-1 md:text-base text-sm text-[#2980b9]">Direct Method (Currently Active)</p>
                <ul className="list-disc pl-5 space-y-1 mb-4 text-sm md:text-base">
                    <li>Guests scan a QR code linked directly to the host’s UPI ID.</li>
                    <li>Money is transferred directly to the host’s bank account.</li>
                    <li>This method is temporary and does not involve Shagun handling any money.</li>
                    <li>It is a pre-paid service.</li>
                </ul>
                <p className="font-medium mb-1 md:text-base text-sm text-[#2980b9]">Indirect Method (Upcoming Razorpay Integration)</p>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                    <li>Guests will scan a dynamic QR code generated via Razorpay API at Kiosk in event place.</li>
                    <li>The money will be received into a mapped Razorpay account..</li>
                    <li>Razorpay will auto-distribute the amount in split settlement method as per the standard settlement days agreed.</li>
                    <li>This feature will be activated post Razorpay onboarding and KYC approval.</li>
                </ul>
            </section>

            {/* 3. Terms and Conditions */}
            <section className="md:mb-8 mb-6">
                <h2 className="md:text-xl text-lg font-semibold md:mb-2 mb-1 text-[#d35400]">3. Terms and Conditions</h2>
                <h5 className='md:mb-2 mb-1 text-sm md:text-base'>By using Shagun services, users agree to the following terms:</h5>
                <ul className="list-disc pl-5 md:space-y-2 space-y-1 text-sm md:text-base">
                    <li>
                        <span className="text-[#e74c3c]">Services are provided exclusively</span> for personal and event-based gifting.
                    </li>
                    <li>
                        Hosts are responsible for uploading correct UPI details &amp; provide correct Bank Account details.
                    </li>
                    <li>
                        <span className="text-[#e74c3c]">Shagun is not liable</span> for failed UPI transactions.
                    </li>
                    <li>
                        Envelopes are dispensed based on <span className="text-[#2980b9]">prepaid configuration limits</span>.
                    </li>
                    <li>
                        <span className="text-[#e74c3c]">No refunds</span> are processed once the event has gone live.
                    </li>
                    <li>
                        All the hosts should adhere to <span className="text-[#2980b9]">Indian Tax Laws</span> and Shagun is not responsible with this.
                    </li>
                    <li>
                        Shagun is not handling the money nor holding the host’s money / guests’s money in any nature.
                    </li>
                    <li>
                        All legal matters and disputes will fall under the jurisdiction of courts in <span className="text-[#2980b9]">Secunderabad, Telangana</span>.
                    </li>
                </ul>

            </section>

            {/* 4. Refund and Cancellation Policy */}
            <section className="md:mb-8 mb-6">
                <h2 className="md:text-xl text-lg font-semibold md:mb-2 m-1 text-[#d35400]">4. Refund and Cancellation Policy</h2>
                <ul className="list-disc pl-5 md:space-y-2 space-y-1 text-sm md:text-base">
                    <li><span className="text-[#e74c3c]">No refunds</span> once the event starts or QR codes are activated.</li>
                    <li>70% refund available if event is cancelled <span className="text-[#2980b9]">48 hours prior</span>.</li>
                    <li>Refunds are issued to the original source within <span className="text-[#2980b9]">7 business days.</span> </li>
                    <li>Faulty vending issues may be evaluated for possible reimbursement.</li>
                </ul>
            </section>

            {/* 5. Privacy Policy */}
            <section className="md:mb-8 mb-6">
                <h2 className="md:text-xl text-lg font-semibold md:mb-2 mb-1 text-[#d35400]">5. Privacy Policy</h2>
                <h5 className='md:mb-2 mb-1 text-sm md:text-base'>We take your privacy seriously. Here is how we handle your information:</h5>
                <ul className="list-disc pl-5 md:space-y-2 space-y-1 text-sm md:text-base">
                    <li>No UPI data is stored by Shagun; transactions are routed securely.</li>
                    <li>No information is shared with third parties without user consent.</li>
                    <li>We comply with Indian IT and data privacy laws.</li>
                </ul>
            </section>

            {/* 6. Contact */}
            <section className="md:mb-8 mb-6">
                <h2 className="md:text-xl text-lg font-semibold md:mb-2 mb-1 text-[#d35400]">6. Contact Us</h2>
                <p className="text-sm sm:text-base">
                    For any support or inquiries, feel free to contact us:
                </p>
                <ul className="md:pl-5 pl-3 mt-2 text-sm md:text-base">
                    <li><strong>Email:</strong> <a href="mailto:info@myshagun.co.in" className="text-blue-600 underline">info@myshagun.co.in</a></li>
                    <li><strong>Phone:</strong> +91 9701513880</li>
                    <li><strong>Company:</strong> OKB INFOTECH (OPC) PRIVATE LIMITED</li>
                    <li><strong>Location:</strong> Hyderabad, Telangana, India</li>
                </ul>
            </section>
        </div>
    );
}
