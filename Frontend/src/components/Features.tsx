"use client"

import { FileText, Users, Workflow } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: FileText,
      title: "For Patients",
      description:
        "Submit your symptoms for AI-based preliminary insights and understand your eligibility for health schemes before your visit.",
    },
    {
      icon: Users,
      title: "For Doctors",
      description:
        "Receive pre-processed patient information and AI-supported summaries to make consultations faster and more efficient.",
    },
    {
      icon: Workflow,
      title: "Hospital Workflow",
      description: "Automate patient onboarding, document collection, and queue management to reduce wait times.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">A Better Way to Manage Healthcare</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how Ayushmitra transforms healthcare delivery for patients, doctors, and hospitals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
