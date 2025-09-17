"use client"

export function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-blue-600">Ayushmitra</div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              For Patients
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              For Doctors
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
