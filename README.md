# CrateOn

CrateOn is a full-stack web application designed by MERN stack for users to discover, track, and manage their video game collections. 
Built with a focus on high performance and a premium black-and-white aesthetic, it offers a seamless experience across desktop and mobile devices.

## Key Features

* **Advanced User Authentication:** Secure login and registration using JWT (JSON Web Tokens) and bcrypt password hashing.
* **Role-Based Access Control (RBAC):** Strict backend and frontend security separating standard `users` from system `admins`.
* **Secure Admin Command Center:** Dedicated dashboard for administrators to create/edit games and manage user permissions, completely locked down from unauthorized access.
* **Personalized Tracking:** Users can add games to their Wishlist or Library, tracking specific details like completion status, playtime, and ratings.
* **Blazing Fast Performance:** Implemented `React.lazy()` and `<Suspense>` for automatic code-splitting, ensuring near-instant initial load times.
* **Fully Responsive UI:** A custom, ultra-minimalist CSS architecture that perfectly adapts to mobile phones, tablets, and massive desktop monitors.

## Tech Stack

**Frontend:**
* React.js (Vite)
* React Router DOM (Protected & Lazy-loaded Routes)
* Lucide React (Icons)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (ODM)
* JSON Web Tokens (Auth)
* Multer (Image Upload Handling)

## Getting Started

Follow these instructions to get a local copy of the project up and running on your machine.

### Prerequisites
* Node.js installed on your machine.
* A MongoDB database (local or MongoDB Atlas).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/CrateOn.git
   cd CrateOn
2. **Setup the Backend**
   ```bash
   cd server
   npm install
  * Create a .env file in the server directory and add your environment variables:
    ```bash
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
3. **Start the backend server:**
   ```bash
    npm run dev
    npm start run:dev [if nodemon installed]
4. **Setup the Frontend**

  * Open a new terminal window and navigate to the client folder:
    ```bash
    cd client
    npm install
  * Start the Vite development server:
    ```bash
    npm run dev
5. **Open http://localhost:5173 in your browser to view the app!**

---


<div align="center">

**Made with ❤️ and If you enjoy CrateOn, drop a ⭐**

</div>
