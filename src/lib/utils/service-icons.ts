import React from "react";
import Image from "next/image";
import {
  Shield,
  Smile,
  Award,
  Activity,
  Clock,
  Globe,
  Zap,
  Sparkles,
  CheckCircle2,
  Star,
  Target,
  Info,
  Check,
  Layers,
  MoveHorizontal,
  Crown,
  AlertTriangle,
  Wallet,
  Ban,
  Gem,
  Scan,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Bone,
  MapPin,
  Heart,
  Palette,
  X,
  Plus,
  Stethoscope,
  Scissors,
  Coffee,
  BookOpen,
  Apple,
  Grid,
  FileText,
  Microscope,
  AlertCircle,
  Package,
  ArrowDown,
  ArrowUp,
  Shuffle,
  CircleDot,
} from "lucide-react";

// runtime mapping of dynamic lucide components
export const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Shield,
  Smile,
  Award,
  Activity,
  Clock,
  Globe,
  Zap,
  Sparkles,
  CheckCircle2,
  Star,
  Target,
  Info,
  Check,
  Layers,
  MoveHorizontal,
  Crown,
  AlertTriangle,
  Wallet,
  Ban,
  Gem,
  Scan,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Bone,
  MapPin,
  Heart,
  Palette,
  X,
  Plus,
  Stethoscope,
  Scissors,
  Coffee,
  BookOpen,
  Apple,
  Grid,
  FileText,
  Microscope,
  AlertCircle,
  Package,
  ArrowDown,
  ArrowUp,
  Shuffle,
  CircleDot,
};

/**
 * Resolve an icon name or component reference to a component class.
 *
 * @param name - The name of the icon as a string, or an icon component reference.
 * @param fallback - The fallback icon component class if resolution fails.
 */
// dynamic component resolution and compatibility check
export function getIcon(
  name: string | React.ComponentType<{ className?: string }> | null | undefined,
  fallback: React.ComponentType<{ className?: string }> = Smile,
): React.ComponentType<{ className?: string }> {
  if (!name) return fallback;
  if (typeof name !== "string") return name;
  return ICON_MAP[name] || fallback;
}

/**
 * Dynamically infers a fallback icon component based on keywords in title and description.
 *
 * @param title - Section or card title.
 * @param desc - Description text.
 * @param defaultIcon - The default icon component if no keywords match.
 */
// accepts string or any react component class
export const getFallbackIconByContent = (
  title: string,
  desc: string,
  defaultIcon: React.ComponentType<{ className?: string }> = Smile,
): React.ComponentType<{ className?: string }> => {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes("crowded") || text.includes("overcrowd")) return Layers;
  if (text.includes("gap") || text.includes("space")) return MoveHorizontal;
  if (text.includes("overbite")) return ArrowDown;
  if (text.includes("underbite")) return ArrowUp;
  if (text.includes("crossbite")) return Shuffle;
  if (text.includes("open bite")) return CircleDot;
  if (
    text.includes("cardiovascular") ||
    text.includes("heart") ||
    text.includes("cardio")
  )
    return Heart;
  if (
    text.includes("diabete") ||
    text.includes("blood") ||
    text.includes("glycemic") ||
    text.includes("screening")
  )
    return Activity;
  if (
    text.includes("respiratory") ||
    text.includes("pulmonary") ||
    text.includes("lung") ||
    text.includes("infection")
  )
    return Shield;
  if (
    text.includes("hygiene") ||
    text.includes("clean") ||
    text.includes("scaling") ||
    text.includes("plaque") ||
    text.includes("tartar")
  )
    return Smile;
  if (
    text.includes("exam") ||
    text.includes("checkup") ||
    text.includes("diagnostic") ||
    text.includes("pricing") ||
    text.includes("cost") ||
    text.includes("fees")
  )
    return FileText;
  if (
    text.includes("canal") ||
    text.includes("root") ||
    text.includes("pulp") ||
    text.includes("technology") ||
    text.includes("equipment")
  )
    return Microscope;
  if (
    text.includes("extraction") ||
    text.includes("remove") ||
    text.includes("wisdom")
  )
    return AlertCircle;
  if (text.includes("denture") || text.includes("prosthodontics"))
    return Package;

  if (
    text.includes("sensitive") ||
    text.includes("sensitivity") ||
    text.includes("pain") ||
    text.includes("discomfort") ||
    text.includes("risk") ||
    text.includes("bleeding")
  ) {
    return AlertTriangle;
  }
  if (
    text.includes("not recommended") ||
    text.includes("avoid") ||
    text.includes("con") ||
    text.includes("cons") ||
    text.includes("limit")
  ) {
    return Ban;
  }
  if (
    text.includes("experience") ||
    text.includes("expert") ||
    text.includes("doctor") ||
    text.includes("certified") ||
    text.includes("qualification") ||
    text.includes("qualifications") ||
    text.includes("non-vital") ||
    text.includes("internal")
  ) {
    return ShieldCheck;
  }
  if (
    text.includes("zirconia") ||
    text.includes("e.max") ||
    text.includes("gold") ||
    text.includes("porcelain") ||
    text.includes("material") ||
    text.includes("gem") ||
    text.includes("beauty") ||
    text.includes("aesthetic")
  ) {
    return Gem;
  }
  if (
    text.includes("decay") ||
    text.includes("fracture") ||
    text.includes("root") ||
    text.includes("bite") ||
    text.includes("grinding") ||
    text.includes("strength") ||
    text.includes("strong") ||
    text.includes("jaw")
  ) {
    return Bone;
  }
  if (
    text.includes("duration") ||
    text.includes("lifespan") ||
    text.includes("time") ||
    text.includes("year") ||
    text.includes("years") ||
    text.includes("fast") ||
    text.includes("hour") ||
    text.includes("hours") ||
    text.includes("longevity") ||
    text.includes("last") ||
    text.includes("efficiency") ||
    text.includes("session") ||
    text.includes("many")
  ) {
    return Clock;
  }
  if (
    text.includes("visit") ||
    text.includes("appointment") ||
    text.includes("checkup") ||
    text.includes("schedule") ||
    text.includes("calendar")
  ) {
    return Calendar;
  }
  if (
    text.includes("scan") ||
    text.includes("milling") ||
    text.includes("cad/cam") ||
    text.includes("digital") ||
    text.includes("3d") ||
    text.includes("design") ||
    text.includes("technology") ||
    text.includes("modern") ||
    text.includes("latest")
  ) {
    return Scan;
  }
  if (
    text.includes("price") ||
    text.includes("cost") ||
    text.includes("budget") ||
    text.includes("charge") ||
    text.includes("dollar") ||
    text.includes("vnd") ||
    text.includes("đ") ||
    text.includes("saving") ||
    text.includes("affordable") ||
    text.includes("cheap")
  ) {
    return Wallet;
  }
  if (
    text.includes("safe") ||
    text.includes("safety") ||
    text.includes("protect") ||
    text.includes("care") ||
    text.includes("hygiene") ||
    text.includes("clean") ||
    text.includes("brush") ||
    text.includes("floss") ||
    text.includes("durable") ||
    text.includes("crown") ||
    text.includes("restoration") ||
    text.includes("enamel")
  ) {
    return Shield;
  }
  if (
    text.includes("in-office") ||
    text.includes("office") ||
    text.includes("power")
  )
    return Zap;
  if (text.includes("combination") || text.includes("combined"))
    return Sparkles;
  if (
    text.includes("smile") ||
    text.includes("natural") ||
    text.includes("bright") ||
    text.includes("white") ||
    text.includes("whiten")
  ) {
    return Smile;
  }
  if (
    text.includes("english") ||
    text.includes("communication") ||
    text.includes("support") ||
    text.includes("international") ||
    text.includes("airport") ||
    text.includes("travel")
  ) {
    return Globe;
  }
  return defaultIcon;
};

/**
 * Dynamic Icon renderer helper function that can handle CMS images or Lucide React components.
 *
 * @param icon - Raw icon name or URL.
 * @param className - Sizing and styling classes.
 * @param title - Fallback text context for keyword match.
 * @param desc - Fallback text context for keyword match.
 * @param defaultIcon - Default icon component.
 */
// used for dynamic component class resolution
export const renderServiceIcon = (
  icon: string | React.ComponentType<{ className?: string }> | null | undefined,
  className: string = "w-6 h-6",
  title: string = "",
  desc: string = "",
  defaultIcon: React.ComponentType<{ className?: string }> = Smile,
): React.ReactNode => {
  if (
    typeof icon === "string" &&
    (icon.startsWith("http") ||
      icon.startsWith("/") ||
      icon.includes("/uploads/"))
  ) {
    return React.createElement(Image, {
      src: icon,
      alt: "Service Icon",
      width: 24,
      height: 24,
      className: "w-full h-full object-contain p-2",
    });
  }
  const resolved =
    typeof icon === "string" || !icon
      ? getFallbackIconByContent(title, desc, getIcon(icon, defaultIcon))
      : icon;

  const IconComp = resolved;
  return React.createElement(IconComp, { className });
};
