import React from "react";
import "./UserItem.css";
import {Link} from 'react-router-dom';
import Card from "../../shared/components/UIElements/Card";
import { Avatar } from 'primereact/avatar';


const UserItem = (props) => {
  return (
    <li className="user-item">
      <div>
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            {/* <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} /> */}
            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} imageAlt={props.name} size="xlarge" shape="circle" />

          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}{" "}
            </h3>
          </div>
        </Link>
      </Card>
      </div>
    </li>
  );
};

export default UserItem;
