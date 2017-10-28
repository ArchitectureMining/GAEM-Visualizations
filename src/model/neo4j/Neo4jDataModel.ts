import { v1 as neo4j } from "neo4j-driver";
import { ColumnData } from "./../ColumnData";
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

	// type: class
	// fullname: 881da68edbd3f822efff5430318b9c2fff63eeaa31eaa80d9852fd39e08e9803
	// function: 881da68edbd3f822efff5430318b9c2fff63eeaa31eaa80d9852fd39e08e9803
	// 				.8b6eb0296e57e2c6ffd3efdcf7c48d7dabce0790070c6b26ef1d9b34fe4deb76
	// run: 6677a9cb023d94a6cd88baf2c6dd4395e3e28b7bc090dd5256ae2e4b995f205c

	// fullname: 0efcb4350213d59eb69ecf7d2e158d296940ef4167859ba3a10e5035e0d2addc
	// 				.d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90b4
	// 				.08f5d7eb4ef850ee88134e962814119166896e5f7c13852e51b67661b50933ca
	// 				.dfe1d833fd784cae1a235143479a591c9f1b49eaf79e9b1b562ec1c61964e655
	// 				.f6857ee688ae5064ea78bb2714492b44fbba8ccdc3993322bcee35d32e9efd3d
	// run: 053aad69a52634f446aa0a2fe92c8a3743716bdef437005f7f6ae7097a3c83af

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

				columnData = {
					fullname: focus[0].get("n").properties["fullname"],
					totalCallsToThis: 0,
					totalCallsFromThis: 0,
					totalCalls: 0,
					subElements: []
				};

				subElements.map((value, index) => {
					columnData.subElements.push({
						name: value.get("m").properties["name"],
						fullname: value.get("m").properties["fullname"],
						calls: {
							to: [],
							from: []
						},
						totalCallsToThis: 0,
						totalCallsFromThis: 0,
						totalCalls: 0,
					});
				});

				// from some other to focus
				callsToThis.map((val) => {
					let subElement = columnData.subElements.find(
						(element) => {
							return element.fullname === val.get("to");
						});
					subElement.totalCallsToThis += val.get("numberOfCalls").toNumber();
					subElement.calls.to.push({
						from: val.get("from"),
						to: val.get("to"),
						numberOfCalls: val.get("numberOfCalls").toNumber()
					});
				});

				// from focus to some other
				callsFromThis.map((val) => {
					let subElement = columnData.subElements.find(
						(element) => {
							return element.fullname === val.get("from");
						});
					subElement.totalCallsFromThis += val.get("numberOfCalls").toNumber();
					subElement.calls.from.push({
						from: val.get("from"),
						to: val.get("to"),
						numberOfCalls: val.get("numberOfCalls").toNumber()
					});
				});

				columnData.subElements.map((val) => {
					val.totalCalls = val.totalCallsFromThis + val.totalCallsToThis;
				});

				columnData.totalCallsToThis = columnData.subElements.reduce((total, current) => {
					return total + current.totalCallsToThis;
				}, 0);

				columnData.totalCallsFromThis = columnData.subElements.reduce((total, current) => {
					return total + current.totalCallsFromThis;
				}, 0);

				columnData.totalCalls = columnData.subElements.reduce((total, current) => {
					return total + current.totalCalls;
				}, 0);

			}).then(() => {
				resolve(columnData);
			}).catch((reason) => {
				console.log(reason);
				reject(reason);
			});
		});
	}
}
