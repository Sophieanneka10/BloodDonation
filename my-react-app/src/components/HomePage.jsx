import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <div className="hero-section bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full">
          {/* Navigation */}
          <nav className="py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-8">
                <Link to="/" className="text-2xl font-bold text-[#f84444]">RedWeb</Link>
                <div className="flex items-center gap-6">
                  <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                  <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/signin" className="text-gray-600 hover:text-gray-900">Sign In</Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-[#f84444] text-white rounded hover:bg-[#d63a3a] transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </nav>

          {/* Hero content */}
          <div className="hero-content pt-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="pl-2">
                <h1 className="text-7xl font-bold tracking-tight text-gray-900 mb-8">
                  Save Lives Through{" "}
                  <span className="text-[#f84444] block mt-2">Blood Donation</span>
                </h1>
                <p className="text-2xl text-gray-600 mb-12 max-w-xl">
                  Join our community of blood donors and help save lives. Every donation counts and can help up to three people in need.
                </p>
                <div className="flex gap-6">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-[#f84444] text-white text-lg rounded hover:bg-[#d63a3a] transition-colors font-medium"
                  >
                    Register to Donate
                  </Link>
                  <Link
                    to="/signin"
                    className="px-8 py-4 bg-red-50 text-[#f84444] text-lg rounded hover:bg-red-100 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base font-semibold text-[#f84444] uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-5xl font-bold text-gray-900">Why Choose RedWeb?</p>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes blood donation simple, efficient, and impactful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f84444]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-gray-600 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-[#f84444] py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to save lives? Start donating today.
          </h2>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-[#f84444] text-lg rounded-md hover:bg-red-50 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: "Easy Registration",
    description: "Simple and quick registration process for new donors. Get started in minutes and join our community of lifesavers.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    name: "Donation Tracking",
    description: "Keep track of your donation history and see the real impact you are making in your community.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  {
    name: "Emergency Alerts",
    description: "Receive instant notifications when there is an urgent need for your blood type in your area.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  },
  {
    name: "Nearby Centers",
    description: "Easily find blood donation centers in your vicinity with our location-based search feature.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export default HomePage;
