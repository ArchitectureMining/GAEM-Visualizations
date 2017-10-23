import {v1 as neo4j} from "neo4j-driver";
import {Result} from "neo4j-driver/types/v1";

export type Neo4jProtocol = "bolt" | "bolt+routing";

export class Neo4jConnector {
	private driver: neo4j.Driver;
	private session: neo4j.Session;

	public connect(
		protocol: Neo4jProtocol,
		address: string,
		port: number,
		username?: string,
		password?: string) {
			const server = protocol + "://" + address;
			if (username != null && password != null ) {
				this.driver = neo4j.driver(server, neo4j.auth.basic(username, password));
			} else {
				this.driver = neo4j.driver(server);
			}

			this.driver.onCompleted = () => {
				console.log("INFO : Neo4j driver instantiated succesfully.");
			};

			this.driver.onError = () => {
				console.log("ERROR: Neo4j driver could not be instantiated.");
			};

			this.session = this.driver.session();
	}

	public disconnect() {
		this.session.close();
		this.driver.close();

		console.log("INFO : Neo4j server disconnected.");
	}

	public runQuery(query: string, parameters: object = { }) {
		return this.session.run(
			query,
			parameters
		);
	}
}
