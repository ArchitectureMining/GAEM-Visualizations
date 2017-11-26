import { v1 as neo4j } from "neo4j-driver";
import { AggregateCall, ColumnData, SubElement } from "./../ColumnData";
import { DataModel } from "./../DataModel";
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

	// TODO
	// to enable having a namespace or such as focus
	// use startnode
	// 	follow 0..n [:IN] relations
	// 	then follow [:INSTANCEOF] relation to get calls
	// 	aggregate data
	public getColumnData(elementType: string, fullname: string, runs: string[]): Promise<ColumnData> {
		return new Promise<ColumnData>((resolve, reject) => {

			let promises: neo4j.Result[] = [];

			// get focus
			promises.push(this.neo4jConnector.runQuery(
				"MATCH (n:" + elementType + ")" +
				"WHERE n.fullname = {param_fullname}" +
				"RETURN n",
				{
					param_fullname: fullname
				}
			));

			// get subElements
			promises.push(this.neo4jConnector.runQuery(
				"MATCH (n:" + elementType + ")<-[:IN]-(m) " +
				"WHERE n.fullname = {param_fullname} " +
				"RETURN DISTINCT m ",
				{
					param_fullname: fullname
				}
			));

			// get calls to this
			promises.push(this.neo4jConnector.runQuery(
				"MATCH (n:" + elementType + ")<-[:IN]-(m) " +
				"WHERE n.fullname = {param_fullname} " +
				"WITH collect(DISTINCT m.fullname) as subElements " +
				"MATCH (x:call)-[calls:INVOKES]->(y:call) " +
				"WHERE y.fullname IN subElements " +
				"AND y.run IN {param_runs} " +
				"RETURN x.fullname as from, count(calls) as numberOfCalls, y.fullname as to ",
				{
					param_fullname: fullname,
					param_runs: runs
				}
			));

			// get calls from this
			promises.push(this.neo4jConnector.runQuery(
				"MATCH (n:" + elementType + ")<-[:IN]-(m) " +
				"WHERE n.fullname = {param_fullname} " +
				"WITH collect(DISTINCT m.fullname) as subElements " +
				"MATCH (x:call)-[calls:INVOKES]->(y:call) " +
				"WHERE x.fullname IN subElements " +
				"AND x.run IN {param_runs} " +
				"RETURN x.fullname as from, count(calls) as numberOfCalls, y.fullname as to ",
				{
					param_fullname: fullname,
					param_runs: runs
				}
			));

			let columnData: ColumnData;

			Promise.all(promises).then((values) => {

				let focus = values[0].records;
				let subElements = values[1].records;
				let callsToThis = values[2].records;
				let callsFromThis = values[3].records;

				columnData = new ColumnData();

				for (let subElementRecord of subElements) {
					columnData.subElements.push(new SubElement(columnData, subElementRecord.get("m").properties["fullname"]));
				}

				for (let callToThisRecord of callsToThis) {
					columnData.calls.push(new AggregateCall(
						callToThisRecord.get("from"),
						callToThisRecord.get("to"),
						callToThisRecord.get("numberOfCalls").toNumber()
					));
				}

				for (let callFromThisRecord of callsFromThis) {
					columnData.calls.push(new AggregateCall(
						callFromThisRecord.get("from"),
						callFromThisRecord.get("to"),
						callFromThisRecord.get("numberOfCalls").toNumber()
					));
				}
			}).then(() => {
				resolve(columnData);
			}).catch((reason) => {
				console.log(reason);
				reject(reason);
			});
		});
	}

	public getRuns(): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			this.neo4jConnector.runQuery(
				"MATCH (n:run)" +
				"RETURN n.name"
			).then((value) => {
				resolve(value.records.map((record, index) => {
					return record.get("n.name");
				}));
			})
			.catch((reason) => {
				console.log(reason);
				reject(reason);
			});
		});
	}

	public getFocusFullnames(type: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			this.neo4jConnector.runQuery(
				"MATCH (n:" + type + ")" +
				"RETURN n.fullname"
			).then((value) => {
				resolve(value.records.map((record, index) => {
					return record.get("n.fullname");
				}));
			})
			.catch((reason) => {
				console.log(reason);
				reject(reason);
			});
		});
	}
}
