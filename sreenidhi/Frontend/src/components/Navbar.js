import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Home', href: '/home', current: true },
  { name: 'AboutUs', href: '/aboutUs', current: true },
  // The "Product Link" option should be shown only when logged in
  { name: 'Product Link', href: '/link', current: true, requiresLogin: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile'); 
  };

  const handleSignOut = () => {
    // Remove user info from localStorage
    sessionStorage.removeItem('username'); // Or any other user token/authentication method you're using
    navigate('/login'); // Redirect to login page after sign out
  };

  // Check if the user is logged in by verifying if 'username' exists in localStorage
  const isLoggedIn = sessionStorage.getItem('username') !== null;

  // Fetch the username from localStorage
  const username = isLoggedIn ? sessionStorage.getItem('username') : null;

  return (
    <Disclosure as="nav" className="bg-[#bcd4d3] fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                alt="Your Company"
                src="/main_logo.png" // Correct path
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  // Only show "Product Link" button if user is logged in
                  (!item.requiresLogin || isLoggedIn) && (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown, show only if logged in */}
            {isLoggedIn && (
              <Menu as="div" className="relative ml-3 flex items-center space-x-2">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-black-500 flex items-center justify-center">
                      <CgProfile className="text-white h-6 w-6" />
                    </div>
                  </MenuButton>
                </div>
                {/* Display username beside the profile icon */}
                {username && <span className="text-gray-800 font-medium">{username}</span>}
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-12 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="#" onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            // Only show "Product Link" button if user is logged in
            (!item.requiresLogin || isLoggedIn) && (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            )
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}















// import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
// import { CgProfile } from "react-icons/cg";
// import { Link, useNavigate } from 'react-router-dom'; 

// const navigation = [
//   { name: 'Home', href: '/home', current: true },
//   { name: 'Login', href: '/login', current: true },
//   { name: 'AboutUs', href: '/aboutUs', current: true },
//   // The "Product Link" option should be shown only when logged in
//   { name: 'Product Link', href: '/link', current: true, requiresLogin: true },
// ]

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

// export default function Navbar() {
//   const navigate = useNavigate();

//   const handleProfileClick = () => {
//     navigate('/profile'); 
//   };

//   const handleSignOut = () => {
//     // Remove user info from localStorage
//     localStorage.removeItem('username'); // Or any other user token/authentication method you're using
//     navigate('/login'); // Redirect to login page after sign out
//   };

//   // Check if the user is logged in by verifying if 'username' exists in localStorage
//   const isLoggedIn = localStorage.getItem('username') !== null;

//   return (
//     <Disclosure as="nav" className="bg-[#bcd4d3]">
//       <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
//         <div className="relative flex h-16 items-center justify-between">
//           <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
//             {/* Mobile menu button */}
//             <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
//               <span className="absolute -inset-0.5" />
//               <span className="sr-only">Open main menu</span>
//               <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
//               <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
//             </DisclosureButton>
//           </div>
//           <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
//             <div className="flex flex-shrink-0 items-center">
//               <img
//                 alt="Your Company"
//                 src="/main_logo.png" // Correct path
//                 className="h-10 w-auto"
//               />
//             </div>
//             <div className="hidden sm:ml-6 sm:block">
//               <div className="flex space-x-4">
//                 {navigation.map((item) => (
//                   // Only show "Product Link" button if user is logged in
//                   (!item.requiresLogin || isLoggedIn) && (
//                     <a
//                       key={item.name}
//                       href={item.href}
//                       aria-current={item.current ? 'page' : undefined}
//                       className={classNames(
//                         item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
//                         'rounded-md px-3 py-2 text-sm font-medium',
//                       )}
//                     >
//                       {item.name}
//                     </a>
//                   )
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
//             {/* Profile dropdown */}
//             {isLoggedIn ? (
//               <Menu as="div" className="relative ml-3">
//                 <div>
//                   <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
//                     <span className="absolute -inset-1.5" />
//                     <span className="sr-only">Open user menu</span>
//                     <div className="h-8 w-8 rounded-full bg-black-500 flex items-center justify-center">
//                         <CgProfile className="text-white h-6 w-6" />
//                     </div>
//                   </MenuButton>
//                 </div>
//                 <MenuItems
//                   transition
//                   className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
//                 >
//                   <MenuItem>
//                     <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
//                       Your Profile
//                     </a>
//                   </MenuItem>
//                   <MenuItem>
//                     <a href="#" onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
//                       Sign out
//                     </a>
//                   </MenuItem>
//                 </MenuItems>
//               </Menu>
//             ) : (
//               <Link
//                 to="/login"
//                 className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//       <DisclosurePanel className="sm:hidden">
//         <div className="space-y-1 px-2 pb-3 pt-2">
//           {navigation.map((item) => (
//             // Only show "Product Link" button if user is logged in
//             (!item.requiresLogin || isLoggedIn) && (
//               <DisclosureButton
//                 key={item.name}
//                 as="a"
//                 href={item.href}
//                 aria-current={item.current ? 'page' : undefined}
//                 className={classNames(
//                   item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
//                   'block rounded-md px-3 py-2 text-base font-medium',
//                 )}
//               >
//                 {item.name}
//               </DisclosureButton>
//             )
//           ))}
//         </div>
//       </DisclosurePanel>
//     </Disclosure>
//   )
// }












