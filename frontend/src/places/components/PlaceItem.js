import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Map from "../../shared/components/UIElements/Map";
import { ProgressSpinner } from 'primereact/progressspinner';
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => setShowMap(true);


  const showDeleteWarningHandler = () => {
    confirmDialog({
      message:
        "Do you want to proceed and delete this place? Please note that it can't be undone thereafter.",
      header: "Are you sure?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: confirmDeleteHandler,
      acceptLabel: "DELETE",
      rejectLabel: "CANCEL",
    });
  };

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };
  const handleEditClick = () => {
    // 使用 history.push 导航到指定路径
    history.push(`/places/${props.id}`);
  };
  const footerContent = (
    <div>
      <Button
        onClick={() => setShowMap(false)}
        autoFocus
      >
        CLOSE
      </Button>
    </div>
  );

  return (
    <React.Fragment>
      <Dialog
        header={props.address}
        visible={showMap}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!showMap) return;
          setShowMap(false);
        }}
        footer={footerContent}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Dialog>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <ProgressSpinner />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button onClick={handleEditClick} severity="danger">
                EDIT
              </Button>
            )}

            {auth.userId === props.creatorId && (
              <Button severity="help" onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
