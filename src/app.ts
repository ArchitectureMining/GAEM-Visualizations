import * as d3 from "d3";
import { Neo4jDataModel } from "./model/neo4j/Neo4jDataModel";
import { FocusTestView } from "./views/FocusTestView";
import { FocusView } from "./views/FocusView";

let dataModel = new Neo4jDataModel();

/*dataModel.connect();
dataModel.getColumnData(
	"class",
	"0efcb4350213d59eb69ecf7d2e158d296940ef4167859ba3a10e5035e0d2addc.d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90b4.08f5d7eb4ef850ee88134e962814119166896e5f7c13852e51b67661b50933ca.dfe1d833fd784cae1a235143479a591c9f1b49eaf79e9b1b562ec1c61964e655.f6857ee688ae5064ea78bb2714492b44fbba8ccdc3993322bcee35d32e9efd3d",
	["053aad69a52634f446aa0a2fe92c8a3743716bdef437005f7f6ae7097a3c83af"]
);*/

let view = new FocusTestView();
//let view = new FocusView();

view.render();
