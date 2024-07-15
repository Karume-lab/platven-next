export default {
  MESSAGE: {
    REQUEST_PROPERTY_CLIENT: `
Dear {{client_name}},

Thank you for your interest in {{property_title}} on Platven. We have received your request and one of our agents will reach out to you shortly with further details or to schedule a viewing.
        
If you have any immediate questions, feel free to reply to this email or call our support line at +254720009306.
        
Best regards,  
The Platven Team
        `,
    REQUEST_PROPERTY_ADMIN: `
Hello {{staff_name}},

A new property request has been submitted by {{client_name}} for {{property_title}}. Please review the client's inquiry and follow up promptly to assist them with their request.

    Client Contact: {{client_phone}}, {{client_email}}
    Requested Property: {{property_link}}

Thank you for your prompt attention to this request.

Best regards,  
Platven Support Team
        `,
    RESET_PASSWORD: `
Hi {{name}},

We received a request to reset your password for your Platven account.

If you requested this reset, please click the link below to choose a new password:

Reset password Link: {{reset_password_link}}

This link will expire in 2 hours.

If you didn't request a password reset, you can safely ignore this email. However, we recommend that you keep your password strong and unique to protect your account.
        `,
    STAFF_ACCOUNT_SETUP: `
  Hi {{staff_name}},

  We're thrilled to welcome you to the Platven team!
  
  This email contains your temporary login credentials to get you started on our platform.
  
  Email: {{staff_email}}
  Password: {{staff_password}}

  Important:
  
  For security reasons, we strongly recommend that you change your password upon your first login. You can easily do this by navigating to your profile settings after logging in.
  Keep your password confidential and avoid sharing it with anyone.
  Getting Started:
  
  To access the Platven platform, use the provided credentials and visit:
  
  {{platven_login_url}}
  
  We recommend exploring the platform and familiarizing yourself with the resources available to you. If you have any questions or need assistance getting started, please don't hesitate to reach out to your manager or the Platven support team at {{support_email}}.
  
    
  The Platven Team
  `,
    ACCOUNT_VERIFICATION: `
Dear {{user_name}},

Welcome to Platven! 

To complete your account setup, please verify your email by clicking the link below:

Verification Link: {{verification_link}}

If you did not sign up for a Platven account, please ignore this email.

Best regards,  
The Platven Team
`,
  },
  contact: {
    phoneNumber: "+254720009306",
    email: "support@platven.ke",
    contactPeople: [
      { email: "mary.nyambura@platven.ke", name: "Mary Nyambura" },
      { email: "Jacob.kariuki@platven.ke", name: "Jacob Kariuki" },
    ],
  },
};
