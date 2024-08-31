import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AlbumsPage from "./pages/AlbumsPage";
import AlbumsState from "./states/AlbumsState";
import PhotosState from "./states/PhotosState";
import PhotosPage from "./pages/PhotosPage";

const albumsState = new AlbumsState();
const albumsPage = <AlbumsPage state={albumsState} />;

const photosState = new PhotosState();
const photosPage = <PhotosPage state={photosState} />;

const router = createBrowserRouter([
    {
        path: "/",
        element: albumsPage
    },
    {
        path: "/album/:albumIndex",
        element: photosPage
    },
    {
        path: "/album/:albumIndex/:pageIndex",
        element: photosPage
    },
    {
        path: "/album/:albumIndex/:pageIndex/photo/:photoIndex",
        element: photosPage
    },
]);

export default <RouterProvider router={router} />