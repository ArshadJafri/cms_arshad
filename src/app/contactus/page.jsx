"use client";

import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Header from '../components/Header';

const ContactUs = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleClick = (e) => {
        e.preventDefault(); // Prevent form submission

        // Validate the form
        if (!subject || !message) {
            setError('Please fill out both fields.');
            return;
        }

        // Send email using EmailJS
        const emailParams = {
            subject: subject,
            message: message,
            to_email: "arshadjafrisheikh@gmail.com", // Replace with the email you want to send to
        };

        // Replace these with your actual EmailJS service, template, and user ID
        emailjs.send('service_pwj9ln8', 'template_4nmkanj', emailParams, 'D82sDNtMAdngS3zNM')
            .then((response) => {
                console.log('Email sent successfully:', response);
                alert("Message sent successfully!");
                
                // Reset form
                setSubject('');
                setMessage('');
                setError('');
            })
            .catch((error) => {
                console.error('Error sending email:', error);
                alert("There was an error sending your message. Please try again.");
            });
    };

    return (
        <div>
            <Header />
            <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ color: '#333', marginBottom: '20px' }}>
                    <h1>Contact Us</h1>
                </div>
                <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                        <label htmlFor="subject" style={{ marginBottom: '5px', color: '#555' }}>Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                        <label htmlFor="message" style={{ marginBottom: '5px', color: '#555' }}>Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', resize: 'vertical', minHeight: '150px', width: '100%' }}
                        ></textarea>
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                    <button
                        onClick={handleClick}
                        type="submit"
                        style={{ backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s ease', padding: '10px', borderRadius: '4px' }}
                    >
                        Submit
                    </button>
                </form>
                <div style={{ marginTop: '20px', color: '#555' }}>
                    <h2>Contact Information</h2>
                    <p>Email: contact@conference.com</p>
                    <p>Phone: +1234567890</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <h2>Conference Location</h2>
                    <p>701 S. Nedderman Drive, Arlington, TX 76019</p>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3356.299350774947!2d-97.1167216848197!3d32.7318419809846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e7e7d1f8e6e3d%3A0x8d8f8f8f8f8f8f8f!2sUniversity%20of%20Texas%20at%20Arlington!5e0!3m2!1sen!2sus!4v1616161616161!5m2!1sen!2sus"
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Conference Location"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
