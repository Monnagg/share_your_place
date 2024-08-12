import React ,{useContext}from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHistory } from 'react-router-dom';
import { Button } from "primereact/button";


export default function NavigationBar() {
    const auth = useContext(AuthContext);
    console.log("is logging")
    console.log(auth.isLoggedIn)
    // const router = useRouter();
    const history = useHistory();



  const items = [
    {
      label: "All Users",
      icon: "pi pi-home",
      command: () => {
        history.push('/');
    }
    },
    {
      label: "My Places",
      icon: "pi pi-bell",
      command: () => {
        history.push(`/${auth.userId}/places`);
    }
    },
    {
      label: "Add Place",
      icon: "pi pi-search",
    },
  ];

  //  const start = ;
  const start = (
    <h3>
      SharePlaces
    </h3>
  
  );
  const end = (
    
    <div className="flex align-items-center gap-2">
      {auth.isLoggedIn && <Button label="LOGOUT" severity="info" />}
      {!auth.isLoggedIn && <Button label="AUTHENTICATE" severity="info" />}
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
