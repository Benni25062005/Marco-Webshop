export default function NotFound() {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <h1 className="text-7xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-2xl mb-6 text-gray-700">Oops! Diese Seite existiert nicht.</p>
        <a 
          href="/" 
          className="px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-300 ease-in-out"
        >
          Zurück zur Startseite
        </a>
      </div>
    );
  }
  