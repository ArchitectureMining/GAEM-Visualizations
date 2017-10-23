import * as d3 from "d3";

let settings = {
	svgheight: 1000,
	svgwidth: 1200 // 1900 for line?
};

let data1 = [
	{
		fullname: "functionA",
		incoming: 30,
		outgoing: 10,
		calls: [
			{
				fullname: "functionD",
				from: 25,
				to: 10
			},
			{
				fullname: "functionE",
				from: 5,
				to: 0
			}
		]
	},
	{
		fullname: "functionB",
		incoming: 20,
		outgoing: 30,
		calls: [
			{
				fullname: "functionE",
				from: 20,
				to: 0
			},
			{
				fullname: "functionF",
				from: 0,
				to: 30
			}
		]
	},
	{
		fullname: "functionC",
		incoming: 10,
		outgoing: 10,
		calls: [
			{
				fullname: "functionD",
				from: 5,
				to: 3
			},
			{
				fullname: "functionF",
				from: 5,
				to: 7
			}
		]
	},
];

let data2 = [
	{
		fullname: "functionD",
		incoming: 13,
		outgoing: 30,
		calls: [
			{
				fullname: "functionA",
				from: 10,
				to: 25
			},
			{
				fullname: "functionC",
				from: 3,
				to: 5
			}
		]
	},
	{
		fullname: "functionE",
		incoming: 0,
		outgoing: 25,
		calls: [
			{
				fullname: "functionA",
				from: 0,
				to: 5
			},
			{
				fullname: "functionB",
				from: 0,
				to: 20
			}
		]
	},
	{
		fullname: "functionF",
		incoming: 37,
		outgoing: 5,
		calls: [
			{
				fullname: "functionB",
				from: 30,
				to: 0
			},
			{
				fullname: "functionC",
				from: 7,
				to: 5
			}
		]
	}
];

let sumTotalCalls = (objArray: object[]) => {
	let total = 0;
	for (let obj of objArray) {
		total += obj["incoming"];
		total += obj["outgoing"];
	}
	return total;
};

let sumPreviousCalls = (objArray: object[], index: number) => {
	let total = 0;
	let i: number;
	for (i = 0; i < index; i++) {
		total += objArray[i]["incoming"];
		total += objArray[i]["outgoing"];
	}
	return total;
};

// create svg container
let svgContainer = d3
	.select("body")
	.append("svg")
	.attr("width", settings.svgwidth)
	.attr("height", settings.svgheight);

// create focus group left
let rectangleGroupLeft = svgContainer
	.selectAll("g.left")
	.data(data1)
	.enter()
	.append("g")
	.attr("class", "left")
	.attr("id", (d, i) => {
		return d.fullname + "-group";
	});

// left group main rectangle
rectangleGroupLeft
	.append("rect")
	.attr("width", 300)
	.attr("height", (d, i) => {
		let total = sumTotalCalls(data1);
		let localTotal = d.incoming + d.outgoing;
		return (localTotal / total) * settings.svgheight;
	})
	.attr("x", "0%")
	.attr("y", (d, i) => {
		let total = sumTotalCalls(data1);
		let previousTotal = sumPreviousCalls(data1, i);
		return (previousTotal / total) * settings.svgheight;
	})
	.attr("id", (d, i) => {
		return d.fullname;
	})
	.attr("fill", () => {
		return d3.interpolateCool(Math.random() * 0.5 + 0.5);
	})
	.attr("stroke", "black");

// left group text
rectangleGroupLeft
	.append("text")
	.attr("x", 10)
	.attr("y", (d, i) => {
		let total = sumTotalCalls(data1);
		let previousTotal = sumPreviousCalls(data1, i);
		return (previousTotal / total) * settings.svgheight + 20; // maybe add text.bbox.y + 10?
	})
	.text((d) => {
		return d.fullname;
	});

// create call targets right
let rectangleGroupRight = svgContainer
	.selectAll("g.right")
	.data(data2)
	.enter()
	.append("g")
	.attr("class", "right")
	.attr("id", (d, i) => {
		return d.fullname + "-group";
	});

// right group main rectangle
rectangleGroupRight
	.append("rect")
	.attr("width", 300)
	.attr("height", (d, i) => {
		let total = sumTotalCalls(data2);
		let localTotal = d.incoming + d.outgoing;
		return (localTotal / total) * settings.svgheight;
	})
	.attr("x", settings.svgwidth - 300)
	.attr("y", (d, i) => {
		let total = sumTotalCalls(data2);
		let previousTotal = sumPreviousCalls(data2, i);
		return (previousTotal / total) * settings.svgheight;
	})
	.attr("id", (d, i) => {
		return d.fullname;
	})
	.attr("fill", () => {
		return d3.interpolateCool(Math.random() * 0.5);
	})
	.attr("stroke", "black");

// right group text
rectangleGroupRight
	.append("text")
	.attr("x", settings.svgwidth - 100)
	.attr("y", (d, i) => {
		let total = sumTotalCalls(data1);
		let previousTotal = sumPreviousCalls(data2, i);
		return (previousTotal / total) * settings.svgheight + 20; // maybe add text.bbox.y + 10?
	})
	.text((d) => {
		return d.fullname;
	});

// create smaller connectors (left)
data1.forEach((dataElement, i) => {
	let connectorGroup = svgContainer
		.select("#" + dataElement.fullname + "-group")
		.append("g")
		.attr("id", dataElement.fullname + "-connectors");
	dataElement.calls.forEach((call, j) => {
		connectorGroup
			.append("rect")
			.attr("width", 50)
			.attr("height", () => {
				let total = sumTotalCalls(data1);
				let localTotal = dataElement.incoming + dataElement.outgoing;
				let mainRectHeight = (localTotal / total) * settings.svgheight;

				let elementTotal = dataElement.incoming + dataElement.outgoing;
				let callTotal = call.from + call.to;
				return (callTotal / elementTotal * mainRectHeight);
			})
			.attr("x", 250)
			.attr("y", () => {
				let elementTotal = dataElement.incoming + dataElement.outgoing;

				let previousCallTotal = 0;
				let k: number;
				for (k = 0; k < j; k++) {
					previousCallTotal += dataElement.calls[k].from;
					previousCallTotal += dataElement.calls[k].to;
				}

				let total = sumTotalCalls(data1);
				let previousTotal = sumPreviousCalls(data1, i);
				let localTotal = dataElement.incoming + dataElement.outgoing;
				let mainRectHeight = (localTotal / total) * settings.svgheight;
				let mainRectY = (previousTotal / total) * settings.svgheight;

				return mainRectY + (previousCallTotal / elementTotal * mainRectHeight) ;
			})
			.attr("fill", () => {
				return d3.select("#" + call.fullname).attr("fill");
			})
			.attr("stroke", "black")
			.attr("id", dataElement.fullname + "-" + call.fullname);
		/*connectorGroup
			.append("text")
			.attr("x", 210)
			.attr("y", () => {
				let elementTotal = dataElement.incoming + dataElement.outgoing;

				let previousCallTotal = 0;
				let k: number;
				for (k = 0; k < j; k++) {
					previousCallTotal += dataElement.calls[k].from;
					previousCallTotal += dataElement.calls[k].to;
				}

				let total = sumTotalCalls(data1);
				let previousTotal = sumPreviousCalls(data1, i);
				let localTotal = dataElement.incoming + dataElement.outgoing;
				let mainRectHeight = (localTotal / total) * settings.svgheight;
				let mainRectY = (previousTotal / total) * settings.svgheight;

				return mainRectY + (previousCallTotal / elementTotal * mainRectHeight) + 15 ;
			})
			.text(call.fullname);*/
	});
});

// create smaller connectors (right)
data2.forEach((dataElement, i) => {
	let connectorGroup = svgContainer
		.select("#" + dataElement.fullname + "-group")
		.append("g")
		.attr("id", dataElement.fullname + "-connectors");
	dataElement.calls.forEach((call, j) => {
		connectorGroup
			.append("rect")
			.attr("width", 50)
			.attr("height", () => {
				let total = sumTotalCalls(data2);
				let localTotal = dataElement.incoming + dataElement.outgoing;
				let mainRectHeight = (localTotal / total) * settings.svgheight;

				let elementTotal = dataElement.incoming + dataElement.outgoing;
				let callTotal = call.from + call.to;
				return (callTotal / elementTotal * mainRectHeight);
			})
			.attr("x", settings.svgwidth - 300)
			.attr("y", () => {
				let elementTotal = dataElement.incoming + dataElement.outgoing;

				let previousCallTotal = 0;
				let k: number;
				for (k = 0; k < j; k++) {
					previousCallTotal += dataElement.calls[k].from;
					previousCallTotal += dataElement.calls[k].to;
				}

				let total = sumTotalCalls(data2);
				let previousTotal = sumPreviousCalls(data2, i);
				let localTotal = dataElement.incoming + dataElement.outgoing;
				let mainRectHeight = (localTotal / total) * settings.svgheight;
				let mainRectY = (previousTotal / total) * settings.svgheight;

				return mainRectY + (previousCallTotal / elementTotal * mainRectHeight) ;
			})
			.attr("fill", () => {
				return d3.select("#" + call.fullname).attr("fill");
			})
			.attr("stroke", "black")
			.attr("id", dataElement.fullname + "-" + call.fullname);
		/*connectorGroup
			.append("text")
			.attr("x", settings.svgwidth - 290)
			.attr("y", () => {
				let elementTotal = dataElement.incoming + dataElement.outgoing;

				let previousCallTotal = 0;
				let k: number;
				for (k = 0; k < j; k++) {
					previousCallTotal += dataElement.calls[k].from;
					previousCallTotal += dataElement.calls[k].to;
				}

				let total = sumTotalCalls(data2);
				let previousTotal = sumPreviousCalls(data2, i);
				let localTotal = dataElement.incoming + dataElement.outgoing;
				let mainRectHeight = (localTotal / total) * settings.svgheight;
				let mainRectY = (previousTotal / total) * settings.svgheight;

				return mainRectY + (previousCallTotal / elementTotal * mainRectHeight) + 15 ;
			})
			.text(call.fullname);*/
	});
});

svgContainer
	.append("g")
	.attr("id", "roads");

// create from left to right
data1.forEach((dataElement, i) => {
	let roads = d3.select("#roads");
	dataElement.calls.forEach((call, j) => {
		roads
			.append("polygon")
			.attr("points", () => {
				let points: string[] = [];
				let connectorFrom = svgContainer
					.select("#" + dataElement.fullname + "-" + call.fullname);
				let connectorTo = svgContainer
					.select("#" + call.fullname + "-" + dataElement.fullname);
				let ratio: number = call.to / (call.from + call.to);

				points.push( // top left
					(parseInt(connectorFrom.attr("x"))
						+ parseInt(connectorFrom.attr("width")))
					+ ","
					+ connectorFrom.attr("y"));
				points.push( // top right
					connectorTo.attr("x")
					+ ","
					+ connectorTo.attr("y"));
				points.push( // bottom right
					connectorTo.attr("x")
					+ ","
					+ (parseInt(connectorTo.attr("y"))
						+ parseInt(connectorTo.attr("height")) * ratio));
				points.push( // bottom left
					parseInt(connectorFrom.attr("x"))
						+ parseInt(connectorFrom.attr("width"))
					+ ","
					+ (parseInt(connectorFrom.attr("y"))
						+ parseInt(connectorFrom.attr("height")) * ratio));
				return points.join(" ");
			})
			.attr("id", () => {
				return "#" + dataElement.fullname + "-" + call.fullname;
			})
			.attr("fill", () => {
				return d3.select("#" + dataElement.fullname).attr("fill");
			})
			.attr("stroke", "black")
			.attr("opacity", 0.6);
	});
});

// create from right to left
data2.forEach((dataElement, i) => {
	let roads = d3.select("#roads");
	dataElement.calls.forEach((call, j) => {
		roads
		.append("polygon")
		.attr("points", () => {
			let points: string[] = [];
			let connectorFrom = svgContainer
				.select("#" + dataElement.fullname + "-" + call.fullname);
			let connectorTo = svgContainer
				.select("#" + call.fullname + "-" + dataElement.fullname);
			let ratio: number = call.from / (call.from + call.to);

			points.push( // top left
				(parseInt(connectorTo.attr("x"))
					+ parseInt(connectorTo.attr("width")))
				+ ","
				+ (parseInt(connectorTo.attr("y"))
					+ parseInt(connectorTo.attr("height")) * ratio));
			points.push( // top right
				connectorFrom.attr("x")
				+ ","
				+ (parseInt(connectorFrom.attr("y"))
					+ parseInt(connectorFrom.attr("height")) * ratio));
			points.push( // bottom right
				connectorFrom.attr("x")
				+ ","
				+ (parseInt(connectorFrom.attr("y"))
					+ parseInt(connectorFrom.attr("height"))));
			points.push( // bottom left
				parseInt(connectorTo.attr("x"))
					+ parseInt(connectorTo.attr("width"))
				+ ","
				+ (parseInt(connectorTo.attr("y"))
					+ parseInt(connectorTo.attr("height"))));
			return points.join(" ");
		})
		.attr("id", () => {
			return "#" + dataElement.fullname + "-" + call.fullname;
		})
		.attr("fill", () => {
			return d3.select("#" + dataElement.fullname).attr("fill");
		})
		.attr("stroke", "black")
		.attr("opacity", 0.6);
	});
});

// road A -> E

/*svgContainer
	.append("polygon")
	.attr("points", () => {
		let points: string[] = [];
		let connectorLeft = svgContainer
			.select("#functionA-functionE");
		let connectorRight = svgContainer
			.select("#functionE-functionA");
		points.push(
			(parseInt(connectorLeft.attr("x")) + parseInt(connectorLeft.attr("width")))
			+ ","
			+ connectorLeft.attr("y"));
		points.push(connectorRight.attr("x") + "," + connectorRight.attr("y"));
		points.push(
			connectorRight.attr("x")
			+ ","
			+ (parseInt(connectorRight.attr("y")) + parseInt(connectorRight.attr("height"))).toString() );
		points.push(
			(parseInt(connectorLeft.attr("x")) + parseInt(connectorLeft.attr("width")))
			+ ","
			+ (parseInt(connectorLeft.attr("y")) + parseInt(connectorLeft.attr("height"))).toString() );
		// the last line is automatically 'last point' -> 'first point'
		console.log (points.join(" "));
		return points.join(" ");
	})
	.attr("fill", "green")
	.attr("stroke", "black");*/

/*import {v1 as neo4j} from "neo4j-driver";
import {Result} from "neo4j-driver/types/v1";

// <reference path="./../../node_modules/neo4j-driver/types/v1/index.d.ts"/>

type Neo4jProtocol = "bolt" | "bolt+routing";

let driver: neo4j.Driver;
let session: neo4j.Session;

const connect = (
	protocol: Neo4jProtocol,
	address: string,
	port: number, // does nothing
	username?: string,
	password?: string) => {
		const server = protocol + "://" + address;
		if (username != null && password != null ) {
			driver = neo4j.driver(server, neo4j.auth.basic(username, password));
		} else {
		driver = neo4j.driver(server);
		}

		driver.onCompleted = () => {
			console.log("INFO : Neo4j driver instantiated succesfully.");
		};

		driver.onError = () => {
			console.log("ERROR: Neo4j driver could not be instantiated.");
		};

		session = driver.session();
};

// don't use for now, doesn't wait on respose of active queries, can propably buld in with oncompleted or promise.all
const disconnect = () => {
	session.close();
	driver.close();

	console.log("INFO : Neo4j server disconnected.");
};

let runName: string = "053aad69a52634f446aa0a2fe92c8a3743716bdef437005f7f6ae7097a3c83af";
let focusFullname: string = "0efcb4350213d59eb69ecf7d2e158d296940ef4167859ba3a1
0e5035e0d2addc.d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90b4.
08f5d7eb4ef850ee88134e962814119166896e5f7c13852e51b67661b50933ca.dfe1d833fd784cae1a23514347
9a591c9f1b49eaf79e9b1b562ec1c61964e655.f6857ee688ae5064ea78bb2714492b44fbba8ccdc3993322bcee35d32e9efd3d";
let callFullname: string = "0efcb4350213d59eb69ecf7d2e158d296940ef4167859b
a3a10e5035e0d2addc.d47cc89d468690a9ff92ae003a5fbe5a4bc8b57ef74b3291f286b1da546d90
b4.08f5d7eb4ef850ee88134e962814119166896e5f7c13852e51b67661b50933ca.dfe1d833fd784cae1a23514
3479a591c9f1b49eaf79e9b1b562ec1c61964e655.f6857ee688ae5064ea78bb2714492b44fbba8ccdc3993322bcee35d3
2e9efd3d.9b0b648125b8f7ef416cfa83b54887b346d327888debe83b0df91495111384f2";

session.run(
	"MATCH (class)<-[:IN]-(function:function) WHERE class.fullname = {fullname} RETURN function",
	{
		fullname: focusFullname
	}
).then( (result) => {
	document.getElementById("body").innerHTML = "<pre>" + JSON.stringify(result.records, undefined, 2) + "</pre>";
});

session.run(
	"MATCH (focus)<-[r1:IN]-(function:function)
	WHERE focus.fullname = {fullname} RETURN function.fullname, size((function)<-[:INSTANCEOF]-(:call)) as calls",
	{
		fullname: focusFullname
	}
).then( (result) => {
	document.getElementById("body").innerHTML = "<pre>" + JSON.stringify(result.records, undefined, 2) + "</pre>";
});*/
