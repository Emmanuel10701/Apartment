// pages/index.tsx
"use client"
import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import Card from "../components/apartment2/page"
import {
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaCloudDownloadAlt,
  FaCalendarCheck,
  FaUsers,
  FaDollarSign,
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaPlus,
  FaEllipsisV,
  FaTimes,
  FaBars,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBed,
  FaImage,
} from 'react-icons/fa'



// Define the structure of a Property
interface Property {
  id: number
  name: string
  imageUrl: string
  address: string
  roomsAvailable: number
}

const Dashboard: React.FC = () => {
  // State for active menu item
  const [activeMenu, setActiveMenu] = useState<number>(0)

  // State for search form visibility on small screens
  const [searchFormVisible, setSearchFormVisible] = useState(false)

  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false)

  // State for properties
  const [properties, setProperties] = useState<Property[]>([])

  // State for form inputs
  const [newProperty, setNewProperty] = useState<Omit<Property, 'id'>>({
    name: '',
    imageUrl: '',
    address: '',
    roomsAvailable: 1,
  })

  // State for user profile
  const [userName, setUserName] = useState<string>('John Doe')
  const [userEmail, setUserEmail] = useState<string>('johndoe@example.com')
  const [userImage, setUserImage] = useState<string>('/img/people.png')

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 576) {
        setSearchFormVisible(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load user image from localStorage on component mount
  useEffect(() => {
    const storedImage = localStorage.getItem('userImage')
    if (storedImage) {
      setUserImage(storedImage)
    }
  }, [])

  // Handle profile image change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setUserImage(base64String)
        localStorage.setItem('userImage', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProperty((prev) => ({
      ...prev,
      [name]: name === 'roomsAvailable' ? Number(value) : value,
    }))
  }

  // Handle form submission
  const handleAddProperty = (e: FormEvent) => {
    e.preventDefault()
    if (newProperty.name && newProperty.address && newProperty.imageUrl) {
      const newProp: Property = {
        id: properties.length + 1,
        ...newProperty,
      }
      setProperties([...properties, newProp])
      setNewProperty({
        name: '',
        imageUrl: '',
        address: '',
        roomsAvailable: 1,
      })
    }
  }


 

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

        {/* Overlay for mobile search form */}
        {searchFormVisible && (
          <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setSearchFormVisible(false)}></div>
        )}

        {/* Content */}
        <div className={`flex-1 transition-all duration-300`}>
          {/* Navbar */}
          <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
            <div className="flex items-center">
              {/* Back Arrow */}
              <Link href="/" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors duration-200">
                <FaArrowLeft className="text-2xl" />
                <span className="ml-2 text-lg font-semibold">Back</span>
              </Link>
            </div>
            <form
              className={`relative ${searchFormVisible ? 'block' : 'hidden'} md:block`}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex items-center">
                <input
                  type="search"
                  placeholder="Search..."
                  className="px-4 py-2 rounded-l-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-full focus:outline-none"
                  onClick={() => {
                    if (window.innerWidth < 576) {
                      setSearchFormVisible(!searchFormVisible)
                    }
                  }}
                >
                  {searchFormVisible ? <FaTimes /> : <FaSearch />}
                </button>
              </div>
            </form>
            <div className="flex items-center space-x-4">
              <label htmlFor="switch-mode" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="switch-mode"
                    className="hidden"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner transition-colors duration-300"></div>
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-blue-500 rounded-full transition-transform duration-300 ${
                      isDarkMode ? 'transform translate-x-6' : ''
                    }`}
                  ></div>
                </div>
              </label>
              <Link href="/notifications" className="relative text-gray-700 dark:text-gray-200">
                <FaBell className="text-2xl" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">8</span>
              </Link>
              <div className="relative">
                <button
                  onClick={() => document.getElementById('profileImageInput')?.click()}
                  className="focus:outline-none"
                >
                  <img src={userImage} alt="Profile" className="w-9 h-9 rounded-full" />
                </button>
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Head Title */}
            <div className="flex items-center justify-between flex-wrap mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-poppins font-semibold text-gray-800 dark:text-white">Dashboard</h1>
                <ul className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <li>
                    <Link href="/" className="text-lg hover:underline">Dashboard</Link>
                  </li>
                  <li>
                    <FaChevronRight />
                  </li>
                  <li>
                    <Link href="/" className="text-blue-500 text-lg hover:underline">Home</Link>
                  </li>
                </ul>
              </div>
              <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent text-2xl bg-clip-text">
                  Welcome back <span className='text-3xl font-extrabold'>Emmanuel</span>
               </h1>

             
            </div>

            {/* Box Info */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <li className="flex items-center p-6 bg-blue-100 text-blue-600 rounded-2xl">
                <FaCalendarCheck className="text-4xl" />
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold">1020</h3>
                  <p className="text-lg">New Orders</p>
                </div>
              </li>
              <li className="flex items-center p-6 bg-yellow-100 text-yellow-600 rounded-2xl">
                <FaUsers className="text-4xl" />
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold">2834</h3>
                  <p className="text-lg">Visitors</p>
                </div>
              </li>
              <li className="flex items-center p-6 bg-orange-100 text-orange-600 rounded-2xl">
                <FaDollarSign className="text-4xl" />
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold">$2543</h3>
                  <p className="text-lg">Total Sales</p>
                </div>
              </li>
            </ul>

            {/* Table Data */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Recent Orders */}
              <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Orders</h3>
                  <div className="flex space-x-2">
                    <FaSearch className="text-lg text-gray-600 dark:text-gray-300 cursor-pointer" />
                    <FaFilter className="text-lg text-gray-600 dark:text-gray-300 cursor-pointer" />
                  </div>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-300 dark:border-gray-700">
                      <th className="pb-2 text-lg">User</th>
                      <th className="pb-2 text-lg">Date Order</th>
                      <th className="pb-2 text-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { user: 'John Doe', date: '01-10-2021', status: 'Completed' },
                      { user: 'Jane Smith', date: '02-10-2021', status: 'Pending' },
                      { user: 'Bob Johnson', date: '03-10-2021', status: 'Processing' },
                      { user: 'Alice Brown', date: '04-10-2021', status: 'Pending' },
                      { user: 'Charlie Davis', date: '05-10-2021', status: 'Completed' },
                    ].map((order, index) => (
                      <tr key={index} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="py-4 flex items-center">
                          <img src="/img/people.png" alt="User" className="w-9 h-9 rounded-full mr-2" />
                          <span className="text-gray-800 dark:text-white">{order.user}</span>
                        </td>
                        <td className="py-4 text-gray-800 dark:text-white">{order.date}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Completed'
                                ? 'bg-green-200 text-green-800'
                                : order.status === 'Pending'
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-blue-200 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Properties */}
              <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Properties</h3>
                  <div className="flex space-x-2">
                    <FaPlus className="text-lg text-gray-600 dark:text-gray-300 cursor-pointer" onClick={() => { /* You can add additional functionality here */ }} />
                    <FaFilter className="text-lg text-gray-600 dark:text-gray-300 cursor-pointer" />
                  </div>
                </div>
                 <Card/>
                 <button 
                  onClick={handleAddProperty}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Add Property
              </button>
                <ul className="space-y-4">
                  {properties.map((property) => (
                    <li key={property.id} className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
                      <img src={property.imageUrl} alt={property.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{property.name}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{property.address}</p>
                        <p className="text-gray-600 dark:text-gray-300">Rooms Available: {property.roomsAvailable}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
