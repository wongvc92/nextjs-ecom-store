"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

const RESOURCES = [
  { id: 1, label: "Find A Store", path: "#" },
  { id: 2, label: "Become A Member", path: "#" },
  { id: 3, label: "Student Discounts", path: "#" },
  { id: 4, label: "Send Us Feedback", path: "#" },
];

const HELP = [
  { id: 1, label: "Get Help", path: "#" },
  { id: 2, label: "Order Status", path: "#" },
  { id: 3, label: "Delivery", path: "#" },
  { id: 4, label: "Returns", path: "#" },
  { id: 4, label: "Payment Options", path: "#" },
  { id: 4, label: "Contact Us", path: "#" },
];

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { data } = useSession();
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  return (
    <footer className="h-[400px] w-full md:container grid md:grid-cols-3 border-t">
      <div className="py-10 px-4">
        <div className="flex flex-col gap-6 py-2">
          <div className={`flex justify-between items-center cursor-pointer`} onClick={() => toggleSection("resources")}>
            <h4>Resources</h4>
            <ChevronDown className={`transition-transform duration-300 ${openSection === "resources" ? "rotate-180" : ""}`} />
          </div>

          <div
            className={`space-y-2 transition-all duration-300 ease-out ${
              openSection === "resources" ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            {RESOURCES.map((item) => (
              <ul key={item.id} className="text-sm text-muted-foreground hover:text-black dark:hover:text-white">
                <li>
                  <Link href={item.path}>{item.label}</Link>
                </li>
              </ul>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 py-2">
          <div className={`flex justify-between items-center cursor-pointer`} onClick={() => toggleSection("help")}>
            <h4>Help</h4>
            <ChevronDown className={`transition-transform duration-300 ${openSection === "help" ? "rotate-180" : ""}`} />
          </div>

          <div
            className={`space-y-2 transition-all duration-300 ease-out ${
              openSection === "help" ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            {HELP.map((item) => (
              <ul key={item.id} className="text-sm text-muted-foreground hover:text-black dark:hover:text-white">
                <li>
                  <Link href={item.path}>{item.label}</Link>
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
