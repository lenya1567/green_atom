import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { cutArrayBy } from './AlbumsPage';

import backImageURL from "../assets/back.svg";
import loupeImageURL from "../assets/loupe.svg";
import crossImageURL from "../assets/cross.svg";
import arrowLeftImageURL from "../assets/arrow_left.svg";
import arrowRightImageURL from "../assets/arrow_right.svg";

import '../index.scss';

export default observer((props) => {

    const imageView = useRef();
    const params = useParams();
    const changeLocation = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (parseInt(params.albumIndex) != NaN) {
            props.state.fetchAlbum(
                parseInt(params.albumIndex),
                params.pageIndex ? parseInt(params.pageIndex) : -1,
                params.photoIndex ? parseInt(params.photoIndex) : -1,
            );
        } else {
            changeLocation("/");
        }

        window.onpopstate = () => {
            let ref = window.location.pathname.split("/");
            let albumIndex = ref[2];
            let pageIndex = ref[3];
            let photoIndex = ref[5];
            console.log(ref, albumIndex, pageIndex, photoIndex);
            if (parseInt(albumIndex) != NaN) {
                props.state.setLocation(
                    parseInt(albumIndex),
                    parseInt(pageIndex),
                    photoIndex ? parseInt(photoIndex) : -1
                );
            } else {
                changeLocation("/");
            }
        };

    }, []);

    return (
        <div className="photos">
            <div className="pagination">
                <span className="album-name">
                    <img width="35px" src={backImageURL} onClick={() => changeLocation("/")} style={{ cursor: "pointer" }} />
                    <h1>
                        Альбом "{props.state.albumName}"
                    </h1>
                </span>

                <span className='pages'>
                    Cтраницы:
                    {
                        Array(props.state.pageCount).fill(0).map((_, page) =>
                            <button
                                key={`page_${page}`}
                                className={page == props.state.pageIndex ? "page-button page-button-selected" : "page-button"}
                                onClick={async () => changeLocation(await props.state.selectPage(page))}
                            >
                                {page + 1}
                            </button>
                        )
                    }
                </span>
            </div>
            <div className='photos-list'>
                {props.state.photos.map((photo, index) =>
                    <div
                        key={`album-${index}`}
                        className='photo'
                        onClick={() => { if (photo != null) changeLocation(props.state.selectPhoto(index)) }}
                        style={photo == null ? { opacity: 0, cursor: "default" } : {}}
                    >
                        <div className='image'>
                            <div className='loupe'>
                                <img src={loupeImageURL} />
                            </div>
                            <img width="100%" src={
                                photo != null
                                    ? `http://localhost:8055/assets/${photo.directus_files_id}?quality=25`
                                    : ""
                            } />
                        </div>
                    </div>
                )
                }


            </div>
            <div className={props.state.photoIndex != -1 ? 'image-view image-view-opened' : 'image-view'} onClick={(e) => {
                if (!imageView.current.contains(e.target)) {
                    changeLocation(props.state.selectPhoto(-1));
                }
            }}>
                <div ref={imageView} className='image-view-content'>
                    {props.state.photoIndex != -1 && <img width="100%" src={props.state.activePhotoLink} />}
                    {props.state.photoIndex != -1 && <div className="actions">
                        <span>{props.state.photoIndex + 1} / {props.state.photosCount}</span>
                        <img src={crossImageURL} onClick={() => changeLocation(props.state.selectPhoto(-1))} />
                        <img src={arrowLeftImageURL} onClick={() => changeLocation(props.state.previousPhoto())} />
                        <img src={arrowRightImageURL} onClick={() => changeLocation(props.state.nextPhoto())} />
                    </div>}
                </div>
            </div>
        </div>
    );
});