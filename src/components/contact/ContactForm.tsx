"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { AlertCircle, Send, CheckCircle2 } from "lucide-react";

import { Button, Card } from "@/src/components/ui";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { useBookingModal } from "@/src/components/booking-modal/BookingModalContext";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { contactFormSchema, type ContactFormData } from "@/src/lib/validations/contact-form";
import { ServiceDropdown } from "./ServiceDropdown";

export interface ContactFormProps {
  title?: string;
  description?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  serviceLabel?: string;
  servicePlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  serviceOptions?: string[];
}

export function ContactForm({ data }: { data?: ContactFormProps }) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    phoneNumber: "",
    service: "",
    otherService: "",
    message: "",
    recaptchaToken: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showOtherService, setShowOtherService] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  // Pull service list from the same nav API used by the header dropdown
  const { serviceOptions: navServiceOptions } = useBookingModal();
  const serviceList =
    navServiceOptions && navServiceOptions.length > 0
      ? navServiceOptions
      : data?.serviceOptions || [];

  // Get reCAPTCHA hook
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Show/hide "Other" service input
    if (field === "service") {
      setShowOtherService(value === "Other");
      if (value !== "Other") {
        setFormData((prev) => ({ ...prev, otherService: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setErrors({});
    setSubmitStatus("idle");

    // Check if reCAPTCHA is loaded
    if (!executeRecaptcha) {
      setSubmitStatus("error");
      return;
    }

    // Execute reCAPTCHA
    let recaptchaToken: string;
    try {
      recaptchaToken = await executeRecaptcha("booking_form");
    } catch {
      setSubmitStatus("error");
      return;
    }

    // Add reCAPTCHA token to form data
    const dataWithToken = {
      ...formData,
      recaptchaToken,
    };

    // Validate
    const result = contactFormSchema.safeParse(dataWithToken);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ContactFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Submit
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setSubmitStatus("success");
        toast.success("Request sent successfully!", {
          description: "Our team will contact you within 24 hours.",
          duration: 5000,
        });
        // Reset form
        setFormData({
          fullName: "",
          phoneNumber: "",
          service: "",
          otherService: "",
          message: "",
          recaptchaToken: "",
        });
        setShowOtherService(false);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { shouldSimplify } = useMobileAnimation();

  if (!data) return null;

  return (
    <Card
      className={`p-6 md:p-8 bg-white/90 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${shouldSimplify ? "" : "backdrop-blur-xl"}`}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{data.title}</h3>
        {data.description && (
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
            {data.description}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <PerformanceAnimation preset="slide-up-subtle" delay={0}>
          <label
            htmlFor="fullName"
            className="text-sm sm:text-base md:text-lg block font-bold text-slate-700 mb-2"
          >
            {data.nameLabel}
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder={data.namePlaceholder}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.fullName
                ? "border-red-300 focus:ring-red-500"
                : "border-slate-200 focus:ring-blue-500"
            } focus:ring-2 focus:outline-none transition-all`}
          />
          {errors.fullName && (
            <p className="text-xs sm:text-sm md:text-base mt-1 text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.fullName}
            </p>
          )}
        </PerformanceAnimation>

        {/* Phone Number */}
        <PerformanceAnimation preset="slide-up-subtle" delay={0.1}>
          <label
            htmlFor="phoneNumber"
            className="text-xs sm:text-sm md:text-base block font-bold text-slate-700 mb-2"
          >
            {data.phoneLabel}
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder={data.phonePlaceholder}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.phoneNumber
                ? "border-red-300 focus:ring-red-500"
                : "border-slate-200 focus:ring-blue-500"
            } focus:ring-2 focus:outline-none transition-all`}
          />
          {errors.phoneNumber && (
            <p className="text-xs sm:text-sm md:text-base mt-1 text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phoneNumber}
            </p>
          )}
        </PerformanceAnimation>

        {/* Service Selection */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          delay={0.3}
          className={`relative transition-all duration-300 ${isServiceDropdownOpen ? "z-[100]" : "z-0"}`}
        >
          <label
            htmlFor="service"
            className="text-xs sm:text-sm md:text-base block font-bold text-slate-700 mb-2"
          >
            {data.serviceLabel}
          </label>
          <ServiceDropdown
            value={formData.service}
            options={serviceList}
            placeholder={data.servicePlaceholder || "Select a service..."}
            onChange={(val) => handleChange("service", val)}
            hasError={!!errors.service}
            onOpenChange={setIsServiceDropdownOpen}
          />
          {errors.service && (
            <p className="text-xs sm:text-sm md:text-base mt-1 text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.service}
            </p>
          )}
        </PerformanceAnimation>

        {/* Other Service (Conditional) */}
        {showOtherService && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label
              htmlFor="otherService"
              className="text-xs sm:text-sm md:text-base block font-bold text-slate-700 mb-2"
            >
              Please specify the service
            </label>
            <input
              type="text"
              id="otherService"
              value={formData.otherService}
              onChange={(e) => handleChange("otherService", e.target.value)}
              placeholder="Enter the service you need"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.otherService
                  ? "border-red-300 focus:ring-red-500"
                  : "border-slate-200 focus:ring-blue-500"
              } focus:ring-2 focus:outline-none transition-all`}
            />
            {errors.otherService && (
              <p className="text-xs sm:text-sm md:text-base mt-1 text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.otherService}
              </p>
            )}
          </MotionDiv>
        )}

        {/* Message */}
        <PerformanceAnimation preset="slide-up-subtle" delay={0.4}>
          <label
            htmlFor="message"
            className="text-xs sm:text-sm md:text-base block font-bold text-slate-700 mb-2"
          >
            {data.messageLabel}
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder={data.messagePlaceholder}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
          />
        </PerformanceAnimation>

        {/* Submit Button */}
        <PerformanceAnimation preset="slide-up-subtle" delay={0.5}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                {data.submitButtonText}
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </PerformanceAnimation>

        {/* Success Message */}
        {submitStatus === "success" && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm md:text-base text-emerald-800 font-medium">
              {data.successMessage}
            </p>
          </MotionDiv>
        )}

        {/* Error Message */}
        {submitStatus === "error" && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm md:text-base text-red-800 font-medium">
              {data.errorMessage}
            </p>
          </MotionDiv>
        )}
      </form>
    </Card>
  );
}
