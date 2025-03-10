import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from "./pages/ErrorPage.jsx";
import Home from "./pages/Home.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import UserProfile from "./pages/UserProfile.jsx";
import Authors from "./pages/Authors.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import CategoryPosts from "./pages/CategoryPosts.jsx";
import AuthorPosts from "./pages/AuthorPosts.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditPost from "./pages/EditPost.jsx";
import Logout from "./pages/Logout.jsx";
import DeletePost from "./pages/DeletePost.jsx"
import { Provider } from 'react-redux';
import store from './store/store.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "authors", element: <Authors /> },
      { path: "posts/create", element: <CreatePost /> },
      { path: "posts/categories/:category", element: <CategoryPosts /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <Dashboard /> },//======> TO HANDLE
      { path: "posts/edit/:id", element: <EditPost /> },
      { path: "posts/:id/delete", element: <DeletePost /> },
      { path: "logout", element: <Logout /> },

    ]
  }
])
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
