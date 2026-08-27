# Contact Page Components

This directory contains sub-components extracted from the `ContactPageClient` route view to ensure a modular architecture and clean code structure.

## Components List

### 1. `HeroSection`
- **Path**: `src/components/contact/HeroSection.tsx`
- **Purpose**: Displays the top of the contact page, incorporating backgrounds, trust parameters, features, actions, and embedding the `ContactForm`.

### 2. `ContactForm`
- **Path**: `src/components/contact/ContactForm.tsx`
- **Purpose**: Handles full interactive fields for client inquiry (Full Name, Phone, Service pick, custom specify text input, messages), verification via reCAPTCHA, and sending requests to `/api/contact`.

### 3. `ServiceDropdown`
- **Path**: `src/components/contact/ServiceDropdown.tsx`
- **Purpose**: Fully custom search select dropdown list used for pickup lists inside the form.
