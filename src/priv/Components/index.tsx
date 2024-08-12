import { ADIOS } from "adios/Loader"
import { dictionarySk } from "adios/Dictionary/Sk";

// ADIOS
import Table from "adios/Table";
import Modal from "adios/ModalSimple";

import InputVarchar from "adios/Inputs/Varchar";
import InputInt from "adios/Inputs/Int";
import InputLookup from "adios/Inputs/Lookup";
import InputImage from "adios/Inputs/Image";
import InputBoolean from "adios/Inputs/Boolean";
import InputColor from "adios/Inputs/Color";
//import InputMapPoint from "adios/Inputs/MapPoint";

// Primereact
import { Tooltip } from "primereact/tooltip"

// Modules
import FormUser from "./Modules/Core/Settings/FormUser"
import TablePerson from "./Modules/Core/Customers/TablePerson"
import FormPerson from "./Modules/Core/Customers/FormPerson"


//@ts-ignore
const app: ADIOS = new ADIOS(window.ConfigEnv);

app.dictionary.sk = dictionarySk;

// ADIOS components
app.registerReactComponent('Table', Table);
app.registerReactComponent('Modal', Modal);

app.registerReactComponent('InputVarchar', InputVarchar);
app.registerReactComponent('InputInt', InputInt);
app.registerReactComponent('InputLookup', InputLookup);
app.registerReactComponent('InputBoolean', InputBoolean);
app.registerReactComponent('InputImage', InputImage);
app.registerReactComponent('InputColor', InputColor);
//app.registerReactComponent('InputMapPoint', InputMapPoint);

// Primereact
app.registerReactComponent('Tooltip', Tooltip);

// Modules
app.registerReactComponent('FormUser', FormUser);
app.registerReactComponent('TablePerson', TablePerson);
app.registerReactComponent('FormPerson', FormPerson);

// Render react elements into body
app.renderReactElements();

globalThis.app = app;
