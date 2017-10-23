import { v1 as neo4j } from "neo4j-driver";
import { CallData, ComponentData, DataModel } from "./../DataModel";
import { Neo4jConnector } from "./Neo4jConnector";

export type Neo4jProtocol = "bolt" | "bolt+routing";

export class Neo4jDataModel implements DataModel {
	private neo4jConnector: Neo4jConnector = new Neo4jConnector();

	// TODO
	// read from settings file or webform (that saves into a file)
	public connect() {
		this.neo4jConnector.connect(
			"bolt",
			"thomas-pc",
			7686,
			"neo4j",
			"password"
		);
	}

	public disconnect() {
		this.neo4jConnector.disconnect();
	}

	// type: class
	// fullname: 881da68edbd3f822efff5430318b9c2fff63eeaa31eaa80d9852fd39e08e9803

	public getColumnData(elementType: string, fullname: string): ComponentData[] {
		this.neo4jConnector.runQuery(
			""
		).then((result) => {
			// transform and return promise of componentdata[]
		});
		throw Error();
	}
}
