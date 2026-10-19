export interface Service {
  slug: string;
  icon: string;
  title: string;
  audience: "Patients" | "Doctors";
  short: string;
  intro: string;
  points: string[];
  soon?: boolean;
}

export const services: Service[] = [
  {
    slug: "online-booking",
    icon: "📅",
    title: "Online booking",
    audience: "Patients",
    short: "Choose a doctor and a time, and book in a few taps.",
    intro: "Skip the phone calls and the queues. Pick a doctor, pick a time, and your appointment is confirmed.",
    points: [
      "Choose from all registered doctors",
      "Date picker blocks times in the past",
      "A doctor can't be double-booked at the same time",
      "Every booking appears in your appointments list",
    ],
  },
  {
    slug: "find-a-doctor",
    icon: "🔍",
    title: "Find a doctor",
    audience: "Patients",
    short: "Search doctors by name or specialization.",
    intro: "Browse everyone on the platform and narrow the list as you type.",
    points: [
      "Live search by name or specialization",
      "One-tap Book button with the doctor pre-selected",
      "Clear message when no doctor matches",
    ],
  },
  {
    slug: "manage-appointments",
    icon: "📋",
    title: "Manage appointments",
    audience: "Patients",
    short: "See upcoming and past visits, and cancel when plans change.",
    intro: "All your visits in one list, with a clear status on each.",
    points: [
      "Status badges: Scheduled, Completed, Cancelled",
      "Cancel a scheduled appointment yourself",
      "A cancelled slot becomes free for others",
    ],
  },
  {
    slug: "doctor-dashboard",
    icon: "🩺",
    title: "Doctor dashboard",
    audience: "Doctors",
    short: "See your schedule and mark visits as completed.",
    intro: "Doctors get a focused view of their own appointments and nothing else.",
    points: [
      "See your upcoming appointments and patient names",
      "Mark a visit as completed",
      "Only your own schedule is visible to you",
    ],
  },
  {
    slug: "video-consultations",
    icon: "🎥",
    title: "Video consultations",
    audience: "Patients",
    short: "Meet your doctor online from home.",
    intro: "A Join call button on every scheduled appointment, so patient and doctor meet in a private room.",
    points: ["Private room for each appointment", "No extra app to install", "Planned for a future release"],
  },
  {
    slug: "reminders",
    icon: "🔔",
    title: "Appointment reminders",
    audience: "Patients",
    short: "Get a reminder before your visit.",
    intro: "A message the day before and an hour before, so nobody forgets.",
    points: ["SMS or email reminders", "Fewer missed appointments", "Planned for a future release"],
    soon: true,
  },
];